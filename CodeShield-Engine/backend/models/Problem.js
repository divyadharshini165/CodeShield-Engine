const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
}, { _id: false });

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { 
        type: String, 
        enum: ['Easy', 'Medium', 'Hard'] 
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    timeLimit: { type: Number, default: 2000 }, // in milliseconds
    memoryLimit: { type: Number, default: 512 }, // in MB
    sampleInput: String,
    sampleOutput: String,
    testCases: [testCaseSchema]
});

module.exports = mongoose.model('Problem', problemSchema);