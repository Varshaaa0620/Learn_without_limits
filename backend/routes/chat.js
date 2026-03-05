const express = require('express');
const router = express.Router();
const axios = require('axios');

// Hugging Face API configuration
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = 'Nanbeige/Nanbeige4.1-3B';

// Debug logging (remove in production)
console.log('HUGGINGFACE_API_KEY exists:', !!HF_API_KEY);
console.log('HUGGINGFACE_API_KEY length:', HF_API_KEY ? HF_API_KEY.length : 0);

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    if (!HF_API_KEY) {
      return res.status(500).json({ message: 'Hugging Face API key not configured.' });
    }

    // Format conversation history for the model
    let conversation = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    if (conversation) {
      conversation += '\n';
    }
    conversation += `User: ${message}\nAssistant:`;

    // Call Hugging Face Inference API
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        inputs: conversation,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Extract the response text
    let botResponse = '';
    if (Array.isArray(response.data) && response.data.length > 0) {
      botResponse = response.data[0].generated_text || '';
    } else if (response.data.generated_text) {
      botResponse = response.data.generated_text;
    }

    // Clean up the response
    botResponse = botResponse.trim();
    
    // Remove any remaining "User:" or "Assistant:" prefixes
    botResponse = botResponse.replace(/^(User|Assistant):\s*/i, '');

    res.json({
      response: botResponse || 'I apologize, but I could not generate a response. Please try again.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error.response?.data || error.message);
    
    // Handle specific Hugging Face errors
    if (error.response?.status === 503) {
      return res.status(503).json({ 
        message: 'The AI model is currently loading. Please try again in a few moments.' 
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        message: 'Too many requests. Please wait a moment before trying again.' 
      });
    }

    res.status(500).json({ 
      message: 'Failed to get response from AI. Please try again later.' 
    });
  }
});

// Health check for chat API
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    model: HF_MODEL,
    configured: !!HF_API_KEY 
  });
});

module.exports = router;
