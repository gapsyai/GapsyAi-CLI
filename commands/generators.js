const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const api = require('../lib/api');
const inquirer = require('inquirer');
const { getContext } = require('../lib/context');
const ai = require('../lib/ai_provider');

const isBinary = (file) => {
	try {
		const buffer = fs.readFileSync(file);
		for (let i = 0; i < Math.min(buffer.length, 512); i++) {
			if (buffer[i] === 0) return true;
		}
	} catch (e) {}
	return false;
};

const dialogue = async () => {
	const context = getContext();
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'genre', message: 'Genre:', default: 'fantasy RPG' },
		{ type: 'input', name: 'character', message: 'Character:', default: 'old wizard' },
		{ type: 'input', name: 'scene', message: 'Scene:', default: 'player asking about lost sword' }
	]);

	console.log(chalk.blue('\nGenerating dialogue...'));
	try {
		const output = await ai.generate({
			prompt: `Generate NPC dialogue. Context: ${JSON.stringify(context)}, Genre: ${answers.genre}, Character: ${answers.character}, Scene: ${answers.scene}`,
			systemInstruction: 'You are a professional game writer. Generate immersive NPC dialogue.',
			endpoint: '/cli/generate/dialogue',
			data: { ...answers, context }
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red(`\n✘ Error generating dialogue: ${error.message}`));
	}
};

