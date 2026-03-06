const express = require('express');
const router = express.Router();
const axios = require('axios');

// Hugging Face API configuration
const HF_MODEL = 'Nanbeige/Nanbeige4.1-3B';

// Helper function to get API key at runtime
const getApiKey = () => {
  // Try environment variable first, fallback to hardcoded key
  return process.env.HUGGINGFACE_API_KEY || 'hf_jBWoe1dvZyJAIcDhZcMALhjsRGUBhXDaqj';
};

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const HF_API_KEY = getApiKey();

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    if (!HF_API_KEY) {
      console.error('HUGGINGFACE_API_KEY is not set.');
      console.error('All env keys:', Object.keys(process.env));
      console.error('Looking for HUGGINGFACE:', Object.keys(process.env).filter(k => k.toLowerCase().includes('hugging')));
      return res.status(500).json({ 
        message: 'Hugging Face API key not configured.',
        debug: {
          envKeys: Object.keys(process.env),
          hasKey: false
        }
      });
    }

    // Format conversation history for the model
    let conversation = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    if (conversation) {
      conversation += '\n';
    }
    conversation += `User: ${message}\nAssistant:`;

    // Call Hugging Face Inference API
    const response = await axios.post(
      `https://router.huggingface.co/models/${HF_MODEL}`,
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
    console.error('Chat API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });
    
    // Return detailed error for debugging
    const errorMessage = error.response?.data?.error || error.message;
    
    // Handle specific Hugging Face errors
    if (error.response?.status === 503) {
      return res.status(503).json({ 
        message: 'The AI model is currently loading. Please try again in a few moments.',
        error: errorMessage
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        message: 'Too many requests. Please wait a moment before trying again.',
        error: errorMessage
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        message: 'Invalid API key.',
        error: errorMessage
      });
    }

    res.status(500).json({ 
      message: 'Failed to get response from AI. Please try again later.',
      error: errorMessage,
      debug: {
        hasKey: !!getApiKey(),
        keyLength: getApiKey()?.length,
        model: HF_MODEL
      }
    });
  }
});

// Health check for chat API
router.get('/health', (req, res) => {
  const HF_API_KEY = getApiKey();
  res.json({ 
    status: 'OK', 
    model: HF_MODEL,
    configured: !!HF_API_KEY 
  });
});

module.exports = router;
