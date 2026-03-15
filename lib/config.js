const Conf = require('conf');
const schema = {
	apiKey: {
		type: 'string'
	},
	apiUrl: {
		type: 'string',
		default: 'https://gapsyai.com/api'
	},
	provider: {
		type: 'string',
		default: 'gapsyai',
		enum: ['gapsyai', 'gemini', 'openai', 'ollama', 'custom']
	},
	providerKeys: {
		type: 'object',
		default: {}
	},
	customUrl: {
		type: 'string'
	},
	model: {
		type: 'string'
	},
	providerModels: {
		type: 'object',
		default: {}
	}
};

const config = new Conf({ schema });

module.exports = config;