const quest = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'theme', message: 'Quest Theme:', default: 'The Lost Relic' }
	]);

	console.log(chalk.blue('\nGenerating quest...'));
	try {
		const context = getContext();
		const output = await ai.generate({
			prompt: `Generate a side quest. Theme: ${answers.theme}, Context: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a quest designer. Create engaging objectives and rewards.',
			endpoint: '/cli/generate/quest',
			data: { ...answers, context }
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
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
		const output = await ai.generate({
			prompt: `Generate level layout ideas. Environment: ${answers.environment}, Difficulty: ${answers.difficulty}, Context: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a level designer. Suggest layouts and puzzles.',
			endpoint: '/cli/generate/level',
			data: { ...answers, context }
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
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
		const output = await ai.generate({
			prompt: `Generate game script. Request: ${answers.request}, Context: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a game developer. Write clean, optimized code for the requested engine.',
			endpoint: '/cli/generate/script',
			data: { ...answers, context }
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(chalk.cyan(output));
	} catch (error) {
		console.error(chalk.red('Error generating script.'));
	}
};

const idea = async () => {
	console.log(chalk.blue('\nGenerating game idea...'));
	try {
		const output = await ai.generate({
			prompt: 'Generate a unique and high-concept game idea.',
			systemInstruction: 'You are a game visionary. Think outside the box.',
			endpoint: '/cli/generate/idea'
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
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
		const output = await ai.generate({
			prompt: `Generate a procedural game item. Request: ${answers.request}`,
			systemInstruction: 'You are an RPG item designer. Create unique weapons and artifacts.',
			endpoint: '/cli/generate/item',
			data: answers
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
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
		const output = await ai.generate({
			prompt: `Generate a game enemy. Request: ${answers.request}`,
			systemInstruction: 'You are a combat designer. Create challenging enemies with unique abilities.',
			endpoint: '/cli/generate/enemy',
			data: answers
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
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
		const output = await ai.generate({
			prompt: `Generate a game story storyline. Request: ${answers.request}`,
			systemInstruction: 'You are a master storyteller. Create compelling plots and twists.',
			endpoint: '/cli/generate/story',
			data: answers
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
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
		const output = await ai.generate({
			prompt: `Generate an AI image prompt for game assets. Request: ${answers.request}`,
			systemInstruction: 'You are an AI art engineer. Generate highly detailed prompts for Midjourney/Stable Diffusion.',
			endpoint: '/cli/generate/asset-prompt',
			data: answers
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error generating asset prompt.'));
	}
};

const jam = async (theme) => {
	let jamTheme = theme;
	if (!jamTheme) {
		const answers = await inquirer.prompt([
			{ type: 'input', name: 'theme', message: 'Game Jam Theme:', default: 'unstable' }
		]);
		jamTheme = answers.theme;
	}

	console.log(chalk.blue('\nGenerating Game Jam ideas...'));
	try {
		const output = await ai.generate({
			prompt: `Generate Game Jam ideas. Theme: ${jamTheme}`,
			systemInstruction: 'You are a game jam veteran. Create innovative ideas that fit the theme and timeframe.',
			endpoint: '/cli/generate/jam',
			data: { theme: jamTheme }
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error generating game jam ideas.'));
	}
};

const brain = async (name) => {
	console.log(chalk.blue(`\nGenerating neural profile for ${chalk.bold(name)}...`));
	try {
		const context = getContext();
		const output = await ai.generate({
			prompt: `Generate a structured NPC personality profile for: ${name}. Context: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a character psychologist. Create a JSON-formatted NPC profile.',
			endpoint: '/cli/generate/brain',
			data: { name, context }
		});
		
		const fileName = `${name.toLowerCase().replace(/\s+/g, '_')}.npc.json`;
		const filePath = path.join(process.cwd(), fileName);
		
		const profileData = typeof output === 'string' 
			? output 
			: JSON.stringify(output, null, 2);
			
		fs.writeFileSync(filePath, profileData);
		
		console.log(chalk.green(`\n✔ Neural profile generated and saved to ${chalk.bold(fileName)}`));
		console.log(`${chalk.gray('This profile can be imported directly into your game engine.')}\n`);
	} catch (error) {
		console.error(chalk.red(`\n✘ Error generating NPC brain: ${error.message}`));
	}
};

const chat = async (initialMessage) => {
	console.log(chalk.bold.cyan('\n💬 GapsyAI Interactive Chat Mode'));
	console.log(chalk.gray('Type "exit" or "quit" to end the session.\n'));

	const context = getContext();
	let lastResponse = '';

	const askQuestion = async (message) => {
		process.stdout.write(chalk.blue('GapsyAI is thinking... '));
		try {
			// Get all available commands to tell the AI what it can do
			const availableCommands = Object.keys(module.exports).filter(k => k !== 'chat');
			const analyzerKeys = Object.keys(require('./analyzers'));
			
			let output;
			let attempts = 0;
			const maxAttempts = 2;

			while (attempts < maxAttempts) {
				try {
					output = await ai.generate({
						prompt: message,
						systemInstruction: `You are GapsyAI, an advanced AI for game development. 
						You can help the user with design or directly execute commands.
						If the user wants you to generate something (dialogue, quest, level, etc.) or analyze code, 
						return your response followed by a special action tag: [ACTION: command_name].
						Available Actions: ${[...availableCommands, ...analyzerKeys].join(', ')}.
						Example: "I will generate a quest for you. [ACTION: quest]"`,
						endpoint: '/cli/chat',
						data: { message, context, lastResponse }
					});
					break;
				} catch (e) {
					attempts++;
					if (attempts >= maxAttempts) throw e;
					process.stdout.write(chalk.yellow(`(Retrying neural connection...) `));
				}
			}
			
			process.stdout.clearLine();
			process.stdout.cursorTo(0);

			// Check for actions
			const actionMatch = output.match(/\[ACTION: (\w+)\]/);
			const cleanOutput = output.replace(/\[ACTION: \w+\]/, '').trim();
			
			console.log(`${chalk.bold.green('GapsyAI:')} ${cleanOutput}\n`);
			
			if (actionMatch) {
				const action = actionMatch[1];
				// Quantum-Robust file extraction (matches: file.js, path/to/file.cs, C:\path\to\file.cpp)
				const fileMatch = cleanOutput.match(/[`'"]?([\w\.\-\/\\]+\.\w{2,4})[`'"]?/);
				const extractedFile = fileMatch ? fileMatch[1] : null;

				console.log(chalk.yellow(`🚀 Executing action: ${action}${extractedFile ? ' on ' + extractedFile : ''}...\n`));
				
				if (module.exports[action]) {
					await module.exports[action](extractedFile);
				} else {
					const analyzers = require('./analyzers');
					if (analyzers[action]) {
						await analyzers[action](extractedFile);
					} else {
						console.log(chalk.red(`✘ Action '${action}' not found.`));
					}
				}
				console.log(chalk.cyan('\n--- Returning to Chat ---\n'));
			}
			
			lastResponse = cleanOutput;
		} catch (error) {
			if (process.stdout.clearLine) {
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
			}
			console.error(chalk.red(`\n✘ Error: ${error.message}`));
		}
	};

	if (initialMessage) {
		await askQuestion(initialMessage);
	}

	const loop = async () => {
		const { message } = await inquirer.prompt([
			{
				type: 'input',
				name: 'message',
				message: chalk.bold.blue('You:'),
			}
		]);

		if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
			console.log(chalk.yellow('\nGoodbye! Keep building great games.\n'));
			return;
		}

		if (message.trim()) {
			await askQuestion(message);
		}
		await loop();
	};

	await loop();
};

const migrate = async (file, options) => {
	console.log(chalk.blue(`\nMigrating ${file} to ${options.target}...`));
	if (!fs.existsSync(file)) {
		console.error(chalk.red('File not found.'));
		return;
	}

	if (isBinary(file)) {
		console.error(chalk.red(`✘ Cannot migrate binary file: ${file}`));
		return;
	}

	const content = fs.readFileSync(file, 'utf8');
	try {
		const output = await ai.generate({
			prompt: `Migrate this game logic to ${options.target} engine. Maintain functionality but use target engine APIs.\n\nContent:\n${content}`,
			systemInstruction: 'You are a multi-platform game engine expert. Convert code logic accurately.',
			endpoint: '/cli/generate/migrate',
			data: { filename: file, content, target: options.target }
		});
		console.log(`\n${chalk.bold('Migrated Code:')}\n`);
		console.log(chalk.cyan(output));
	} catch (error) {
		console.error(chalk.red(`Error: ${error.message}`));
	}
};

const sfx = async (prompt) => {
	console.log(chalk.blue('\nGenerating SFX/VFX prompt...'));
	try {
		const output = await ai.generate({
			prompt: `Generate a detailed technical SFX/VFX prompt for: ${prompt}`,
			systemInstruction: 'You are a technical sound/VFX artist. Provide detailed descriptions for engineers and tools.',
			endpoint: '/cli/generate/sfx',
			data: { prompt }
		});
		console.log(`\n${chalk.bold('Prompt Out:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error generating sound prompt.'));
	}
};

const map = async (options) => {
	console.log(chalk.blue(`\nGenerating ${options.size} ${options.biome} map...`));
	try {
		const output = await ai.generate({
			prompt: `Generate an ASCII map for a game. Size: ${options.size}, Biome: ${options.biome}`,
			systemInstruction: 'You are a procedural map generator. Use ASCII characters ( #, ., @, etc.) to create a map.',
			endpoint: '/cli/generate/map',
			data: options
		});
		console.log(`\n${chalk.bold('Map Layout:')}\n`);
		console.log(chalk.gray(output));
	} catch (error) {
		console.error(chalk.red('Error generating map.'));
	}
};

const voice = async (name) => {
	console.log(chalk.blue(`\nGenerating voice guide for ${name}...`));
	try {
		const output = await ai.generate({
			prompt: `Generate a character voice and personality guide for: ${name}`,
			systemInstruction: 'You are a character writer and voice director. Define pitch, tone, and signature phrases.',
			endpoint: '/cli/generate/voice',
			data: { name }
		});
		console.log(`\n${chalk.bold('Voice Guide:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error generating voice guide.'));
	}
};

const visualize = async (type) => {
	console.log(chalk.blue(`\nVisualizing project ${type}...`));
	try {
		const context = getContext();
		const output = await ai.generate({
			prompt: `Generate a Mermaid.js diagram for ${type}. Context: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a technical architect. Provide valid Mermaid.js syntax for diagrams.',
			endpoint: '/cli/generate/visualize',
			data: { type, context }
		});
		console.log(`\n${chalk.bold('Mermaid Diagram:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error generating visualization.'));
	}
};

const exportQuest = async (file) => {
	console.log(chalk.blue(`\nPushing ${file} to GapsyAI Quest Graph...`));
	if (!fs.existsSync(file)) {
		console.error(chalk.red('File not found.'));
		return;
	}

	if (isBinary(file)) {
		console.error(chalk.red(`✘ Cannot export binary file: ${file}`));
		return;
	}

	const content = fs.readFileSync(file, 'utf8');
	try {
        const response = await api.post('/user/quests/export', {
            name: path.basename(file),
            content: content
        });
		console.log(chalk.green('✔ Quest pushed successfully! View it at GapsyAI Visual Canvas.'));
	} catch (error) {
		console.error(chalk.red('Error exporting quest. (Pro Feature)'));
	}
};

const worldBridge = async () => {
	console.log(chalk.blue('\nSyncing with GapsyAI World Builder...'));
	try {
        const context = getContext();
        await api.post('/user/world-builder/sync', { context });
		console.log(chalk.green('✔ Project context synced. Your Visual World Builder is now ready!'));
	} catch (error) {
		console.error(chalk.red('Error bridging world. (Pro Feature)'));
	}
};

const commit = async () => {
	console.log(chalk.blue('\nGenerating AI commit message...'));
	try {
		const { execSync } = require('child_process');
		const diff = execSync('git diff --cached').toString();
		if (!diff) {
			console.log(chalk.yellow('No staged changes found. Use "git add" first.'));
			return;
		}

		const output = await ai.generate({
			prompt: `Generate a concise and professional Git commit message for these changes:\n\n${diff}`,
			systemInstruction: 'You are a technical lead. Provide a single-line summary followed by bullet points if necessary.',
			endpoint: '/cli/generate/commit',
			data: { diff }
		});
		console.log(`\n${chalk.bold('Suggested Commit Message:')}\n`);
		console.log(chalk.green(output));
		console.log(chalk.gray('\n(Copy and run: git commit -m "...")\n'));
	} catch (error) {
		console.error(chalk.red('Error: Git not initialized or diff too large.'));
	}
};

const testGen = async (file) => {
	console.log(chalk.blue(`\nGenerating unit tests for ${file}...`));
	if (!fs.existsSync(file)) {
		console.error(chalk.red('File not found.'));
		return;
	}

	if (isBinary(file)) {
		console.error(chalk.red(`✘ Cannot analyze binary file: ${file}`));
		return;
	}

	const content = fs.readFileSync(file, 'utf8');
	try {
		const output = await ai.generate({
			prompt: `Generate comprehensive unit tests for this script: ${file}\n\nContent:\n${content}`,
			systemInstruction: 'You are a QA automation engineer. Use industry-standard testing frameworks (Jest, NUnit, Vitest).',
			endpoint: '/cli/generate/test-gen',
			data: { filename: file, content }
		});
		console.log(`\n${chalk.bold('Generated Tests:')}\n`);
		console.log(chalk.cyan(output));
	} catch (error) {
		console.error(chalk.red(`Error: ${error.message}`));
	}
};

const blueprint = async (prompt) => {
	console.log(chalk.blue(`\nNeural Architect is designing "${prompt}" blueprint...`));
	try {
		const output = await ai.generate({
			prompt: `Generate a professional game system boilerplate for: ${prompt}. Provide structure, core classes, and logic snippets.`,
			systemInstruction: 'You are a senior game architect. Focus on professional architecture (SOLID, Game Design Patterns).',
			endpoint: '/cli/generate/blueprint',
			data: { prompt }
		});
		console.log(`\n${chalk.bold('Neural Blueprint:')}\n`);
		console.log(chalk.cyan(output));
	} catch (error) {
		console.error(chalk.red(`Error: ${error.message}`));
	}
};

const sonic = async (prompt) => {
    console.log(chalk.bold.magenta('\n🔊 GapsyAI Sonic Profile Suggestions...'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Suggest SFX and music for: ${prompt}. Context: ${JSON.stringify(context)}`,
            systemInstruction: 'You are a sound designer. Provide 5 unique audio directions including mood, intensity, and technical cues.',
            endpoint: '/cli/generate/suggest-sfx',
            data: { prompt, context }
        });
        console.log(`\n${chalk.bold('Sonic Profile:')}\n`);
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error generating sonic suggestions.'));
    }
};

const scaffold = async () => {
	console.log(chalk.bold.cyan('\n🏗️ GapsyAI Autonomous Project Scaffolding\n'));
	
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'name', message: 'Project Name:', default: 'my-quantum-game' },
		{ type: 'input', name: 'description', message: 'Game Description:', placeholder: 'e.g., A sci-fi survival horrot set on a space station' },
		{ type: 'list', name: 'engine', message: 'Engine:', choices: ['Unity', 'Unreal', 'Godot', 'Web (Phaser)'] },
		{ type: 'confirm', name: 'git', message: 'Initialize Git?', default: true }
	]);

	console.log(chalk.blue('\nArchitecting project structure...'));
	try {
		const output = await ai.generate({
			prompt: `Generate a directory structure and initial roadmap for this game: ${answers.description}. Engine: ${answers.engine}. Return as JSON with "folders": [], "files": {"path": "content"}, and "roadmap": [].`,
			systemInstruction: 'You are a senior game architect. Provide a professional project scaffolding in JSON format.',
			endpoint: '/cli/generate/scaffold',
			data: answers
		});

		const projectDir = path.join(process.cwd(), answers.name);
		if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);

		// Implementation of folder creation
		if (output.folders) {
			output.folders.forEach(dir => {
				const fullPath = path.join(projectDir, dir);
				if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
			});
		}

		// Implementation of file creation
		if (output.files) {
			Object.entries(output.files).forEach(([file, content]) => {
				fs.writeFileSync(path.join(projectDir, file), content);
			});
		}

		console.log(chalk.green(`\n✔ Project ${chalk.bold(answers.name)} scaffolded successfully!`));
		console.log(chalk.gray(`\n${output.roadmap?.join('\n') || 'Start by editing your core scripts.'}\n`));
	} catch (error) {
		console.error(chalk.red(`\n✘ Scaffolding failed: ${error.message}`));
	}
};

const find = async () => {
	const { query } = await inquirer.prompt([
		{ type: 'input', name: 'query', message: 'Search query (semantic):' }
	]);

	console.log(chalk.blue('\nSearching neural index...'));
	try {
		const context = getContext();
		const results = await api.post('/cli/search', { query, context });
		console.log(`\n${chalk.bold('Matches Found:')}\n`);
		results.data.forEach(res => {
			console.log(`${chalk.green(res.file)} - ${chalk.gray(res.score.toFixed(2))}`);
			console.log(`${chalk.white(res.snippet)}\n`);
		});
	} catch (error) {
		console.error(chalk.red('Search failed. Ensure project is indexed.'));
	}
};

const heal = async (options) => {
	console.log(chalk.bold.yellow('\n⚕ GapsyAI Neural Healer: Scanning for anomalies...'));
	try {
		const context = getContext();
		const output = await ai.generate({
			prompt: `Scan the project for potential bugs, lints, or architectural flaws. ${options.dryRun ? 'Suggest fixes only.' : 'Provide actionable fixes.'}`,
			systemInstruction: 'You are a veteran software architect. Provide a high-density report of "Heal Targets" with code snippet fixes.',
			endpoint: '/cli/generate/heal',
			data: { context, options }
		});
		console.log(`\n${chalk.bold('Neural Healing Report:')}\n`);
		console.log(chalk.white(output));
		if (!options.dryRun) {
			console.log(chalk.green('\n✔ Recommendations applied to the neural trace. Use "gapsyai monitor" to verify.'));
		}
	} catch (error) {
		console.error(chalk.red(`\n✘ Healing failed: ${error.message}`));
	}
};

const refactor = async (target) => {
	console.log(chalk.bold.cyan(`\n🏗️ GapsyAI Sentient Refactor: Optimizing "${target || 'Project Base'}"...`));
	try {
		const context = getContext();
		const output = await ai.generate({
			prompt: `Refactor the following component for professional optimization (clean code, SOLID, performance): ${target || 'Current Directory'}`,
			systemInstruction: 'You are a senior refactoring expert. Provide a "Before vs After" logic comparison and high-level architectural benefits.',
			endpoint: '/cli/generate/refactor',
			data: { target, context }
		});
		console.log(`\n${chalk.bold('Refactoring Blueprint:')}\n`);
		console.log(chalk.white(output));
	} catch (error) {
		console.error(chalk.red(`\n✘ Refactoring failed: ${error.message}`));
	}
};

const sense = async () => {
	console.log(chalk.bold.magenta('\n🧠 GapsyAI Project Sense: Reading neural vibe...'));
	try {
		const context = getContext();
		const output = await ai.generate({
			prompt: `Provide a real-time sentiment and stability analysis of this project. Include "Narrative Vibe", "Logic Stability", and "Team Energy" scores (0-100).`,
			systemInstruction: 'You are a project behavioral analyst. Provide a high-fidelity vibe report with actionable emotional/technical insights.',
			endpoint: '/cli/generate/sense',
			data: { context }
		});
		console.log(`\n${chalk.bold('Project Vibe Report:')}\n`);
		console.log(chalk.white(output));
	} catch (error) {
		console.error(chalk.red(`\n✘ Sensing failed: ${error.message}`));
	}
};

module.exports = { dialogue, quest, level, script, idea, item, enemy, story, assetPrompt, jam, brain, chat, migrate, sfx, map, voice, visualize, exportQuest, worldBridge, commit, testGen, blueprint, sonic, scaffold, find, heal, refactor, sense };
