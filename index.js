#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

const generators = require('./commands/generators');
const analyzers = require('./commands/analyzers');
const { dialogue, quest, level, script, idea, item, enemy, story, assetPrompt, jam, brain, chat, migrate, sfx, map, voice, visualize, exportQuest, worldBridge, commit, testGen, blueprint, sonic, scaffold, find, heal, refactor, sense } = generators;
const { bug, balance, fix, explain, optimize, analyzeProject, docs, multiplayer, test, monitor, performance, gameplay, skilltree, economy, translate, assets, trailer, patchnotes, playtest, indexProject, pulse, heatmapView, comment, audit, stress, resources, skills, archetypes, securityScan, abTest, heapScan, l10nAudit, polyOptimize, montecarlo, emotionalArc, burnout, complexity, navmesh } = analyzers;
const { replay } = require('./commands/replay');
const { docsGen } = require('./commands/docs_gen');
const { login, usage, update, config, init, hooks, teamActivity, knowledge } = require('./commands/utils');

// Check for updates on startup
const notifier = updateNotifier({ pkg });
if (notifier.update) {
	console.log(chalk.yellow(`\n[!] GapsyAI Update Available: ${notifier.update.latest}`));
	console.log(chalk.gray(`Run 'gapsyai update' to install the latest version.\n`));
}

program
	.name('gapsyai')
	.description('AI CLI for Game Development')
	.version(pkg.version);

// Core Features
program
	.command('dialogue')
	.description('Generate NPC dialogues and player choices')
	.action(generators.dialogue);

program
	.command('quest')
	.description('Generate side quests, objectives, and rewards')
	.action(generators.quest);

program
	.command('level')
	.description('Generate level layouts, enemy placements, and puzzles')
	.action(generators.level);

program
	.command('script')
	.description('Generate game scripts for Unity, Unreal, and Godot')
	.action(generators.script);

program
	.command('bug <file>')
	.description('Analyze scripts for bugs and performance optimization')
	.action(bug);

program
	.command('idea')
	.description('Generate unique game concepts and mechanics')
	.action(generators.idea);

// Developer Workflow Features
program
	.command('explain <file>')
	.description('Explain code logic in simple terms')
	.action(explain);

program
	.command('fix <file>')
	.description('Automatically suggest and apply bug fixes')
	.action(fix);

program
	.command('optimize <file>')
	.description('Suggest FPS and performance improvements')
	.action(optimize);

program
	.command('balance')
	.description('Analyze enemy stats, xp rewards, and game difficulty')
	.action(balance);

// Content Creation Features
program
	.command('item')
	.description('Generate procedural items (weapons, armor, magic)')
	.action(generators.item);

program
	.command('enemy')
	.description('Generate enemy abilities and attack patterns')
	.action(generators.enemy);

program
	.command('story')
	.description('Generate main storylines and plot twists')
	.action(generators.story);

// AI Asset Prompt Generator
program
	.command('asset-prompt')
	.description('Generate AI prompts for characters, weapons, and textures')
	.action(generators.assetPrompt);

// Game Jam Mode
program
	.command('jam [theme]')
	.description('Generate game idea, mechanics, and levels for game jams')
	.action(generators.jam);

// Advanced Features
program
	.command('analyze')
	.description('Run a full project health scan')
	.action(analyzeProject);

program
	.command('docs <file>')
	.description('Auto-generate game documentation and developer notes')
	.action(docs);

program
	.command('multiplayer')
	.description('Help with lobby, matchmaking, and sync logic')
	.action(multiplayer);

program
	.command('performance')
	.description('Profile FPS drops and memory leaks')
	.action(performance);

program
	.command('gameplay')
	.description('Generate core gameplay loops and progression systems')
	.action(gameplay);

program
	.command('skilltree')
	.description('Generate branching RPG skill trees')
	.action(skilltree);

program
	.command('economy')
	.description('Analyze game economy flow, prices, and inflation risk')
	.action(economy);

program
	.command('translate <file>')
	.description('Localize dialogue files into multiple languages')
	.action(translate);

program
	.command('assets')
	.description('Scan for duplicate assets and unused textures')
	.action(assets);

program
	.command('trailer')
	.description('Generate YouTube trailer scripts and marketing hooks')
	.action(trailer);

program
	.command('patchnotes')
	.description('Generate developer release notes from Git commits')
	.action(patchnotes);

program
	.command('playtest')
	.description('Simulate player behavior and difficulty spikes')
	.action(playtest);

program
	.command('monitor')
	.description('Run automated CI/CD checks for bugs and balance')
	.action(monitor);

program
	.command('chat [message]')
	.description('Chat with AI to get help or instructions')
	.action(generators.chat);

program
	.command('migrate <file>')
	.description('Migrate game logic between engines (e.g., Unity to Godot)')
	.option('-t, --target <engine>', 'Target engine (unity, unreal, godot)', 'godot')
	.action(generators.migrate);

program
	.command('sfx <prompt>')
	.description('Generate technical sound and VFX prompts')
	.action(generators.sfx);

program
	.command('map')
	.description('Generate procedural ASCII game maps')
	.option('-s, --size <size>', 'Map size (e.g., 50x50)', '30x20')
	.option('-b, --biome <biome>', 'Biome type (dungeon, forest, cave)', 'dungeon')
	.action(generators.map);

program
	.command('voice <npc_name>')
	.description('Generate a character voice and personality guide')
	.action(generators.voice);

program
	.command('visualize <type>')
	.description('Generate visual diagrams (story, quest, logic)')
	.action(generators.visualize);

