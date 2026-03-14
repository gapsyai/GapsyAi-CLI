const chalk = require('chalk');
const api = require('../lib/api');
const inquirer = require('inquirer');

const dialogue = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'genre', message: 'Genre:', default: 'fantasy RPG' },
		{ type: 'input', name: 'character', message: 'Character:', default: 'old wizard' },
		{ type: 'input', name: 'scene', message: 'Scene:', default: 'player asking about lost sword' }
	]);

	console.log(chalk.blue('\nGenerating dialogue...'));
	try {
		const response = await api.post('/cli/generate/dialogue', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red(`\n✘ Error generating dialogue: ${error.response?.data?.message || error.message}`));
	}
};

const quest = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'theme', message: 'Quest Theme:', default: 'The Lost Relic' }
	]);

	console.log(chalk.blue('\nGenerating quest...'));
	try {
		const response = await api.post('/cli/generate/quest', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating quest.'));
	}
};

const level = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'environment', message: 'Environment:', default: 'jungle' },
		{ type: 'input', name: 'difficulty', message: 'Difficulty:', default: 'medium' }
	]);

	console.log(chalk.blue('\nGenerating level ideas...'));
	try {
		const response = await api.post('/cli/generate/level', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating level ideas.'));
	}
};

const script = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'request', message: 'Script Request:', default: 'Unity player movement script' }
	]);

	console.log(chalk.blue('\nGenerating script...'));
	try {
		const response = await api.post('/cli/generate/script', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(chalk.cyan(response.data.output));
	} catch (error) {
		console.error(chalk.red('Error generating script.'));
	}
};

const idea = async () => {
	console.log(chalk.blue('\nGenerating game idea...'));
	try {
		const response = await api.post('/cli/generate/idea');
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating game idea.'));
	}
};

const sound = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'request', message: 'Sound Prompt:', default: 'laser blast' }
	]);

	console.log(chalk.blue('\nGenerating sound prompt...'));
	try {
		const response = await api.post('/cli/generate/sound', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating sound prompt.'));
	}
};

module.exports = { dialogue, quest, level, script, idea, sound };
