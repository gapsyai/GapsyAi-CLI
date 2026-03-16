/**
 * Deep CLI Analyzers Test — Full Coverage
 * Tests: balance, fix, optimize, docs, multiplayer, test, economy, assets, playtest
 */

const ai = require('../lib/ai_provider');
const analyzers = require('../commands/analyzers');
const fs = require('fs');
const inquirer = require('inquirer');

jest.mock('inquirer');
jest.mock('../lib/ai_provider');
jest.mock('child_process', () => ({
    execSync: jest.fn(() => Buffer.from('feat: mocked git log'))
}));
jest.mock('../lib/api', () => ({
    get: jest.fn(() => Promise.resolve({ data: [{ project_name: 'Test', metrics: { code_quality: 80, balance_score: 70, performance_index: 90, heatmap: [{x:0,y:0,value:50}] } }], summary: 'All good' })),
    post: jest.fn(() => Promise.resolve({ data: { success: true } }))
}));
jest.mock('../lib/context', () => ({
    getContext: jest.fn(() => ({ engine: 'unreal', name: 'PlanetGame', genre: 'Sci-Fi' }))
}));

describe('CLI Analyzers — Full Coverage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ai.generate.mockResolvedValue('Mocked Analysis Output');
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('void Update() { /* code */ }');
        jest.spyOn(fs, 'readdirSync').mockReturnValue(['main.cs']);
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    });

    // ── balance ───────────────────────────────────────────────────────────────
    test('balance calls correct endpoint', async () => {
        await analyzers.balance();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/balance'
        }));
    });

    // ── fix ───────────────────────────────────────────────────────────────────
    test('fix reads file content and calls ai', async () => {
        await analyzers.fix('player.cs');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/fix',
            data: expect.objectContaining({ filename: 'player.cs' })
        }));
    });

    // ── optimize ──────────────────────────────────────────────────────────────
    test('optimize reads file and calls ai', async () => {
        await analyzers.optimize('render.cs');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/workflow/optimize'
        }));
    });

    // ── docs ──────────────────────────────────────────────────────────────────
    test('docs generates documentation', async () => {
        await analyzers.docs('inventory.cs');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/docs'
        }));
    });

    // ── multiplayer ───────────────────────────────────────────────────────────
    test('multiplayer analyzes netcode', async () => {
        inquirer.prompt.mockResolvedValue({ request: 'lobby sync' });
        await analyzers.multiplayer();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/multiplayer'
        }));
    });

    // ── test ──────────────────────────────────────────────────────────────────
    test('test command simulates mechanics', async () => {
        inquirer.prompt.mockResolvedValue({ content: 'health system' });
        await analyzers.test();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/test'
        }));
    });

    // ── economy ───────────────────────────────────────────────────────────────
    test('economy analyzes in-game economy', async () => {
        await analyzers.economy();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/economy'
        }));
    } );

    // ── gameplay ──────────────────────────────────────────────────────────────
    test('gameplay analyzes loops', async () => {
        await analyzers.gameplay();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/gameplay'
        }));
    } );

    // ── skilltree ─────────────────────────────────────────────────────────────
    test('skilltree analyzes tree', async () => {
        await analyzers.skilltree();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/skilltree'
        }));
    } );

    // ── assets ───────────────────────────────────────────────────────────────
    test('assets command scans for optimization', async () => {
        await analyzers.assets();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/assets'
        }));
    });

    // ── trailer ──────────────────────────────────────────────────────────────
    test('trailer command scripts high-impact cues', async () => {
        await analyzers.trailer();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/trailer'
        }));
    });

    // ── patchnotes ───────────────────────────────────────────────────────────
    test('patchnotes command generates community notes', async () => {
        await analyzers.patchnotes();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/patchnotes'
        }));
    });

    // ── playtest ─────────────────────────────────────────────────────────────
    test('playtest command initiates AI simulation', async () => {
        await analyzers.playtest();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/simulate/playtest'
        }));
    });

    // ── analyzeProject ────────────────────────────────────────────────────────
    test('analyzeProject lists files correctly', async () => {
        await analyzers.analyzeProject();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/project'
        }));
    });

    // ── pulse & heatmap ──────────────────────────────────────────────────────
    test('dashboard commands works', async () => {
        const api = require('../lib/api');
        await analyzers.pulse();
        expect(api.get).toHaveBeenCalledWith('/user/project-analytics');
        await analyzers.heatmapView();
        expect(api.get).toHaveBeenCalledWith('/user/playtest-reports');
    });

    // ── comment & audit ──────────────────────────────────────────────────────
    test('comment and audit work', async () => {
        await analyzers.comment('player.cs');
        await analyzers.audit();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/audit'
        }));
    });
});
