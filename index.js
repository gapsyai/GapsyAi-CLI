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
	.description('GapsyAI CLI - AI-powered game development assistance')
	.version(pkg.version);

// Generator Commands
program
	.command('dialogue')
	.description('Generate NPC dialogues')
	.action(generators.dialogue);

program
	.command('quest')
	.description('Generate side quests')
	.action(generators.quest);

program
	.command('level')
	.description('Generate level design ideas')
	.action(generators.level);

program
	.command('script')
	.description('Generate game scripts')
	.action(generators.script);

program
	.command('idea')
	.description('Generate game concepts')
	.action(generators.idea);

program
	.command('sound')
	.description('Generate sound effect prompts')
	.action(generators.sound);

// Analyzer Commands
program
	.command('bug <file>')
	.description('Detect bugs in game scripts')
	.action(analyzers.bug);

program
	.command('balance')
	.description('Analyze game difficulty and reward system')
	.action(analyzers.balance);

program
	.command('fix <file>')
	.description('Automatically fix game code')
	.action(analyzers.fix);

// Utility Commands
program
	.command('login')
	.description('Save your API key')
	.action(utils.login);

program
	.command('usage')
	.description('Check your API usage')
	.action(utils.usage);

program
	.command('update')
	.description('Update the CLI')
	.action(utils.update);

program.parse(process.argv);
