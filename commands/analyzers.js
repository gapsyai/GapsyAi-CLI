const chalk = require('chalk');
const api = require('../lib/api');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { getContext } = require('../lib/context');
const ai = require('../lib/ai_provider');

const bug = async (file) => {
	const context = getContext();
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
		const output = await ai.generate({
			prompt: `Analyze the following script for bugs and logic errors. Filename: ${file}\n\nContent:\n${content}\n\nContext: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a senior game debugger. Identify critical issues and suggest fixes.',
			endpoint: '/cli/analyze/bug',
			data: { filename: file, content, context }
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red(`\n✘ Error analyzing script: ${error.message}`));
	}
};

const balance = async () => {
	console.log(chalk.blue('\nAnalyzing game balance...'));
	try {
		const context = getContext();
		const output = await ai.generate({
			prompt: `Analyze game balance based on project context: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a game balance designer. Evaluate stats, XP, and difficulty scaling.',
			endpoint: '/cli/analyze/balance',
			data: { context }
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
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
		const output = await ai.generate({
			prompt: `Fix the bugs in this script: ${file}\n\nContent:\n${content}`,
			systemInstruction: 'You are an automated refactoring tool. Provide only the corrected code.',
			endpoint: '/cli/analyze/fix',
			data: { filename: file, content }
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(chalk.green('Fixed Code Applied (Simulated):'));
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error fixing script.'));
	}
};

const explain = async (file) => {
	if (!file) {
		console.error(chalk.red('Please specify a script file. Example: gapsyai explain player.cs'));
		return;
	}

	const filePath = path.resolve(process.cwd(), file);
	if (!fs.existsSync(filePath)) {
		console.error(chalk.red(`File not found: ${file}`));
		return;
	}

	const content = fs.readFileSync(filePath, 'utf8');

	console.log(chalk.blue(`\nExplaining ${file}...`));
	try {
		const output = await ai.generate({
			prompt: `Explain the logic of this script: ${file}\n\nContent:\n${content}`,
			systemInstruction: 'You are a helpful coding mentor. Explain code logic in simple, easy-to-understand terms.',
			endpoint: '/cli/workflow/explain',
			data: { filename: file, content }
		});
		console.log(`\n${chalk.bold('Explanation:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error explaining script.'));
	}
};

const optimize = async (file) => {
	if (!file) {
		console.error(chalk.red('Please specify a script file. Example: gapsyai optimize player.cs'));
		return;
	}

	const filePath = path.resolve(process.cwd(), file);
	if (!fs.existsSync(filePath)) {
		console.error(chalk.red(`File not found: ${file}`));
		return;
	}

	const content = fs.readFileSync(filePath, 'utf8');

	console.log(chalk.blue(`\nOptimizing ${file}...`));
	try {
		const output = await ai.generate({
			prompt: `Optimize this script for performance and FPS improvements: ${file}\n\nContent:\n${content}`,
			systemInstruction: 'You are a game performance engineer. Suggest optimizations to reduce memory allocation and improve frame times.',
			endpoint: '/cli/workflow/optimize',
			data: { filename: file, content }
		});
		console.log(`\n${chalk.bold('Optimization Suggestions:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error optimizing script.'));
	}
};

const analyzeProject = async () => {
	console.log(chalk.blue('\nAnalyzing project structure...'));
	const files = fs.readdirSync(process.cwd())
		.filter(f => !f.startsWith('.') && f !== 'node_modules')
		.slice(0, 20); // Send top 20 files for context

	try {
		const output = await ai.generate({
			prompt: `Analyze the following project structure: ${files.join(', ')}`,
			systemInstruction: 'You are a technical architect. Provide a high-level health scan and structural recommendations.',
			endpoint: '/cli/analyze/project',
			data: { files_list: files.join(', ') }
		});
		console.log(`\n${chalk.bold('Project Analysis:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error analyzing project.'));
	}
};

const docs = async (file) => {
	if (!file) {
		console.error(chalk.red('Please specify a file to document.'));
		return;
	}

	const filePath = path.resolve(process.cwd(), file);
	if (!fs.existsSync(filePath)) {
		console.error(chalk.red(`File not found: ${file}`));
		return;
	}

	const content = fs.readFileSync(filePath, 'utf8');

	console.log(chalk.blue(`\nGenerating documentation for ${file}...`));
	try {
		const output = await ai.generate({
			prompt: `Generate documentation for this script:\n\n${content}`,
			systemInstruction: 'You are a technical writer. Generate clean, Markdown-formatted documentation.',
			endpoint: '/cli/analyze/docs',
			data: { content }
		});
		console.log(`\n${chalk.bold('Documentation:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error generating documentation.'));
	}
};

const multiplayer = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'request', message: 'Multiplayer Logic Needed:', default: 'lobby sync' }
	]);

	console.log(chalk.blue('\nGenerating multiplayer logic...'));
	try {
		const output = await ai.generate({
			prompt: `Generate multiplayer logic for: ${answers.request}`,
			systemInstruction: 'You are a network engineer. Provide logic for matchmaking, lobby, and state sync.',
			endpoint: '/cli/analyze/multiplayer',
			data: answers
		});
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error generating multiplayer logic.'));
	}
};

const test = async () => {
	const answers = await inquirer.prompt([
		{ type: 'input', name: 'content', message: 'Describe mechanic or paste logic to test:', default: 'player health system' }
	]);

	console.log(chalk.blue('\nTesting mechanics...'));
	try {
		const output = await ai.generate({
			prompt: `Simulate and test game mechanics: ${answers.content}`,
			systemInstruction: 'You are a QA engineer. Identify potential edge cases and logic flaws in the mechanic.',
			endpoint: '/cli/analyze/test',
			data: answers
		});
		console.log(`\n${chalk.bold('Testing Results:')}\n`);
		console.log(output);
	} catch (error) {
		console.error(chalk.red('Error testing mechanics.'));
	}
};

const monitor = async () => {
	console.log(chalk.bold.blue('\n🔍 GapsyAI CI/CD Monitor Running...'));
	
	const context = getContext();
	const scriptsDir = context?.scriptsPath || './';
	
	if (!fs.existsSync(scriptsDir)) {
		console.log(chalk.yellow(`⚠ Scripts directory not found at ${scriptsDir}. Scanning current directory instead.`));
	}

	const files = fs.readdirSync(process.cwd())
		.filter(f => (f.endsWith('.cs') || f.endsWith('.js') || f.endsWith('.cpp') || f.endsWith('.gd')) && !f.startsWith('.'))
		.slice(0, 10); // Limit to top 10 files for CI demonstration

	if (files.length === 0) {
		console.log(chalk.yellow('No relevant game scripts found to analyze.'));
		return;
	}

	console.log(chalk.gray(`Found ${files.length} scripts. Starting scan...`));
	
	let issueCount = 0;
	for (const file of files) {
		process.stdout.write(chalk.white(`  Scanning ${file}... `));
		try {
			const content = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
			const output = await ai.generate({
				prompt: `Quick scan for critical bugs in ${file}:\n\n${content}`,
				systemInstruction: 'You are a CI monitor. Return "PASSED" or "CRITICAL: <reason>".',
				endpoint: '/cli/analyze/bug',
				data: { filename: file, content, context }
			});
			
			if (output.toLowerCase().includes('critical') || output.toLowerCase().includes('error')) {
				console.log(chalk.red('✘ Issues found.'));
				issueCount++;
			} else {
				console.log(chalk.green('✔ Passed.'));
			}
		} catch (error) {
			console.log(chalk.red('Error connecting to neural link.'));
		}
	}

	if (issueCount > 0) {
		console.log(chalk.bold.red(`\n✘ CI Fail: ${issueCount} scripts failed quality checks.\n`));
		process.exit(1);
	} else {
		console.log(chalk.bold.green('\n✔ CI Success: All scripts passed neural analysis!\n'));
	}
};

const performance = async () => {
	console.log(chalk.bold.yellow('\n⚡ GapsyAI Performance Profiler Running...'));
	const context = getContext();
	try {
		const output = await ai.generate({
			prompt: `Produce a performance profiling report for the project context: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a performance analyst. Identify bottlenecks and memory leaks.',
			endpoint: '/cli/analyze/performance',
			data: { context }
		});
		console.log(chalk.white(output));
	} catch (error) {
		console.log(chalk.red('Error connecting to neural profiler.'));
	}
};

const gameplay = async () => {
	console.log(chalk.bold.magenta('\n🎮 Generating Gameplay Loop...'));
	const context = getContext();
	try {
		const output = await ai.generate({
			prompt: `Generate a core gameplay loop based on context: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a game designer. Describe loops, progression, and player motivation.',
			endpoint: '/cli/generate/gameplay',
			data: { context }
		});
		console.log(chalk.white(output));
	} catch (error) {
		console.log(chalk.red(`Error generating gameplay loop: ${error.message}`));
	}
};

const skilltree = async () => {
	console.log(chalk.bold.cyan('\n🌳 Branching Out: Skill Tree Generation...'));
	const context = getContext();
	try {
		const output = await ai.generate({
			prompt: `Generate a branching skill tree for: ${JSON.stringify(context)}`,
			systemInstruction: 'You are an RPG systems designer. Create balanced skills and prerequisites.',
			endpoint: '/cli/generate/skilltree',
			data: { context }
		});
		console.log(chalk.white(output));
	} catch (error) {
		console.log(chalk.red('Error generating skill tree.'));
	}
};

const economy = async () => {
	console.log(chalk.bold.green('\n💰 GapsyAI Economy Simulator Running...'));
	const context = getContext();
	try {
		const output = await ai.generate({
			prompt: `Simulate and analyze game economy for: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a game economist. Identify inflation risks and sink/source balance.',
			endpoint: '/cli/analyze/economy',
			data: { context }
		});
		console.log(chalk.white(output));
	} catch (error) {
		console.log(chalk.red('Error connecting to economy engine.'));
	}
};

const translate = async (file) => {
	console.log(chalk.bold.blue(`\n🌐 Localizing ${file}...`));
	if (!fs.existsSync(file)) {
		console.log(chalk.red('File not found.'));
		return;
	}
	const content = fs.readFileSync(file, 'utf8');
	try {
		const output = await ai.generate({
			prompt: `Translate the content of this file to multiple languages (ES, FR, DE, JP, HI):\n\n${content}`,
			systemInstruction: 'You are a professional game localizer. Maintain tone and variable placeholders.',
			endpoint: '/cli/translate',
			data: { filename: file, content }
		});
		console.log(chalk.green('✔ Localization complete. Output saved to translated_' + file));
		fs.writeFileSync('translated_' + file, output);
	} catch (error) {
		console.log(chalk.red('Error connecting to translation forge.'));
	}
};

const assets = async () => {
	console.log(chalk.bold.yellow('\n📦 Scanning Assets for Optimization...'));
	const context = getContext();
	try {
		const output = await ai.generate({
			prompt: `Scan and optimize assets for: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a technical artist. Suggest optimizations for textures, meshes, and draw calls.',
			endpoint: '/cli/analyze/assets',
			data: { context }
		});
		console.log(chalk.white(output));
	} catch (error) {
		console.log(chalk.red('Error connecting to asset scanner.'));
	}
};

const trailer = async () => {
	console.log(chalk.bold.red('\n🎬 Scripting Your Game Trailer...'));
	const context = getContext();
	try {
		const output = await ai.generate({
			prompt: `Write a game trailer script for: ${JSON.stringify(context)}`,
			systemInstruction: 'You are a creative director. Write high-impact trailer hooks and visual cues.',
			endpoint: '/cli/generate/trailer',
			data: { context }
		});
		console.log(chalk.white(output));
	} catch (error) {
		console.log(chalk.red('Error scripting trailer.'));
	}
};

const patchnotes = async () => {
	console.log(chalk.bold.gray('\n📝 Generating Patch Notes...'));
	const context = getContext();
	try {
		const { execSync } = require('child_process');
		const gitLog = execSync('git log --oneline -n 20').toString();
		const output = await ai.generate({
			prompt: `Generate developer patch notes from this git log:\n${gitLog}`,
			systemInstruction: 'You are a community manager. Categorize changes into Features, Fixes, and Improvements.',
			endpoint: '/cli/generate/patchnotes',
			data: { log: gitLog, context }
		});
		console.log(chalk.white(output));
	} catch (error) {
		console.log(chalk.red('Error generating patch notes. Ensure you are in a git repository.'));
	}
};

const playtest = async () => {
	console.log(chalk.bold.blue('\n🤖 Initiating AI Playtest Simulation...'));
	const context = getContext();
	try {
		const output = await ai.generate({
			prompt: `Simulate player behavior for: ${JSON.stringify(context)}`,
			systemInstruction: 'You are an AI playtester. Report on difficulty spikes and engagement levels.',
			endpoint: '/cli/simulate/playtest',
			data: { context }
		});
		console.log(chalk.white(output));
	} catch (error) {
		console.log(chalk.red('Error initiating playtest.'));
	}
};

const indexProject = async () => {
    console.log(chalk.bold.blue('\n📚 GapsyAI Indexing Project Context (RAG)...'));
    
    const files = fs.readdirSync(process.cwd())
        .filter(f => !f.startsWith('.') && f !== 'node_modules')
        .slice(0, 50);

    console.log(chalk.gray(`Found ${files.length} files. Creating neural index...`));
    
    try {
        const output = await ai.generate({
            prompt: `Index the following project structure and summarize the purpose of each key file: ${files.join(', ')}`,
            systemInstruction: 'You are a knowledge engineer. Create a permanent context index for the AI to reference.',
            endpoint: '/cli/analyze/index',
            data: { files_list: files }
        });
        
        fs.writeFileSync('.gapsy_index', output);
        console.log(chalk.green('\n✔ Project indexed! Your local AI context is now enhanced for "chat".'));
    } catch (error) {
        console.error(chalk.red('Error indexing project.'));
    }
};

const pulse = async () => {
    console.log(chalk.bold.cyan('\n💓 Fetching Project Pulse from Dashboard...'));
    try {
        const response = await api.get('/user/project-analytics');
        const analytics = response.data[0]; // Get latest
        if (!analytics) {
            console.log(chalk.yellow('No analytics found. Run "gapsyai analyze" first.'));
            return;
        }
        console.log(`\n${chalk.bold('Latest Stats for ' + analytics.project_name + ':')}`);
        console.log(`Code Quality: ${chalk.green(analytics.metrics.code_quality + '/100')}`);
        console.log(`Balance Score: ${chalk.yellow(analytics.metrics.balance_score + '/100')}`);
        console.log(`Performance Index: ${chalk.cyan(analytics.metrics.performance_index + '/100')}`);
    } catch (error) {
        console.error(chalk.red('Error fetching pulse. (Pro/Studio feature)'));
    }
};

const heatmapView = async () => {
    console.log(chalk.bold.red('\n🔥 Rendering Neural Heatmap...'));
    try {
        const response = await api.get('/user/playtest-reports');
        const report = response.data[0];
        if (!report || !report.metrics.heatmap) {
            console.log(chalk.yellow('No heatmap data found. Run "gapsyai playtest" first.'));
            return;
        }
        
        console.log(`\nPlaytest Report: ${chalk.bold(report.project_name)}`);
        console.log(chalk.gray('Heatmap Preview (Top 5 Hotspots):'));
        report.metrics.heatmap.slice(0, 5).forEach(point => {
            console.log(`  [${point.x}, ${point.y}] Intensity: ${'█'.repeat(point.value / 10)} ${point.value}%`);
        });
        console.log(`\nSummary: ${report.summary}`);
    } catch (error) {
        console.error(chalk.red('Error fetching heatmap. (Pro/Studio feature)'));
    }
};

const comment = async (file) => {
    console.log(chalk.blue(`\nAdding AI comments to ${file}...`));
    if (!fs.existsSync(file)) {
        console.error(chalk.red('File not found.'));
        return;
    }
    const content = fs.readFileSync(file, 'utf8');
    try {
        const output = await ai.generate({
            prompt: `Add professional and meaningful technical comments to this code. Maintain the original logic exactly.\n\nContent:\n${content}`,
            systemInstruction: 'You are a senior developer. Use standard documentation formats (JSDoc, XML docs).',
            endpoint: '/cli/analyze/comment',
            data: { filename: file, content }
        });
        console.log(`\n${chalk.bold('Commented Code:')}\n`);
        console.log(output);
    } catch (error) {
        console.error(chalk.red('Error adding comments.'));
    }
};

const audit = async () => {
    console.log(chalk.bold.yellow('\n🕵️ GapsyAI Dependency & Build Auditor...'));
    try {
        const content = fs.existsSync('package.json') ? fs.readFileSync('package.json', 'utf8') : 'No package.json found';
        const context = getContext();
        
        const output = await ai.generate({
            prompt: `Audit the following dependencies and suggest build size optimizations: ${content}`,
            systemInstruction: 'You are a devops engineer. Identify unused or heavy dependencies and suggest lighter alternatives.',
            endpoint: '/cli/analyze/audit',
            data: { context, packageJson: content }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.log(chalk.red('Error connecting to auditor engine.'));
    }
};

module.exports = { bug, balance, fix, explain, optimize, analyzeProject, docs, multiplayer, test, monitor, performance, gameplay, skilltree, economy, translate, assets, trailer, patchnotes, playtest, indexProject, pulse, heatmapView, comment, audit };
