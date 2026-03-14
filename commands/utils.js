const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
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

const configOptions = async () => {
	const { prompt } = inquirer;
	const answers = await inquirer.prompt([
		{ type: 'list', name: 'action', message: 'Config option:', choices: ['View API Key', 'Reset API Key', 'View Config'] }
	]);

	if (answers.action === 'View API Key') {
		const key = config.get('apiKey') || 'N/A';
		console.log(chalk.yellow(`Stored API Key: ${key}`));
	} else if (answers.action === 'Reset API Key') {
		config.delete('apiKey');
		console.log(chalk.red('API Key has been removed. Please run gapsyai login again.'));
	} else {
		console.log(chalk.bold('\nGapsyAI CLI Config:'));
		console.log(chalk.gray(JSON.stringify(config.all, null, 2)));
	}
};

const init = async () => {
	console.log(chalk.bold.cyan('\n🚀 GapsyAI Project Initialization\n'));

	const answers = await inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'Project Name:',
			default: path.basename(process.cwd())
		},
		{
			type: 'list',
			name: 'engine',
			message: 'Game Engine:',
			choices: ['Unity', 'Unreal Engine', 'Godot', 'Other']
		},
		{
			type: 'input',
			name: 'scriptsPath',
			message: 'Primary Scripts Directory:',
			default: './Scripts'
		}
	]);

	const gapsyConfig = {
		...answers,
		version: '1.0.0',
		initializedAt: new Date().toISOString()
	};

	fs.writeFileSync('.gapsy', JSON.stringify(gapsyConfig, null, 2));

	console.log(chalk.green('\n✔ .gapsy configuration file created!'));
	console.log(chalk.gray('This context will now be used for AI generators and analyzers.\n'));
};

module.exports = { login, usage, update, config: configOptions, init };
