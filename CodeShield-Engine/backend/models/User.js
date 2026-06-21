const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [24, 'Username cannot exceed 24 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    solvedProblems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }],
    // Timestamped record of each first-time solve, used to power the
    // cumulative "challenges solved over time" progression graph. Kept
    // separate from `solvedProblems` (which is just the deduplicated ID
    // list used for quick "is this solved?" lookups) so the dashboard can
    // chart solve velocity without re-deriving dates from the Submission
    // collection on every request.
    solvedHistory: [{
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
        solvedAt: { type: Date, default: Date.now }
    }],
    // Daily coding streak. `lastSolvedDate` is stored as a YYYY-MM-DD
    // string (UTC) so consecutive-day comparisons are simple string/date
    // arithmetic rather than fiddly timezone-sensitive Date math.
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastSolvedDate: {
        type: String, // YYYY-MM-DD
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving (Mongoose 9+ async hooks — no next callback)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive fields when serializing
userSchema.methods.toSafeObject = function () {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        solvedProblems: this.solvedProblems,
        currentStreak: this.currentStreak,
        longestStreak: this.longestStreak,
        lastSolvedDate: this.lastSolvedDate,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