program
	.command('hooks <action>')
	.description('Manage Git hooks for GapsyAI (e.g., setup)')
	.action(hooks);

program
	.command('index')
	.description('Index project files for local AI context (RAG)')
	.action(indexProject);

// Pro Dashboard Integration
program
	.command('pulse')
	.description('Get high-level project health metrics from GapsyAI Dashboard')
	.action(pulse);

program
	.command('export-quest <file>')
	.description('Push quest logic to the GapsyAI Visual Quest Graph')
	.action(generators.exportQuest);

program
	.command('heatmap-view')
	.description('View CLI-rendered heatmap from your latest playtest')
	.action(heatmapView);

program
	.command('team-activity')
	.description('View recent AI activity from your team members')
	.action(teamActivity);

program
	.command('knowledge <action> [input]')
	.description('Manage team-wide AI Knowledge Base (Shared Brains)')
	.action(knowledge);

program
	.command('world-bridge')
	.description('Sync local world design ideas to the World Builder module')
	.action(generators.worldBridge);

program
	.command('commit')
	.description('Generate AI commit messages for staged changes')
	.action(generators.commit);

program
	.command('test-gen <file>')
	.description('Automatically generate unit tests for a script')
	.action(generators.testGen);

program
	.command('comment <file>')
	.description('Automatically add technical comments to your code')
	.action(comment);

program
	.command('audit')
	.description('Audit project dependencies and build size optimization')
	.action(audit);

program
    .command('blueprint <prompt>')
    .description('Generate a complete game system boilerplate (e.g., "Multiplayer Lobby")')
    .action(generators.blueprint);

program
    .command('stress')
    .description('Run an AI-driven economy stress test to find exploits')
    .action(stress);

program
    .command('sonic <prompt>')
    .description('Get AI-suggested SFX and music directions for a scene')
    .action(generators.sonic);

program
    .command('resources')
    .description('Get AI-driven developer resource and headcount suggestions')
    .action(resources);

program
    .command('skills')
    .description('Generate a neural skill gap matrix for your team')
    .action(skills);

// Utility Commands
program
	.command('brain <name>')
	.description('Generate a structured NPC personality profile')
	.action(generators.brain);

program
	.command('init')
	.description('Initialize GapsyAI context for this project')
	.action(init);

program
	.command('login')
	.description('Save your API key and authenticate')
	.action(login);

program
	.command('usage')
	.description('Check your current AI call limits and usage')
	.action(usage);

program
	.command('update')
	.description('Update the GapsyAI CLI to the latest version')
	.action(update);

program
	.command('config [action] [key] [value]')
	.description('Manage CLI configuration (interactive or via set/get)')
	.action(config);

// ==========================================
// GapsyAI 3.0: DEEP EVOLUTION COMMANDS
// ==========================================

// Playtest Deep
program
	.command('archetypes')
	.description('Cluster playtesters into behavioral archetypes (Explorers, Killers, Achievers, Socializers)')
	.action(archetypes);

// CI/CD Deep  
program
	.command('security-scan')
	.description('Run AI-powered DevSecOps vulnerability scan on your CI/CD pipeline')
	.action(securityScan);

// Project Analytics Deep
program
	.command('ab-test')
	.description('AI-forecast the winner between two monetization strategies')
	.option('-a, --variant-a <desc>', 'Variant A description', 'Current Model')
	.option('-b, --variant-b <desc>', 'Variant B description', 'New Battle Pass')
	.action(abTest);

// Live Debugger Deep
program
	.command('heap-scan')
	.description('Visualize memory leaks and hotspots from your error logs')
	.action(heapScan);

// Cloud Dialogue Deep
program
	.command('l10n-audit')
	.description('Audit dialogue localization quality and readability across languages')
	.action(l10nAudit);

// Asset Versioning Deep
program
	.command('poly-optimize')
	.description('Analyze mesh complexity and generate LOD strategy for your assets')
	.action(polyOptimize);

// Economy Simulator Deep
program
	.command('montecarlo')
	.description('Run a 10,000-player Monte Carlo economy simulation')
	.action(montecarlo);

// Trailer Storyboarder Deep
program
	.command('arc')
	.description('Map the emotional intensity arc data for your trailers')
	.action(emotionalArc);

// Team Analytics Deep
program
	.command('burnout')
	.description('Predict team burnout risk using velocity vs crunch analysis')
	.action(burnout);

// Quest Graph Deep
program
	.command('complexity')
	.description('Generate a visual complexity heatmap for your quest nodes')
	.action(complexity);

// Heatmap Deep
program
  .command('navmesh')
  .description('Extract NavMesh from playtest data')
  .action(navmesh);

program
  .command('replay [id]')
  .description('Visualize a neural trace locally')
  .action(replay);

program
  .command('docs-gen')
  .description('Generate a complete technical documentation site')
  .action(docsGen);

program
  .command('scaffold')
  .description('Generate a complete project scaffolding autonomously')
  .action(scaffold);

program
  .command('find')
  .description('Search your project neural index semantically')
  .action(find);

program
  .command('heal')
  .description('Autonomous self-healing engine to fix bugs and lints')
  .option('-d, --dry-run', 'Suggest fixes without applying them')
  .action(heal);

program
  .command('refactor [target]')
  .description('Refactor and optimize code for performance and readability')
  .action(refactor);

program
  .command('sense')
  .description('Analyze real-time project sentiment and "vibe"')
  .action(sense);

program.parse(process.argv);
