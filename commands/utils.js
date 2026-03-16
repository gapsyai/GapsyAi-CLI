const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const config = require('../lib/config');
const api = require('../lib/api');

const getModelsForProvider = (provider) => {
	const models = {
		ai_core: [], // Will be fetched dynamically
		openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
		ollama: ['llama3', 'mistral', 'codellama', 'phi3'],
		gapsyai: ['gapsy-v1-standard', 'gapsy-v1-pro']
	};
	return models[provider] || [];
};

const fetchModels = async (provider, apiKey) => {
	console.log(chalk.blue(`Fetching available models for ${provider.toUpperCase()}...`));
	try {
		if (provider === 'ai_core') {
			const axios = require('axios');
			const response = await axios.get(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
			return response.data.models
				.filter(m => m.supportedGenerationMethods.includes('generateContent'))
				.map(m => m.name.replace('models/', ''));
		}
		// Fallback to static list for other providers for now
		return getModelsForProvider(provider);
	} catch (error) {
		console.error(chalk.yellow(`\n⚠ Could not fetch live models: ${error.message}. Switching to defaults.`));
		// Return defaults based on provider
		if (provider === 'ai_core') return ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
		return getModelsForProvider(provider);
	}
};

const login = async () => {
	const { connectionType } = await inquirer.prompt([
		{
			type: 'list',
			name: 'connectionType',
			message: 'How would you like to connect?',
			choices: [
				{ name: 'GapsyAI.com (Recommended - Cloud features & RAG)', value: 'gapsyai' },
				{ name: 'Direct API Connection (BYOK - Gemini, OpenAI, etc.)', value: 'byok' }
			]
		}
	]);

	if (connectionType === 'gapsyai') {
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
			config.set('provider', 'gapsyai');
			
			const models = getModelsForProvider('gapsyai');
			const { model } = await inquirer.prompt([
				{
					type: 'list',
					name: 'model',
					message: 'Select GapsyAI Model:',
					choices: models
				}
			]);
			config.set('model', model);
			config.set('providerModels.gapsyai', model);

			console.log(chalk.green('✔ API Key verified and Model selected successfully!'));
		} catch (error) {
			console.error(chalk.red('✘ Invalid API Key. Please check your token and try again.'));
		}
	} else {
		const { provider } = await inquirer.prompt([
			{
				type: 'list',
				name: 'provider',
				message: 'Select AI Provider:',
				choices: [
					{ name: 'Google Gemini (AI Core)', value: 'ai_core' },
					{ name: 'OpenAI (GPT-4o, etc.)', value: 'openai' },
					{ name: 'Ollama (Local AI)', value: 'ollama' }
				]
			}
		]);

		let apiKey = '';
		if (provider !== 'ollama') {
			const answers = await inquirer.prompt([
				{
					type: 'input',
					name: 'apiKey',
					message: `Enter your ${provider.toUpperCase()} API Key:`,
					validate: value => value.length > 0 ? true : 'Please enter an API key.'
				}
			]);
			apiKey = answers.apiKey;
		}

		config.set('provider', provider);
		if (apiKey) {
			config.set(`providerKeys.${provider}`, apiKey);
		}

		const models = await fetchModels(provider, apiKey);
		if (models.length > 0) {
			const { model } = await inquirer.prompt([
				{
					type: 'list',
					name: 'model',
					message: `Select ${provider} Model:`,
					choices: models
				}
			]);
			config.set('model', model);
			config.set(`providerModels.${provider}`, model);
		}

		console.log(chalk.green(`✔ Connected to ${provider} successfully!`));
		if (provider === 'ai_core') {
			console.log(chalk.gray('Note: You can now use "gapsyai idea" or "gapsyai chat" with your Gemini key.'));
		}
	}
};

const usage = async () => {
	try {
		const response = await api.get('/cli/usage');
		const { used, limit, plan } = response.data;
		
		console.log(chalk.bold('\nGapsyAI Usage Status:'));
		console.log(`Plan: ${chalk.cyan(plan)}`);
		console.log(`Model: ${chalk.green(config.get('model') || 'Not set')}`);
		console.log(`Requests Used: ${chalk.yellow(used)} / ${chalk.yellow(limit)}`);
		console.log(`${chalk.gray('-----------------------')}\n`);
	} catch (error) {
		console.error(chalk.red(`\n✘ Error fetching usage data: ${error.response?.data?.message || error.message}`));
	}
};

