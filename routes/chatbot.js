const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth } = require('../middleware/auth');

// Initialize Gemini Pro
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Campus context for the chatbot
const CAMPUS_CONTEXT = `You are a helpful AI assistant for KLH University's Smart Campus Ecosystem. 
You help students and faculty with:
- Lost & Found: Report and find lost items on campus
- Events: Check upcoming events and register for them
- Feedback: Submit feedback and grievances
- Clubs: Explore and join campus clubs
- General campus information

Always be helpful, friendly, and provide accurate information about campus services.`;

// Chat endpoint
router.post('/chat', auth, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                response: 'Hello! I\'m the Smart Campus AI assistant. How can I help you with Lost & Found, Events, Feedback, or Clubs today?'
            });
        }

        // Generate response with Gemini Pro
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: CAMPUS_CONTEXT }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Understood! I\'m here to help with the KLH University Smart Campus Ecosystem.' }],
                }
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.json({ response });

    } catch (error) {
        console.error('Chatbot error:', error);
        
        // Fallback responses
        const fallbackResponses = {
            'lost': 'You can report lost items in the Lost & Found section. Please provide details like item name, location, and date.',
            'event': 'Check out the Events section to see all upcoming campus events and register for them!',
            'feedback': 'You can submit feedback or grievances in the Feedback section. Your input helps us improve!',
            'club': 'Explore various campus clubs in the Clubs section and join the ones that interest you!',
            'default': 'I\'m here to help with Lost & Found, Events, Feedback, and Clubs. What would you like to know?'
        };

        const lowerMessage = req.body.message.toLowerCase();
        let response = fallbackResponses.default;

        for (const [key, value] of Object.entries(fallbackResponses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }

        res.json({ response });
    }
});

module.exports = router;
