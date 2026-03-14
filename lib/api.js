const axios = require('axios');
const config = require('./config');

const apiClient = axios.create({
	baseURL: config.get('apiUrl'),
	headers: {
		'Accept': 'application/json',
		'X-API-KEY': config.get('apiKey')
	}
});

module.exports = apiClient;
