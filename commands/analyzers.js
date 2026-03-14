const chalk = require('chalk');
const api = require('../lib/api');
const fs = require('fs');
const path = require('path');

const bug = async (file) => {
	if (!file) {
		console.error(chalk.red('Please specify a script file. Example: gapsyai bug player.cs'));
		return;
	}

	const filePath = path.resolve(process.cwd(), file);
	if (!fs.existsSync(filePath)) {
		console.error(chalk.red(`File not found: ${file}`));
		return;
	}

	const content = fs.readFileSync(filePath, 'utf8');

	console.log(chalk.blue(`\nAnalyzing ${file} for bugs...`));
	try {
		const response = await api.post('/cli/analyze/bug', { filename: file, content });
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red(`\n✘ Error analyzing script: ${error.response?.data?.message || error.message}`));
	}
};

const balance = async () => {
	console.log(chalk.blue('\nAnalyzing game balance...'));
	// For simplicity, we could ask for input or a config file
	try {
		const response = await api.post('/cli/analyze/balance');
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error analyzing balance.'));
	}
};

const fix = async (file) => {
	if (!file) {
		console.error(chalk.red('Please specify a script file. Example: gapsyai fix player.cs'));
		return;
	}

	const filePath = path.resolve(process.cwd(), file);
	if (!fs.existsSync(filePath)) {
		console.error(chalk.red(`File not found: ${file}`));
		return;
	}

	const content = fs.readFileSync(filePath, 'utf8');

	console.log(chalk.blue(`\nFixing ${file}...`));
	try {
		const response = await api.post('/cli/analyze/fix', { filename: file, content });
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(chalk.green('Fixed Code Applied (Simulated):'));
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error fixing script.'));
	}
};

module.exports = { bug, balance, fix };
