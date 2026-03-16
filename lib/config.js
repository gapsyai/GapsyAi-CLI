const Conf = require('conf').default || require('conf');
if (typeof Conf !== 'function' && Conf.default) {
    // Double check for some weird environments
    Conf = Conf.default;
}
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
		enum: ['gapsyai', 'ai_core', 'openai', 'ollama', 'custom']
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
