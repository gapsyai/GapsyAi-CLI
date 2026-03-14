const chalk = require('chalk');
const api = require('../lib/api');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { getContext } = require('../lib/context');

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
		const response = await api.post('/cli/analyze/bug', { filename: file, content, context });
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
		const context = getContext();
		const response = await api.post('/cli/analyze/balance', { context });
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
		const response = await api.post('/cli/workflow/explain', { filename: file, content });
		console.log(`\n${chalk.bold('Explanation:')}\n`);
		console.log(response.data.output);
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
		const response = await api.post('/cli/workflow/optimize', { filename: file, content });
		console.log(`\n${chalk.bold('Optimization Suggestions:')}\n`);
		console.log(response.data.output);
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
		const response = await api.post('/cli/analyze/project', { files_list: files.join(', ') });
		console.log(`\n${chalk.bold('Project Analysis:')}\n`);
		console.log(response.data.output);
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
		const response = await api.post('/cli/analyze/docs', { content });
		console.log(`\n${chalk.bold('Documentation:')}\n`);
		console.log(response.data.output);
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
		const response = await api.post('/cli/analyze/multiplayer', answers);
		console.log(`\n${chalk.bold('Output:')}\n`);
		console.log(response.data.output);
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
		const response = await api.post('/cli/analyze/test', answers);
		console.log(`\n${chalk.bold('Testing Results:')}\n`);
		console.log(response.data.output);
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
			const response = await api.post('/cli/analyze/bug', { filename: file, content, context });
			
			if (response.data.output.toLowerCase().includes('critical') || response.data.output.toLowerCase().includes('error')) {
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
		const response = await api.post('/cli/analyze/performance', { context });
		console.log(chalk.white(response.data.output));
	} catch (error) {
		console.log(chalk.red('Error connecting to neural profiler.'));
	}
};

const gameplay = async () => {
	console.log(chalk.bold.magenta('\n🎮 Generating Gameplay Loop...'));
	const context = getContext();
	try {
		const response = await api.post('/cli/generate/gameplay', { context });
		console.log(chalk.white(response.data.output));
	} catch (error) {
		console.log(chalk.red(`Error generating gameplay loop: ${error.response?.data?.message || error.message}`));
	}
};

const skilltree = async () => {
	console.log(chalk.bold.cyan('\n🌳 Branching Out: Skill Tree Generation...'));
	const context = getContext();
	try {
		const response = await api.post('/cli/generate/skilltree', { context });
		console.log(chalk.white(response.data.output));
	} catch (error) {
		console.log(chalk.red('Error generating skill tree.'));
	}
};

const economy = async () => {
	console.log(chalk.bold.green('\n💰 GapsyAI Economy Simulator Running...'));
	const context = getContext();
	try {
		const response = await api.post('/cli/analyze/economy', { context });
		console.log(chalk.white(response.data.output));
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
		const response = await api.post('/cli/translate', { filename: file, content });
		console.log(chalk.green('✔ Localization complete. Output saved to translated_' + file));
		fs.writeFileSync('translated_' + file, response.data.output);
	} catch (error) {
		console.log(chalk.red('Error connecting to translation forge.'));
	}
};

const assets = async () => {
	console.log(chalk.bold.yellow('\n📦 Scanning Assets for Optimization...'));
	const context = getContext();
	try {
		const response = await api.post('/cli/analyze/assets', { context });
		console.log(chalk.white(response.data.output));
	} catch (error) {
		console.log(chalk.red('Error connecting to asset scanner.'));
	}
};

const trailer = async () => {
	console.log(chalk.bold.red('\n🎬 Scripting Your Game Trailer...'));
	const context = getContext();
	try {
		const response = await api.post('/cli/generate/trailer', { context });
		console.log(chalk.white(response.data.output));
	} catch (error) {
		console.log(chalk.red('Error scripting trailer.'));
	}
};

const patchnotes = async () => {
	console.log(chalk.bold.gray('\n📝 Generating Patch Notes...'));
	const context = getContext();
	try {
		// Example: git log --oneline -n 20
		const { execSync } = require('child_process');
		const gitLog = execSync('git log --oneline -n 20').toString();
		const response = await api.post('/cli/generate/patchnotes', { log: gitLog, context });
		console.log(chalk.white(response.data.output));
	} catch (error) {
		console.log(chalk.red('Error generating patch notes. Ensure you are in a git repository.'));
	}
};

const playtest = async () => {
	console.log(chalk.bold.blue('\n🤖 Initiating AI Playtest Simulation...'));
	const context = getContext();
	try {
		const response = await api.post('/cli/simulate/playtest', { context });
		console.log(chalk.white(response.data.output));
	} catch (error) {
		console.log(chalk.red('Error initiating playtest.'));
	}
};

module.exports = { bug, balance, fix, explain, optimize, analyzeProject, docs, multiplayer, test, monitor, performance, gameplay, skilltree, economy, translate, assets, trailer, patchnotes, playtest };
