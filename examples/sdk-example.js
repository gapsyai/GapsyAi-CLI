/**
 * GapsyAI SDK Example: Integrated Gameplay Reporting
 */

const GapsyAI = require('../lib/sdk');

// 1. Initialize SDK
const gapsy = new GapsyAI({
    apiKey: 'YOUR_API_TOKEN', // In development, this is set via environment or config
    projectName: 'Quantum Survival'
});

console.log('--- GapsyAI SDK Simulation Started ---\n');

// 2. Trace Events (simulated gameplay)
gapsy.trace('discovery', 'Found Ancient Terminal in Level 4', 75);
gapsy.trace('combat', 'Defeated boss "The Sentinel"', 90);
gapsy.trace('error', 'Critical Logic Error: NPC NavMesh missing in sector 7', 20);

// 3. Sync to Portal (End of Session/Checkpoint)
gapsy.sync().then(success => {
    if (success) {
        console.log('\n--- GapsyAI SDK Session Synchronized ---');
    } else {
        console.log('\n--- GapsyAI SDK Sync Failed (Check API Keys) ---');
    }
});
