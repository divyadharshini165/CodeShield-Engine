/**
 * Database Seeding Controller
 * -----------------------------------------------------------------------
 * Programmatically composes and inserts the full CodeShield problem bank:
 * - 40 Easy
 * - 35 Medium
 * - 25 Hard
 * = 100 distinct Data Structures & Algorithms challenges total
 *
 * Usage:
 * node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('./models/Problem');

const easyProblems = require('./seedData/easy');
const mediumProblems = require('./seedData/medium');
const hardProblems = require('./seedData/hard_new');
const hardExtraProblems = require('./seedData/hard_extra');
const { enrichTags } = require('./seedData/tagMap');

const mongoURI = process.env.MONGO_URI;

const EXPECTED_COUNTS = { Easy: 40, Medium: 35, Hard: 25 };

function buildProblemBank() {
    const hardCombined = [...hardProblems, ...hardExtraProblems];

    const bank = [
        ...easyProblems,
        ...mediumProblems,
        ...hardCombined
    ].map((problem) => ({
        ...problem,
        tags: enrichTags(problem.title, problem.category, problem.tags || [])
    }));

    // Validate counts and shape before touching the database.
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    
    bank.forEach((problem, idx) => {
        if (!EXPECTED_COUNTS[problem.difficulty]) {
            throw new Error(`Problem at index ${idx} ("${problem.title}") has an invalid difficulty: ${problem.difficulty}`);
        }
        if (!problem.title || !problem.description || !problem.category) {
            throw new Error(`Problem at index ${idx} is missing a required field (title/description/category).`);
        }
        if (!Array.isArray(problem.testCases) || problem.testCases.length < 3) {
            throw new Error(`Problem "${problem.title}" must define at least 3 test cases.`);
        }
        if (problem.testCases.length > 5) {
            throw new Error(`Problem "${problem.title}" defines more than 5 test cases.`);
        }
        
        // HARD STOP FOR MISSING EXPECTED OUTPUTS
        problem.testCases.forEach((tc, tcIdx) => {
            if (!tc || typeof tc !== 'object' || !('expectedOutput' in tc) || tc.expectedOutput === undefined || tc.expectedOutput === null || String(tc.expectedOutput).trim() === "") {
                throw new Error(`\n\n❌ CRITICAL CRASH: PROBLEM MISSING OUTPUT!\nProblem Title: "${problem.title}"\nDifficulty: ${problem.difficulty}\nBroken Test Case Index: ${tcIdx}\n\n`);
            }
        });

        if (!Array.isArray(problem.tags) || problem.tags.length === 0) {
            throw new Error(`Problem "${problem.title}" has no tags after enrichment.`);
        }
        counts[problem.difficulty] += 1;
    });

    Object.entries(EXPECTED_COUNTS).forEach(([difficulty, expected]) => {
        if (counts[difficulty] !== expected) {
            throw new Error(`Expected ${expected} ${difficulty} problems but found ${counts[difficulty]}.`);
        }
    });

    return bank;
}

async function seed() {
    try {
        const problemBank = buildProblemBank();
        console.log(`Prepared ${problemBank.length} problems.`);

        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding.');

        await Problem.deleteMany({});
        console.log('Cleared Problem collection.');

        await Problem.insertMany(problemBank);
        console.log(`Inserted ${problemBank.length} seed problems successfully.`);
    } catch (err) {
        console.error('Seeding error:', err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

seed();