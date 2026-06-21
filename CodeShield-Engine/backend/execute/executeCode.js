const { exec } = require('child_process');
const { LANGUAGE_CONFIG } = require('./languageConfig');
const { isDockerAvailable, runInDocker } = require('./dockerExecutor');

const DEFAULT_TIMEOUT_MS = 2000; // platform-wide TLE default per Tier 1 spec
const MAX_TIMEOUT_MS = 15000;
const MAX_BUFFER = 1024 * 1024; // 1 MB stdout/stderr buffer

/**
 * Runs a shell command directly on the host with a timeout, optional stdin,
 * and captures stdout/stderr. Resolves with { stdout, stderr, timedOut, code } -
 * never rejects on non-zero exit, so callers can distinguish between
 * "ran but wrong/error output" vs "infra failure".
 *
 * This is the fallback execution path used when Docker is unavailable or the
 * `codeshield-runner` image has not been built yet.
 */
function runCommandDirect(command, { cwd, inputData, timeoutMs }) {
    return new Promise((resolve) => {
        let timedOut = false;

        const child = exec(command, {
            cwd,
            timeout: timeoutMs,
            maxBuffer: MAX_BUFFER,
            killSignal: 'SIGKILL'
        }, (error, stdout, stderr) => {
            if (error && error.killed && error.signal === 'SIGKILL') {
                timedOut = true;
            }
            resolve({
                stdout: stdout || '',
                stderr: stderr || (error ? error.message : ''),
                timedOut,
                code: error ? (error.code ?? 1) : 0,
                oomKilled: false,
                error
            });
        });

        if (inputData !== undefined && inputData !== null) {
            child.stdin.write(String(inputData));
        }
        child.stdin.end();
    });
}

/**
 * Runs a single command either inside the Docker sandbox or directly on the
 * host, depending on `useDocker`. Normalizes both code paths to the same
 * result shape: { stdout, stderr, timedOut, code, oomKilled }.
 */
async function runCommand(command, { useDocker, hostDir, inputData, timeoutMs }) {
    if (useDocker) {
        return runInDocker(command, { hostDir, inputData, timeoutMs });
    }
    return runCommandDirect(command, { cwd: hostDir, inputData, timeoutMs });
}

/**
 * Compiles source code for languages that require a build step (C, C++, Java).
 * Returns { success: boolean, stderr: string, oomKilled: boolean }.
 */
async function compileIfNeeded(config, filename, dir, { useDocker }) {
    if (!config.needsCompile) {
        return { success: true, stderr: '', oomKilled: false };
    }

    const compileCommand = config.getCompileCommand(filename, dir);
    const result = await runCommand(compileCommand, {
        useDocker,
        hostDir: dir,
        timeoutMs: MAX_TIMEOUT_MS
    });

    if (result.timedOut) {
        return { success: false, stderr: 'Compilation timed out.', oomKilled: false };
    }

    if (result.oomKilled) {
        return { success: false, stderr: 'Compilation exceeded the memory limit.', oomKilled: true };
    }

    if (result.code !== 0) {
        return { success: false, stderr: result.stderr || 'Unknown compilation error.', oomKilled: false };
    }

    return { success: true, stderr: '', oomKilled: false };
}

/**
 * Executes user-submitted source code against a single input string.
 *
 * When Docker is available and the `codeshield-runner` image has been built,
 * compilation and execution both run inside an ephemeral, non-networked,
 * memory-capped container:
 *
 *   docker run --rm -m 256m --network none -v <job_dir>:/sandbox \
 *     codeshield-runner bash -c '<compile-or-run-command>'
 *
 * If Docker is unavailable, the same commands run directly on the host as a
 * fallback so the judge remains functional during local development.
 *
 * @param {string} language - One of: python, javascript, c, cpp, java, bash
 * @param {string} filepath - Absolute host path to the written source file.
 * @param {string} dir - Absolute host path to the job's isolated working directory.
 * @param {string} inputData - The stdin payload for this test case.
 * @param {number} [timeLimitMs] - Optional per-problem time limit (ms), capped at MAX_TIMEOUT_MS.
 * @param {string} [filename] - Basename of the source file (e.g. "source.cpp" or "Main.java").
 *
 * @returns {Promise<{
 *   verdict: 'OK' | 'CompilationError' | 'RuntimeError' | 'TimeLimitExceeded' | 'MemoryLimitExceeded',
 *   stdout: string,
 *   stderr: string,
 *   usedDocker: boolean
 * }>}
 */
async function executeCode(language, filepath, dir, inputData, timeLimitMs, filename) {
    const config = LANGUAGE_CONFIG[language];

    if (!config) {
        return { verdict: 'RuntimeError', stdout: '', stderr: `Unsupported language: ${language}`, usedDocker: false };
    }

    // Derive the source filename from the filepath if not explicitly supplied,
    // so this function remains compatible with callers written against the
    // older (filepath, dir) signature.
    const resolvedFilename = filename || filepath.split(/[\\/]/).pop();

    const timeoutMs = Math.min(timeLimitMs || DEFAULT_TIMEOUT_MS, MAX_TIMEOUT_MS);
    const useDocker = await isDockerAvailable();

    // Inside the container, the job directory is always mounted at /sandbox.
    // On the host, it is the real job directory path.
    const execDir = useDocker ? '/sandbox' : dir;

    // ---- Compilation phase (isolated, captured separately) ----
    const compileResult = await compileIfNeeded(config, resolvedFilename, execDir, { useDocker, hostDir: dir });

    if (!compileResult.success) {
        if (compileResult.oomKilled) {
            return { verdict: 'MemoryLimitExceeded', stdout: '', stderr: compileResult.stderr, usedDocker: useDocker };
        }
        return { verdict: 'CompilationError', stdout: '', stderr: compileResult.stderr, usedDocker: useDocker };
    }

    // ---- Execution phase ----
    const runCommandStr = config.getRunCommand(resolvedFilename, execDir);
    const runResult = await runCommand(runCommandStr, {
        useDocker,
        hostDir: dir,
        inputData,
        timeoutMs
    });

    if (runResult.timedOut) {
        return { verdict: 'TimeLimitExceeded', stdout: runResult.stdout, stderr: 'Execution exceeded the time limit.', usedDocker: useDocker };
    }

    if (runResult.oomKilled) {
        return { verdict: 'MemoryLimitExceeded', stdout: runResult.stdout, stderr: 'Execution exceeded the memory limit.', usedDocker: useDocker };
    }

    if (runResult.code !== 0) {
        return { verdict: 'RuntimeError', stdout: runResult.stdout, stderr: runResult.stderr || 'Process exited with a non-zero status code.', usedDocker: useDocker };
    }

    return { verdict: 'OK', stdout: runResult.stdout, stderr: runResult.stderr, usedDocker: useDocker };
}

module.exports = executeCode;
module.exports.executeCode = executeCode;
module.exports.runCommandDirect = runCommandDirect;
module.exports.DEFAULT_TIMEOUT_MS = DEFAULT_TIMEOUT_MS;
