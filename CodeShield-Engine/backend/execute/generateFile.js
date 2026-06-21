const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { LANGUAGE_CONFIG } = require('./languageConfig');

const codesDir = path.resolve(__dirname, 'codes_dir');

if (!fs.existsSync(codesDir)) {
    fs.mkdirSync(codesDir, { recursive: true });
}

/**
 * Creates an isolated working directory for a single submission/job and
 * writes the user's source code into it using the correct filename for
 * the target language (e.g. Main.java for Java, which requires the source
 * file name to match the public class name).
 *
 * @param {string} language - One of the keys of LANGUAGE_CONFIG (python, javascript, c, cpp, java, bash).
 * @param {string} code - The source code string to write to disk.
 * @returns {Promise<{ dir: string, filepath: string, filename: string }>} - The isolated job
 *   directory, the absolute host path to the written source file, and the
 *   source file's basename (used to build sandbox-relative commands).
 */
async function generateFile(language, code) {
    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const jobId = randomUUID();
    const dir = path.resolve(codesDir, jobId);
    await fs.promises.mkdir(dir, { recursive: true });

    const filename = config.fixedFilename || `source.${config.extension}`;
    const filepath = path.resolve(dir, filename);

    await fs.promises.writeFile(filepath, code, 'utf-8');

    return { dir, filepath, filename };
}

/**
 * Recursively removes a job's isolated working directory and all of its
 * generated artifacts (source files, compiled binaries/classes, etc).
 * Safe to call even if the directory no longer exists.
 *
 * @param {string} dir - Absolute path to the job directory to remove.
 */
async function cleanupJob(dir) {
    try {
        await fs.promises.rm(dir, { recursive: true, force: true });
    } catch (err) {
        // Non-fatal: log and continue, stale temp dirs do not break the judge.
        console.error(`Failed to clean up job directory ${dir}:`, err.message);
    }
}

module.exports = generateFile;
module.exports.generateFile = generateFile;
module.exports.cleanupJob = cleanupJob;
