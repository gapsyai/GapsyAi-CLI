/**
 * GapsyAI 3.0 - Neural Payload Boundary Test
 * Verifies backend stability for massive neural traces.
 */

const axios = require('axios');
const chalk = require('chalk');

const API_URL = 'http://localhost:8000/api/cli/sync/playtest';
const MOCK_KEY = '7dJlnerUrt8bdWwSuMWLdscbyNJ1bC2yoR4dHenJ9sdA1FozNwGVnDbrxLFu';
const EVENT_COUNT = 5000; // Large trace

async function runBoundaryTest() {
    console.log(chalk.bold.yellow(`\n📦 Generating Massive Neural Trace (${EVENT_COUNT} events)...`));
    
    const timeline = [];
    for (let i = 0; i < EVENT_COUNT; i++) {
        timeline.push({
            timestamp: new Date().toISOString(),
            type: 'boundary_test',
            message: `Neural event node saturation index ${i}`,
            impact: Math.floor(Math.random() * 100),
            metadata: {
                entropy: Math.random(),
                sector: `SEC-${Math.floor(Math.random() * 999)}`,
                integrity: 'active'
            }
        });
    }

    console.log(chalk.cyan(`Payload Size: ~${Math.round(JSON.stringify(timeline).length / 1024)} KB`));

    try {
        console.log(chalk.blue('Synchronizing massive trace to backend...'));
        const start = Date.now();
        const response = await axios.post(API_URL, {
            name: 'Boundary_Stress_Session',
            timeline: timeline
        }, {
            headers: { 'Authorization': `Bearer ${MOCK_KEY}` }
        });
        const duration = Date.now() - start;

        console.log(chalk.green(`\n✔ Success! Massive trace synced in ${duration}ms`));
        console.log(`Response Status: ${response.status}`);
        console.log(`Backend ID: ${response.data.id}`);
    } catch (error) {
        console.error(chalk.red('\n✘ Payload Boundary Test Failed:'));
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 413) {
                console.log(chalk.magenta('Note: 413 (Payload Too Large) is a valid server-side limit.'));
            }
        } else {
            console.error(error.message);
        }
    }
}

runBoundaryTest().catch(console.error);
