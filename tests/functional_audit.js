const { execSync } = require('child_process');
const chalk = require('chalk');

const commands = [
    'analyze', 'sense', 'usage', 'idea', 'jam', 'balance', 'performance', 
    'gameplay', 'skilltree', 'economy', 'assets', 'trailer', 'patchnotes', 
    'playtest', 'audit', 'stress', 'resources', 'skills', 'archetypes', 
    'security-scan', 'ab-test', 'heap-scan', 'l10n-audit', 'poly-optimize', 
    'montecarlo', 'arc', 'burnout', 'complexity', 'navmesh'
];

console.log(chalk.bold.cyan('\n🚀 Starting GapsyAI Extreme Functional Audit\n'));

const results = [];

for (const cmd of commands) {
    process.stdout.write(chalk.white(`Testing [${cmd}]... `));
    try {
        const start = Date.now();
        const arg = (cmd === 'jam') ? ' unstable' : '';
        execSync(`node index.js ${cmd}${arg}`, { stdio: 'ignore', timeout: 30000 });
        const duration = Date.now() - start;
        console.log(chalk.green(`PASSED (${duration}ms)`));
        results.push({ command: cmd, status: 'PASS', duration });
    } catch (error) {
        console.log(chalk.red('FAILED'));
        results.push({ command: cmd, status: 'FAIL', error: error.message });
    }
}

console.log(chalk.bold.cyan('\n📊 Audit Summary:'));
const passed = results.filter(r => r.status === 'PASS').length;
const failed = results.filter(r => r.status === 'FAIL').length;

console.log(`Total: ${results.length}`);
console.log(chalk.green(`Passed: ${passed}`));
console.log(failed > 0 ? chalk.red(`Failed: ${failed}`) : chalk.green(`Failed: ${failed}`));

if (failed > 0) {
    console.log(chalk.red('\nFailed Commands List:'));
    results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`- ${r.command}`);
    });
}

console.log(chalk.bold.yellow('\nVerify results in the GapsyAI Dashboard.'));
