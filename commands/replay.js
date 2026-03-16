const chalk = require('chalk');
const api = require('../lib/api');

const replay = async (id) => {
    console.log(chalk.bold.white(`\n🎬 GapsyAI Neural Replay [ID: ${id || 'latest'}]`));
    console.log(chalk.gray('Synthesizing visual frames from neural trace...\n'));

    try {
        const response = await api.get('/cli/latest-replay');
        const report = response.data;

        if (!report || !report.timeline) {
            console.log(chalk.red('✘ No neural trace found for this project. Run "gapsyai monitor" first.'));
            return;
        }

        const events = report.timeline;
        
        console.log(chalk.cyan(`Project: ${chalk.bold(report.project_name)}`));
        console.log(chalk.cyan(`Neural Engine: ${chalk.bold(report.engine)}\n`));

        for (const event of events) {
            const timeStr = chalk.gray(`[${event.timestamp}]`);
            let icon = '•';
            let color = chalk.white;

            switch(event.type) {
                case 'combat': icon = '⚔'; color = chalk.red; break;
                case 'discovery': icon = '✨'; color = chalk.cyan; break;
                case 'dialogue': icon = '💬'; color = chalk.yellow; break;
                case 'error': icon = '✘'; color = chalk.bgRed.white; break;
            }

            process.stdout.write(`${timeStr} ${color(icon)} ${event.message} `);
            
            // Impact visualization
            if (event.impact) {
                const bar = '█'.repeat(event.impact);
                process.stdout.write(color(bar));
            }
            
            process.stdout.write('\n');
            await new Promise(r => setTimeout(r, 600)); // Cinematic pacing
        }

        console.log(chalk.bold.yellow('\n✅ Replay Complete. Access the GapsyAI Portal for the 3D Neural Heatmap.'));
    } catch (error) {
        console.error(chalk.red(`\n✘ Neural Link Failure: ${error.message}`));
    }
};

module.exports = { replay };
