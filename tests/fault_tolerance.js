/**
 * GapsyAI SDK Fault Tolerance Test
 */

const GapsyAI = require('../lib/sdk');

async function testFaultTolerance() {
    console.log('--- GapsyAI SDK Fault Tolerance Test ---');

    // 1. Point to an invalid URL to simulate network/server failure
    const gapsy = new GapsyAI({
        apiKey: 'TEST_KEY',
        apiUrl: 'http://invalid-gapsy-url:9999/api' 
    });

    gapsy.trace('system', 'Attempting sync to unreachable server', 10);

    console.log('Calling sync()... (should fail gracefully)');
    const success = await gapsy.sync();

    if (!success) {
        console.log('\n✔ SDK failed gracefully as expected.');
        console.log('Fault tolerance verified: Game engine would continue unaffected.');
    } else {
        console.log('\n✘ SDK unexpectedly reported success.');
    }
}

testFaultTolerance().catch(console.error);
