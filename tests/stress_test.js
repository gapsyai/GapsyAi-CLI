/**
 * GapsyAI 3.0 - Resonance Stress Test
 * Simulates high-velocity concurrent load on the Neural Forge.
 */

const axios = require('axios');
const chalk = require('chalk');

const API_URL = 'http://localhost:8000/api/cli';
const MOCK_KEY = 'STRESS_TEST_KEY';
const CONCURRENCY = 20;

async function firePulse(id) {
    try {
        const start = Date.now();
        const response = await axios.post(`${API_URL}/sync/playtest`, {
            name: `StressTest_Session_${id}`,
            timeline: [
                { timestamp: new Date().toISOString(), type: 'stress', message: 'Resonance Surge', impact: 100 }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${MOCK_KEY}` }
        });
        const duration = Date.now() - start;
        console.log(chalk.green(`[Pulse ${id}] ✔ Synced in ${duration}ms (Status: ${response.status})`));
        return true;
    } catch (error) {
        console.log(chalk.yellow(`[Pulse ${id}] ⚠ Blocked: ${error.response?.status || error.message}`));
        return false;
    }
}

async function runStressSuite() {
    console.log(chalk.bold.magenta('\n⚡ Initiating GapsyAI Resonance Stress Test (Concurrency: ' + CONCURRENCY + ')\n'));
    
    const pulses = [];
    for (let i = 1; i <= CONCURRENCY; i++) {
        pulses.push(firePulse(i));
    }

    const results = await Promise.all(pulses);
    const successCount = results.filter(r => r).length;

    console.log(chalk.bold.cyan(`\n--- Stress Metrics ---`));
    console.log(`Successful Syncs: ${successCount} / ${CONCURRENCY}`);
    console.log(`Throughput Rate: ${((successCount / CONCURRENCY) * 100).toFixed(2)}%`);
    
    if (successCount === CONCURRENCY) {
        console.log(chalk.green('\n✔ Backend demonstrated perfect concurrency handling.'));
    } else {
        console.log(chalk.yellow('\n⚠ Some pulses were dropped or rejected (Expected if rate-limited).'));
    }
}

runStressSuite().catch(console.error);
