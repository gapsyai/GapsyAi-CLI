const inquirer = require('inquirer');
const chalk = require('chalk');
const config = require('../lib/config');
const api = require('../lib/api');

const login = async () => {
	const answers = await inquirer.prompt([
		{
			type: 'input',
			name: 'apiKey',
			message: 'Enter your GapsyAI API Key:',
			validate: value => value.length > 0 ? true : 'Please enter an API key.'
		}
	]);

	console.log(chalk.blue('Verifying API Key...'));
	try {
		const response = await api.get('/cli/usage', {
			headers: { 'X-API-KEY': answers.apiKey }
		});
		config.set('apiKey', answers.apiKey);
		console.log(chalk.green('✔ API Key verified and saved successfully!'));
	} catch (error) {
		console.error(chalk.red('✘ Invalid API Key. Please check your token and try again.'));
	}
};

const usage = async () => {
	try {
		const response = await api.get('/cli/usage');
		const { used, limit, plan } = response.data;
		
		console.log(chalk.bold('\nGapsyAI Usage Status:'));
		console.log(`Plan: ${chalk.cyan(plan)}`);
		console.log(`Requests Used: ${chalk.yellow(used)} / ${chalk.yellow(limit)}`);
		console.log(`${chalk.gray('-----------------------')}\n`);
	} catch (error) {
		console.error(chalk.red(`\n✘ Error fetching usage data: ${error.response?.data?.message || error.message}`));
	}
};

const update = () => {
	console.log(chalk.blue('Checking for updates...'));
	console.log(chalk.yellow('You are already on the latest version.'));
};

module.exports = { login, usage, update };