const update = async () => {
	console.log(chalk.blue('Checking for updates...'));
	const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });
	const updateInfo = await notifier.fetchInfo();

	if (updateInfo && updateInfo.type !== 'latest') {
		console.log(chalk.yellow(`\nUpdate available: ${chalk.green(updateInfo.latest)} (current: ${updateInfo.current})`));
		console.log(`Type ${chalk.cyan('npm install -g gapsyaicli')} to update.\n`);
		
		const { confirm } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'confirm',
				message: 'Would you like to try updating automatically?',
				default: true
			}
		]);

		if (confirm) {
			console.log(chalk.blue('Updating GapsyAI CLI...'));
			const { exec } = require('child_process');
			exec('npm install -g gapsyaicli', (error, stdout, stderr) => {
				if (error) {
					console.error(chalk.red(`✘ Error updating: ${error.message}`));
					return;
				}
				console.log(chalk.green('✔ GapsyAI CLI updated successfully!'));
			});
		}
	} else {
		console.log(chalk.green('✔ You are already on the latest version.'));
	}
};

const configOptions = async (action, key, value) => {
	// Handle direct commands (e.g., gapsyai config set provider gemini)
	if (action === 'set' && key && value) {
		// Basic mapping for user-friendly keys mentioned in README
		let finalKey = key;
		if (key === 'apiKey' && config.get('provider') !== 'gapsyai') {
			const provider = config.get('provider') || 'ai_core';
			finalKey = `providerKeys.${provider}`;
		}

		config.set(finalKey, value);
		console.log(chalk.green(`✔ Configuration updated: ${key} = ${value}`));
		
		// If setting provider, ask for model
		if (key === 'provider') {
			const models = getModelsForProvider(value);
			if (models.length > 0) {
				const { model } = await inquirer.prompt([
					{ type: 'list', name: 'model', message: `Select ${value} Model:`, choices: models }
				]);
				config.set('model', model);
				config.set(`providerModels.${value}`, model);
				console.log(chalk.green(`✔ Model set to: ${model}`));
			}
		}
		return;
	}

	if (action === 'get' && key) {
		console.log(config.get(key));
		return;
	}

	if (action === 'view') {
		console.log(chalk.bold('\nGapsyAI CLI Config:'));
		console.log(chalk.gray(JSON.stringify(config.all, null, 2)));
		return;
	}

	const { prompt } = inquirer;
	const choices = [
		'View Config',
		'Set AI Provider',
		'Set Provider API Key',
		'Set Model',
		'Set Custom AI URL (Ollama/Local)',
		'Reset All Config'
	];
	
	const answers = await prompt([
		{ type: 'list', name: 'action', message: 'Config option:', choices }
	]);

	if (answers.action === 'View Config') {
		console.log(chalk.bold('\nGapsyAI CLI Config:'));
		console.log(chalk.gray(JSON.stringify(config.all, null, 2)));
	} else if (answers.action === 'Set AI Provider') {
		const { provider } = await prompt([
			{ 
				type: 'list', 
				name: 'provider', 
				message: 'Select AI Provider:', 
				choices: ['gapsyai', 'ai_core', 'openai', 'ollama', 'custom'] 
			}
		]);
		config.set('provider', provider);
		console.log(chalk.green(`✔ AI Provider set to: ${provider}`));
		
		const models = getModelsForProvider(provider);
		if (models.length > 0) {
			const { model } = await prompt([
				{ type: 'list', name: 'model', message: `Select ${provider} Model:`, choices: models }
			]);
			config.set('model', model);
			config.set(`providerModels.${provider}`, model);
			console.log(chalk.green(`✔ Model set to: ${model}`));
		}
	} else if (answers.action === 'Set Provider API Key') {
		const { provider, key } = await prompt([
			{ 
				type: 'list', 
				name: 'provider', 
				message: 'For which provider?', 
				choices: ['ai_core', 'openai'] 
			},
			{
				type: 'input',
				name: 'key',
				message: 'Enter API Key:',
				validate: v => v ? true : 'Key cannot be empty'
			}
		]);
		config.set(`providerKeys.${provider}`, key);
		console.log(chalk.green(`✔ API Key saved for ${provider}`));
	} else if (answers.action === 'Set Model') {
		const provider = config.get('provider') || 'gapsyai';
		const models = getModelsForProvider(provider);
		if (models.length > 0) {
			const { model } = await prompt([
				{ type: 'list', name: 'model', message: `Select ${provider} Model:`, choices: models }
			]);
			config.set('model', model);
			config.set(`providerModels.${provider}`, model);
			console.log(chalk.green(`✔ Model set to: ${model}`));
		} else {
			const { model } = await prompt([
				{ type: 'input', name: 'model', message: 'Enter Model Name:', default: config.get('model') }
			]);
			config.set('model', model);
			console.log(chalk.green(`✔ Model set to: ${model}`));
		}
	} else if (answers.action === 'Set Custom AI URL (Ollama/Local)') {
		const { url } = await prompt([
			{
				type: 'input',
				name: 'url',
				message: 'Enter Custom API URL (e.g., http://localhost:11434/api/generate):',
				default: config.get('customUrl') || 'http://localhost:11434/api/generate'
			}
		]);
		config.set('customUrl', url);
		console.log(chalk.green('✔ Custom URL saved.'));
	} else if (answers.action === 'Reset All Config') {
		config.clear();
		console.log(chalk.red('All configuration has been cleared.'));
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
		},
		{
			type: 'confirm',
			name: 'enableSDK',
			message: 'Enable Neural SDK Integration?',
			default: true
		},
		{
			type: 'input',
			name: 'sdkProjectID',
			message: 'Neural SDK Project Identifier:',
			default: path.basename(process.cwd()),
			when: (answers) => answers.enableSDK
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

const hooks = async (action) => {
	if (action !== 'setup') {
		console.log(chalk.yellow('Supported actions: setup'));
		return;
	}

	const gitDir = path.join(process.cwd(), '.git');
	if (!fs.existsSync(gitDir)) {
		console.error(chalk.red('Not a git repository. Please run "git init" first.'));
		return;
	}

	const hookPath = path.join(gitDir, 'hooks', 'pre-commit');
	const hookContent = `#!/bin/sh\ngapsyai monitor\n`;

	try {
		fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
		console.log(chalk.green('✔ Git pre-commit hook installed! GapsyAI will now monitor your code before every commit.'));
	} catch (error) {
		console.error(chalk.red(`✘ Error installing hook: ${error.message}`));
	}
};

const teamActivity = async () => {
	console.log(chalk.bold.blue('\n👥 Recent Team AI Activity:'));
	try {
        const response = await api.get('/user/teams/activity');
        if (response.data.length === 0) {
            console.log(chalk.gray('No recent team activity.'));
            return;
        }
        response.data.forEach(act => {
            console.log(`${chalk.green(act.user)} ${chalk.gray('generated')} ${chalk.cyan(act.type)} ${chalk.gray('in')} ${chalk.bold(act.project)}`);
        });
	} catch (error) {
		console.error(chalk.red('Error fetching team activity. (Studio Feature)'));
	}
};

const knowledge = async (action, input) => {
	if (action === 'push' && input) {
        console.log(chalk.blue(`\nAdding ${input} to Studio Knowledge Base...`));
        try {
            await api.post('/user/knowledge/push', { brain: input });
            console.log(chalk.green('✔ Brain added to team-wide Knowledge Base.'));
        } catch (error) {
            console.error(chalk.red('Error pushing knowledge.'));
        }
    } else if (action === 'list') {
        console.log(chalk.bold.cyan('\n🧠 Studio Shared Brains:'));
        try {
            const response = await api.get('/user/knowledge/list');
            response.data.forEach(b => console.log(` - ${chalk.bold(b.name)} (${b.creator})`));
        } catch (error) {
            console.error(chalk.red('Error listing knowledge.'));
        }
    } else {
        console.log(chalk.yellow('Usage: gapsyai knowledge <push|list> [brain_file]'));
    }
};

module.exports = { login, usage, update, config: configOptions, init, hooks, teamActivity, knowledge };
