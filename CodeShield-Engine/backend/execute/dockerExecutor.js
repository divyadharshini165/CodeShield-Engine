const { exec } = require('child_process');

const DOCKER_RUNNER_IMAGE = process.env.DOCKER_RUNNER_IMAGE || 'codeshield-runner';
const DOCKER_MEMORY_LIMIT = process.env.DOCKER_MEMORY_LIMIT || '256m';
const DOCKER_MAX_BUFFER = 1024 * 1024; // 1 MB stdout/stderr buffer
const DOCKER_AVAILABILITY_CACHE_MS = 30000;

let cachedAvailability = null; // { value: boolean, checkedAt: number }

/**
 * Checks whether Docker is installed, the daemon is reachable, and the
 * CodeShield runner image has been built. The result is cached briefly to
 * avoid shelling out on every single test case.
 *
 * @param {boolean} [force=false] - Bypass the cache and re-check immediately.
 * @returns {Promise<boolean>}
 */
async function isDockerAvailable(force = false) {
    const now = Date.now();
    if (!force && cachedAvailability && (now - cachedAvailability.checkedAt) < DOCKER_AVAILABILITY_CACHE_MS) {
        return cachedAvailability.value;
    }

    const value = await new Promise((resolve) => {
        exec('docker info', { timeout: 5000 }, (infoErr) => {
            if (infoErr) {
                return resolve(false);
            }
            exec(`docker image inspect ${DOCKER_RUNNER_IMAGE}`, { timeout: 5000 }, (imgErr) => {
                resolve(!imgErr);
            });
        });
    });

    cachedAvailability = { value, checkedAt: now };
    return value;
}

/**
 * Runs a command inside an ephemeral, non-networked Docker container with a
 * memory cap, mounting the job's host working directory at /sandbox.
 *
 * Equivalent to:
 *   docker run --rm -m 256m --network none -v <dir>:/sandbox <image> bash -c '<command>'
 *
 * @param {string} command - The shell command to run *inside* the container,
 *   referencing paths under /sandbox (e.g. `g++ "/sandbox/source.cpp" -o "/sandbox/a.out"`).
 * @param {object} options
 * @param {string} options.hostDir - Absolute host path to bind-mount at /sandbox.
 * @param {string} [options.inputData] - stdin payload to feed the container's process.
 * @param {number} options.timeoutMs - Wall-clock timeout enforced on the host side.
 * @returns {Promise<{ stdout: string, stderr: string, timedOut: boolean, code: number, oomKilled: boolean }>}
 */
function runInDocker(command, { hostDir, inputData, timeoutMs }) {
    return new Promise((resolve) => {
        let timedOut = false;

        // Escape single quotes for the outer `bash -c '...'` wrapper.
        const escaped = command.replace(/'/g, `'\\''`);

        const dockerArgs = [
            'run', '--rm',
            '-i',
            '-m', DOCKER_MEMORY_LIMIT,
            '--memory-swap', DOCKER_MEMORY_LIMIT, // disallow swap beyond the memory cap
            '--network', 'none',
            '--pids-limit', '128',
            '-v', `${hostDir}:/sandbox`,
            DOCKER_RUNNER_IMAGE,
            'bash', '-c', `'${escaped}'`
        ];

        const fullCommand = `docker ${dockerArgs.join(' ')}`;

        const child = exec(fullCommand, {
            timeout: timeoutMs,
            maxBuffer: DOCKER_MAX_BUFFER,
            killSignal: 'SIGKILL'
        }, (error, stdout, stderr) => {
            let code = 0;
            let oomKilled = false;

            if (error) {
                if (error.killed && error.signal === 'SIGKILL') {
                    timedOut = true;
                }
                code = typeof error.code === 'number' ? error.code : 1;
            }

            // Docker surfaces the *container's* exit code as the exit code of
            // `docker run`. A cgroup OOM-kill terminates the process with
            // SIGKILL, which the kernel reports as exit code 137 (128 + 9).
            if (code === 137 && !timedOut) {
                oomKilled = true;
            }

            resolve({
                stdout: stdout || '',
                stderr: stderr || (error ? error.message : ''),
                timedOut,
                code,
                oomKilled
            });
        });

        if (inputData !== undefined && inputData !== null) {
            child.stdin.write(String(inputData));
        }
        child.stdin.end();
    });
}

module.exports = {
    isDockerAvailable,
    runInDocker,
    DOCKER_RUNNER_IMAGE,
    DOCKER_MEMORY_LIMIT
};
