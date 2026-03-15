const config = require('./config');
const axios = require('axios');
const chalk = require('chalk');

/**
 * AI Provider Layer
 * Responsibilities:
 * - Route requests to the selected provider
 * - Handle provider-specific formatting
 * - Fallback to GapsyAI if no provider is configured
 */

const callGemini = async (prompt, systemInstruction = '') => {
    const key = config.get('providerKeys.gemini');
    if (!key) throw new Error('Gemini API Key not found. Run "gapsyai config" to set it.');
    
    const model = config.get('model') || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const response = await axios.post(url, {
        contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }]
    });
    return response.data.candidates[0].content.parts[0].text;
};

const callOpenAI = async (prompt, systemInstruction = '') => {
    const key = config.get('providerKeys.openai');
    if (!key) throw new Error('OpenAI API Key not found. Run "gapsyai config" to set it.');
    
    const model = config.get('model') || 'gpt-4o-mini';
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: model,
        messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
        ]
    }, {
        headers: { 'Authorization': `Bearer ${key}` }
    });
    return response.data.choices[0].message.content;
};

const callOllama = async (prompt, systemInstruction = '') => {
    const url = config.get('customUrl') || 'http://localhost:11434/api/generate';
    const model = config.get('model') || 'llama3';
    const response = await axios.post(url, {
        model: model,
        prompt: `${systemInstruction}\n\n${prompt}`,
        stream: false
    });
    return response.data.response;
};

const callGapsyAI = async (endpoint, data) => {
    const api = require('./api');
    const response = await api.post(endpoint, data);
    return response.data.output;
};

const generate = async (options) => {
    const provider = config.get('provider');
    const { prompt, systemInstruction, endpoint, data } = options;

    if (provider === 'gapsyai') {
        return await callGapsyAI(endpoint, data);
    }

    console.log(chalk.gray(`\n[AI: Using ${provider.toUpperCase()}]`));

    switch (provider) {
        case 'gemini':
            return await callGemini(prompt, systemInstruction);
        case 'openai':
            return await callOpenAI(prompt, systemInstruction);
        case 'ollama':
        case 'custom':
            return await callOllama(prompt, systemInstruction);
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
};

module.exports = { generate };
