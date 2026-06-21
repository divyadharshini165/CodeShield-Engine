const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/authMiddleware');
const Groq = require('groq-sdk');

// Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------------------------------------------------------------------------
// POST /api/ai/hint
// ---------------------------------------------------------------------------
router.post('/hint', optionalAuth, async (req, res) => {
    const { problemTitle, problemDescription, language, code } = req.body;

    if (!problemDescription || !code) {
        return res.status(400).json({ error: 'problemDescription and code are required.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        // Utilizing Llama 3 8B - incredibly fast and accurate for algorithm tasks
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful algorithmic coach for CodeShield. Provide exactly 1 or 2 concise sentences nudging the user in the right direction without writing code or revealing solutions. Be direct.'
                },
                {
                    role: 'user',
                    content: `Problem: ${problemTitle || 'Untitled'}\nDescription: ${problemDescription}\nLanguage: ${language || ''}\nCode:\n${code.slice(0, 1500)}`
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.4,
            max_tokens: 120
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "No hint generated.";
        
        res.write(`data: ${JSON.stringify({ token: aiResponse })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    } catch (err) {
        res.write(`data: ${JSON.stringify({ error: `Groq Cloud Error: ${err.message}` })}\n\n`);
        res.end();
    }
});

// ---------------------------------------------------------------------------
// POST /api/ai/review
// ---------------------------------------------------------------------------
router.post('/review', optionalAuth, async (req, res) => {
    const { problemTitle, problemDescription, language, code, verdict, executionTime } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'code is required.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a senior software engineer at CodeShield. Provide exactly: 1. Time complexity (Big-O string), 2. Space complexity (Big-O string), 3. Two quick micro-optimisations (1 sentence each), 4. One positive remark. Be ultra-concise.'
                },
                {
                    role: 'user',
                    content: `Problem: ${problemTitle || 'Untitled'}\nVerdict: ${verdict || 'Unknown'} (${executionTime || 0}ms)\nLanguage: ${language || ''}\nCode:\n${code.slice(0, 1800)}`
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.3,
            max_tokens: 200
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "No review analysis available.";
        
        res.write(`data: ${JSON.stringify({ token: aiResponse })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    } catch (err) {
        res.write(`data: ${JSON.stringify({ error: `Groq Cloud Error: ${err.message}` })}\n\n`);
        res.end();
    }
});

// ---------------------------------------------------------------------------
// GET /api/ai/status
// ---------------------------------------------------------------------------
router.get('/status', async (_req, res) => {
    res.json({
        available: !!process.env.GROQ_API_KEY,
        model: 'llama-3.1-8b-instant',
        host: 'Groq Cloud LPU Platform'
    });
});

module.exports = router;