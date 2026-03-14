const Conf = require('conf');
const schema = {
	apiKey: {
		type: 'string'
	},
	apiUrl: {
		type: 'string',
		default: 'http://localhost:8000/api'
	}
};

const config = new Conf({ schema });

module.exports = config;
