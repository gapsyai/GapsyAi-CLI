/**
 * GapsyAI Neural SDK v1.0
 * Lightweight JS library for Game Engine Integration
 */

const axios = require('axios');

class GapsyAI {
    constructor(config = {}) {
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl || 'http://localhost:8000/api';
        this.projectName = config.projectName || 'Untitled Project';
        this.sessionData = {
            timeline: []
        };
        
        if (!this.apiKey) {
            console.warn('[GapsyAI SDK] Warning: API Key not set. Tracking in offline mode.');
        }
    }

    /**
     * Track a gameplay event for the Neural Replay Trace
     */
    trace(type, message, impact = 50) {
        const event = {
            timestamp: new Date().toISOString(),
            type: type, // combat, discovery, dialogue, error
            message: message,
            impact: impact
        };
        
        this.sessionData.timeline.push(event);
        console.log(`[GapsyAI SDK] Neural Trace: [${type.toUpperCase()}] ${message}`);
        
        return event;
    }

    /**
     * Submit session data to GapsyAI Portal
     */
    async sync() {
        if (!this.apiKey) {
            console.error('[GapsyAI SDK] Cannot sync: API Key missing.');
            return false;
        }

        try {
            console.log('[GapsyAI SDK] Syncing neural trace to portal...');
            const response = await axios.post(`${this.apiUrl}/cli/sync/playtest`, {
                name: this.projectName,
                timeline: this.sessionData.timeline
            }, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });

            console.log('[GapsyAI SDK] ✔ Sync Successful. Session ID:', response.data.id || 'N/A');
            return true;
        } catch (error) {
            console.error('[GapsyAI SDK] ✘ Sync Failed:', error.response?.data?.message || error.message);
            return false;
        }
    }

    /**
     * Reset session data
     */
    clear() {
        this.sessionData.timeline = [];
    }
}

module.exports = GapsyAI;
