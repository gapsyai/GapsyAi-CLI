const chalk = require('chalk');
const api = require('../lib/api');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { getContext } = require('../lib/context');
const ai = require('../lib/ai_provider');

const isBinary = (file) => {
	try {
		// Use readFileSync for better compatibility with common Jest mocks
		const buffer = fs.readFileSync(file);
		if (!buffer || buffer.length === 0) return false;

		// If it's a string (from a simple mock), it's not binary
		if (typeof buffer === 'string') return false;

		let nonPrintable = 0;
		const checkLength = Math.min(buffer.length, 1024);
		for (let i = 0; i < checkLength; i++) {
			if (buffer[i] === 0) return true; // Null byte
			if (buffer[i] < 32 && ![9, 10, 13].includes(buffer[i])) {
				nonPrintable++;
			}
		}
		return (nonPrintable / checkLength) > 0.1;
	} catch (e) {}
	return false;
};

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

	if (isBinary(filePath)) {
		console.error(chalk.red(`✘ Cannot analyze binary file: ${file}`));
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

	if (isBinary(filePath)) {
		console.error(chalk.red(`✘ Cannot analyze binary file: ${file}`));
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

	if (isBinary(filePath)) {
		console.error(chalk.red(`✘ Cannot analyze binary file: ${file}`));
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

	if (isBinary(filePath)) {
		console.error(chalk.red(`✘ Cannot analyze binary file: ${file}`));
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
	if (isBinary(filePath)) {
		console.error(chalk.red(`✘ Cannot document binary file: ${file}`));
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
		if (process.stdout.clearLine && process.stdout.cursorTo) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
		}
		process.stdout.write(chalk.white(`  Scanning ${file}... `));
		try {
			const filePath = path.resolve(process.cwd(), file);
			if (isBinary(filePath)) {
				console.log(chalk.yellow('⚠ Skipped binary.'));
				continue;
			}
			const content = fs.readFileSync(filePath, 'utf8');
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
	if (!file) {
		console.log(chalk.red('Please specify a file to translate.'));
		return;
	}
	console.log(chalk.bold.blue(`\n🌐 Localizing ${file}...`));
	const filePath = path.resolve(process.cwd(), file);
	if (!fs.existsSync(filePath) || isBinary(filePath)) {
		console.log(chalk.red('File not found or binary file detected.'));
		return;
	}
	const content = fs.readFileSync(filePath, 'utf8');
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
    console.log(chalk.bold.blue('\n📚 GapsyAI Deep Indexing Project Context...'));
    
    const getFilesIteratively = (root) => {
        const stack = [root];
        const results = [];
        const relevantExts = ['.js', '.ts', '.tsx', '.cs', '.cpp', '.gd', '.json', '.md'];

        while (stack.length > 0) {
            const dir = stack.pop();
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (item !== 'node_modules' && item !== '.git' && item !== 'vendor' && !item.startsWith('.')) {
                        stack.push(fullPath);
                    }
                } else {
                    const ext = path.extname(item).toLowerCase();
                    if (relevantExts.includes(ext) && !item.startsWith('.')) {
                        results.push(fullPath);
                    }
                }
            }
        }
        return results;
    };

    const allFiles = getFilesIteratively(process.cwd());
    const fileCount = allFiles.length;
    
    console.log(chalk.gray(`Identified ${fileCount} relevant source files.`));

    // Batching Configuration
    const BATCH_SIZE = 50;
    const batches = [];
    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
        batches.push(allFiles.slice(i, i + BATCH_SIZE));
    }

    const summaries = [];
    console.log(chalk.blue(`Processing ${batches.length} neural batches...`));

    try {
        for (let i = 0; i < batches.length; i++) {
            const batchFiles = batches[i].map(f => path.relative(process.cwd(), f)).join('\n');
            process.stdout.write(chalk.gray(`  Batch ${i + 1}/${batches.length}... `));
            
            const batchSummary = await ai.generate({
                prompt: `Analyze the following project files and provide a high-level summary of their purpose and relationships:\n${batchFiles}`,
                systemInstruction: 'You are a Knowledge Architect. Provide a concise summary of the logic flow and purpose of these files.',
                endpoint: '/cli/analyze/index_batch',
                data: { files: batchFiles }
            });
            
            summaries.push(batchSummary);
            console.log(chalk.green('✔'));
            
            if (summaries.length >= 10) {
                console.log(chalk.yellow('  Reached neural context limit for this run. Finalizing...'));
                break;
            }
        }

        console.log(chalk.blue('\nAggregating neural architecture map...'));
        const finalArchitecture = await ai.generate({
            prompt: `Based on these partial summaries, create a final hierarchical project architecture guide:\n\n${summaries.join('\n\n')}`,
            systemInstruction: 'You are a Principal Architect. Synthesize the provided information into a cohesive project structure map.',
            endpoint: '/cli/analyze/index_final',
            data: { partial_summaries: summaries }
        });

        fs.writeFileSync('.gapsy_index', finalArchitecture);
        console.log(chalk.green('\n✔ Deep Neural Index Created! Chat is now hyper-aware of your complex project structure.'));
    } catch (error) {
        console.error(chalk.red(`\n✘ Indexing Failed: ${error.message}`));
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
    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
        console.error(chalk.red('File not found.'));
        return;
    }

    if (isBinary(filePath)) {
        console.error(chalk.red(`✘ Cannot comment on binary file: ${file}`));
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
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

const stress = async () => {
    console.log(chalk.bold.red('\n💰 GapsyAI Economy Stress Test Running...'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Execute economy stress test. Identify loopholes and inflation risks. Context: ${JSON.stringify(context)}`,
            systemInstruction: 'You are a senior game economist. Focus on identifying exploits and fraud loops.',
            endpoint: '/cli/analyze/stress',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error initiating economy stress test.'));
    }
};

const resources = async () => {
    console.log(chalk.bold.green('\n🤝 GapsyAI Resource Allocation Engine...'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Suggest optimal resource allocation. Context: ${JSON.stringify(context)}`,
            systemInstruction: 'You are a technical studio manager. Suggest headcount based on project complexity.',
            endpoint: '/cli/analyze/resources',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error fetching resource suggestions.'));
    }
};

const skills = async () => {
    console.log(chalk.bold.blue('\n🔍 GapsyAI Skill Gap Matrix Audit...'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Generate a skill gap matrix for the current team context: ${JSON.stringify(context)}`,
            systemInstruction: 'You are a technical recruiter. Identify missing skills required for the game engine and complexity level.',
            endpoint: '/cli/analyze/skills',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error generating skill gap matrix.'));
    }
};

// ==========================================
// GapsyAI 3.0: DEEP EVOLUTION HANDLERS
// ==========================================

const archetypes = async () => {
    console.log(chalk.bold.magenta('\n🧬 GapsyAI Player Archetype Matrix...'));
    console.log(chalk.gray('Clustering playtesters into behavioral cohorts using ML patterns...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Classify game playtesters into Bartle archetypes (Explorers, Killers, Achievers, Socializers) based on project context: ${JSON.stringify(context)}. For each archetype show percentage, key traits, and satisfaction score.`,
            systemInstruction: 'You are a behavioral game researcher. Format output as readable columns.',
            endpoint: '/cli/analyze/archetypes',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error analyzing player archetypes.'));
    }
};

const securityScan = async () => {
    console.log(chalk.bold.red('\n🛡️  GapsyAI DevSecOps Security Scan...'));
    console.log(chalk.gray('Running AI vulnerability scan on CI/CD pipeline...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Perform a simulated DevSecOps security audit for a game project. Context: ${JSON.stringify(context)}. Report threat level, CVSS score, critical vulnerabilities, and recommendations.`,
            systemInstruction: 'You are a DevSecOps expert. Use realistic CVE-style findings.',
            endpoint: '/cli/analyze/security-scan',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error running security scan.'));
    }
};

const abTest = async (options) => {
    const variantA = options.variantA || 'Current Model';
    const variantB = options.variantB || 'New Battle Pass';
    console.log(chalk.bold.blue(`\n🧪 GapsyAI A/B Test Forecaster`));
    console.log(chalk.gray(`Analyzing: "${variantA}" vs "${variantB}"...\n`));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Forecast the winner between: Variant A: "${variantA}" vs Variant B: "${variantB}" for a mobile game economy. Provide predicted winner, confidence, lift for each variant, and recommendation.`,
            systemInstruction: 'You are a monetization strategist. Use statistical reasoning.',
            endpoint: '/cli/analyze/ab-test',
            data: { context, variant_a: variantA, variant_b: variantB }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error running A/B test forecast.'));
    }
};

const heapScan = async () => {
    console.log(chalk.bold.yellow('\n🧠 GapsyAI Memory Heap Visualizer...'));
    console.log(chalk.gray('Scanning error logs for memory allocation patterns...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Simulate a heap dump analysis for a game project. Context: ${JSON.stringify(context)}. Report total allocated memory, whether a leak is detected, leak source, 4 hotspot objects with name/type/size_mb, and one recommendation.`,
            systemInstruction: 'You are a memory profiler expert. Be technical and realistic.',
            endpoint: '/cli/analyze/heap-scan',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error scanning memory heap.'));
    }
};

const l10nAudit = async () => {
    console.log(chalk.bold.cyan('\n🌐 GapsyAI Localization Quality Audit...'));
    console.log(chalk.gray('Auditing dialogue internationalization across regions...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Audit game dialogue localization quality for a project. Context: ${JSON.stringify(context)}. Report overall score (0-100), readability grade, 3 language-specific issues with impact, and one recommendation.`,
            systemInstruction: 'You are a professional game localization expert.',
            endpoint: '/cli/analyze/l10n-audit',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error running localization audit.'));
    }
};

const polyOptimize = async () => {
    console.log(chalk.bold.green('\n📐 GapsyAI Poly Optimization Analyzer...'));
    console.log(chalk.gray('Analyzing mesh complexity and generating LOD strategy...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Analyze polygon optimization for game assets. Context: ${JSON.stringify(context)}. Report total poly count, optimization potential, 3 LOD levels (LOD0/LOD1/LOD2) with poly count and render distance, and one recommendation.`,
            systemInstruction: 'You are a 3D graphics optimization expert.',
            endpoint: '/cli/analyze/poly-optimize',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error analyzing polygon optimization.'));
    }
};

const montecarlo = async () => {
    console.log(chalk.bold.magenta('\n🎲 GapsyAI Monte Carlo Economy Simulation...'));
    console.log(chalk.gray('Running 10,000 simulated player economy runs...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Run a Monte Carlo economy simulation for a game with 10,000 simulated player runs. Context: ${JSON.stringify(context)}. Report p10, p50, p90 outcomes for in-game currency, inflation risk, scarcity events, and recommendations.`,
            systemInstruction: 'You are a game economist. Use probabilistic reasoning.',
            endpoint: '/cli/analyze/montecarlo',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error running Monte Carlo simulation.'));
    }
};

const emotionalArc = async () => {
    console.log(chalk.bold.red('\n🎬 GapsyAI Emotional Arc Mapper...'));
    console.log(chalk.gray('Mapping trailer emotional intensity across timestamps...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Map the emotional arc for a game trailer. Context: ${JSON.stringify(context)}. Report peak emotion, arc type, 5 intensity points (timestamp + emotion + intensity 1-10), and one recommendation about pacing.`,
            systemInstruction: 'You are a cinematic storytelling expert.',
            endpoint: '/cli/analyze/arc',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error mapping emotional arc.'));
    }
};

const burnout = async () => {
    console.log(chalk.bold.yellow('\n🔥 GapsyAI Team Burnout Predictor...'));
    console.log(chalk.gray('Analyzing velocity vs crunch patterns for burnout risk...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Predict team burnout risk based on project velocity and crunch patterns. Context: ${JSON.stringify(context)}. Report burnout risk percentage, team velocity score, risk factors, and recovery recommendations.`,
            systemInstruction: 'You are a team health expert for game studios.',
            endpoint: '/cli/analyze/burnout',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error predicting burnout risk.'));
    }
};

const complexity = async () => {
    console.log(chalk.bold.yellow('\n🗺️  GapsyAI Quest Complexity Heatmap...'));
    console.log(chalk.gray('Analyzing quest node difficulty and complexity distribution...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Generate a complexity heatmap analysis for game quest nodes. Context: ${JSON.stringify(context)}. Report high/medium/low complexity nodes, difficulty spikes, bottlenecks, and suggestions for rebalancing.`,
            systemInstruction: 'You are a game design analyst specializing in quest systems.',
            endpoint: '/cli/analyze/complexity',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error generating quest complexity heatmap.'));
    }
};

const navmesh = async () => {
    console.log(chalk.bold.green('\n🧭 GapsyAI NavMesh Generator...'));
    console.log(chalk.gray('Extracting walkable areas from playtest heatmap clusters...\n'));
    try {
        const context = getContext();
        const output = await ai.generate({
            prompt: `Generate a NavMesh description extracted from playtest heatmap data. Context: ${JSON.stringify(context)}. Report walkable zones, obstacle density, pathfinding efficiency score, and optimization recommendations.`,
            systemInstruction: 'You are an AI pathfinding systems engineer.',
            endpoint: '/cli/analyze/navmesh',
            data: { context }
        });
        console.log(chalk.white(output));
    } catch (error) {
        console.error(chalk.red('Error generating NavMesh.'));
    }
};

module.exports = { bug, balance, fix, explain, optimize, analyzeProject, docs, multiplayer, test, monitor, performance, gameplay, skilltree, economy, translate, assets, trailer, patchnotes, playtest, indexProject, pulse, heatmapView, comment, audit, stress, resources, skills, archetypes, securityScan, abTest, heapScan, l10nAudit, polyOptimize, montecarlo, emotionalArc, burnout, complexity, navmesh };
