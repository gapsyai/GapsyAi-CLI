const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const api = require('../lib/api');
const inquirer = require('inquirer');
const { getContext } = require('../lib/context');

const dialogue = async () => {
	const context = getContext();
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'genre', message: 'Genre:', default: 'fantasy RPG' },
		{ type: 'input', name: 'character', message: 'Character:', default: 'old wizard' },
		{ type: 'input', name: 'scene', message: 'Scene:', default: 'player asking about lost sword' }
	]);

	console.log(chalk.blue('\nGenerating dialogue...'));
	try {
		const response = await api.post('/cli/generate/dialogue', { ...answers, context });
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
		const context = getContext();
		const response = await api.post('/cli/generate/quest', { ...answers, context });
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
		const context = getContext();
		const response = await api.post('/cli/generate/level', { ...answers, context });
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
		const context = getContext();
		const response = await api.post('/cli/generate/script', { ...answers, context });
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

const item = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'request', message: 'Item Type/Description:', default: 'magic sword' }
	]);

	console.log(chalk.blue('\nGenerating item...'));
	try {
		const response = await api.post('/cli/generate/item', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating item.'));
	}
};

const enemy = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'request', message: 'Enemy Type/Description:', default: 'forest spider' }
	]);

	console.log(chalk.blue('\nGenerating enemy...'));
	try {
		const response = await api.post('/cli/generate/enemy', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating enemy.'));
	}
};

const story = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'request', message: 'Story Hook/Theme:', default: 'lost civilization' }
	]);

	console.log(chalk.blue('\nGenerating story...'));
	try {
		const response = await api.post('/cli/generate/story', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating story.'));
	}
};

const assetPrompt = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'request', message: 'Asset Type/Description:', default: 'cyberpunk city background' }
	]);

	console.log(chalk.blue('\nGenerating asset prompt...'));
	try {
		const response = await api.post('/cli/generate/asset-prompt', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating asset prompt.'));
	}
};

const jam = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'theme', message: 'Game Jam Theme:', default: 'unstable' }
	]);

	console.log(chalk.blue('\nGenerating Game Jam ideas...'));
	try {
		const response = await api.post('/cli/generate/jam', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
	} catch (error) {
		console.error(chalk.red('Error generating game jam ideas.'));
	}
};

const brain = async (name) => {
	console.log(chalk.blue(`\nGenerating neural profile for ${chalk.bold(name)}...`));
	try {
		const context = getContext();
		const response = await api.post('/cli/generate/brain', { name, context });
		
		const fileName = `${name.toLowerCase().replace(/\s+/g, '_')}.npc.json`;
		const filePath = path.join(process.cwd(), fileName);
		
		const profileData = typeof response.data.output === 'string' 
			? response.data.output 
			: JSON.stringify(response.data.output, null, 2);
			
		fs.writeFileSync(filePath, profileData);
		
		console.log(chalk.green(`\n✔ Neural profile generated and saved to ${chalk.bold(fileName)}`));
		console.log(`${chalk.gray('This profile can be imported directly into your game engine.')}\n`);
	} catch (error) {
		console.error(chalk.red(`\n✘ Error generating NPC brain: ${error.response?.data?.message || error.message}`));
	}
};

module.exports = { dialogue, quest, level, script, idea, item, enemy, story, assetPrompt, jam, brain };
