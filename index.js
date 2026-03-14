#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

const generators = require('./commands/generators');
const analyzers = require('./commands/analyzers');
const utils = require('./commands/utils');

// Check for updates
updateNotifier({ pkg }).notify();

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
	.action(analyzers.bug);

program
	.command('idea')
	.description('Generate unique game concepts and mechanics')
	.action(generators.idea);

// Developer Workflow Features
program
	.command('explain <file>')
	.description('Explain code logic in simple terms')
	.action(analyzers.explain);

program
	.command('fix <file>')
	.description('Automatically suggest and apply bug fixes')
	.action(analyzers.fix);

program
	.command('optimize <file>')
	.description('Suggest FPS and performance improvements')
	.action(analyzers.optimize);

program
	.command('balance')
	.description('Analyze enemy stats, xp rewards, and game difficulty')
	.action(analyzers.balance);

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
	.command('jam')
	.description('Generate game idea, mechanics, and levels for game jams')
	.action(generators.jam);

// Advanced Features
program
	.command('analyze')
	.description('Run a full project health scan')
	.action(analyzers.analyzeProject);

program
	.command('docs <file>')
	.description('Auto-generate game documentation and developer notes')
	.action(analyzers.docs);

program
	.command('multiplayer')
	.description('Help with lobby, matchmaking, and sync logic')
	.action(analyzers.multiplayer);

program
	.command('performance')
	.description('Profile FPS drops and memory leaks')
	.action(analyzers.performance);

program
	.command('gameplay')
	.description('Generate core gameplay loops and progression systems')
	.action(analyzers.gameplay);

program
	.command('skilltree')
	.description('Generate branching RPG skill trees')
	.action(analyzers.skilltree);

program
	.command('economy')
	.description('Analyze game economy flow, prices, and inflation risk')
	.action(analyzers.economy);

program
	.command('translate <file>')
	.description('Localize dialogue files into multiple languages')
	.action(analyzers.translate);

program
	.command('assets')
	.description('Scan for duplicate assets and unused textures')
	.action(analyzers.assets);

program
	.command('trailer')
	.description('Generate YouTube trailer scripts and marketing hooks')
	.action(analyzers.trailer);

program
	.command('patchnotes')
	.description('Generate developer release notes from Git commits')
	.action(analyzers.patchnotes);

program
	.command('playtest')
	.description('Simulate player behavior and difficulty spikes')
	.action(analyzers.playtest);

program
	.command('monitor')
	.description('Run automated CI/CD checks for bugs and balance')
	.action(analyzers.monitor);

// Utility Commands
program
	.command('brain <name>')
	.description('Generate a structured NPC personality profile')
	.action(generators.brain);

program
	.command('init')
	.description('Initialize GapsyAI context for this project')
	.action(utils.init);

program
	.command('login')
	.description('Save your API key and authenticate')
	.action(utils.login);

program
	.command('usage')
	.description('Check your current AI call limits and usage')
	.action(utils.usage);

program
	.command('update')
	.description('Update the GapsyAI CLI to the latest version')
	.action(utils.update);

program
	.command('config')
	.description('Manage CLI configuration')
	.action(utils.config);

program.parse(process.argv);
