/**
 * Deep CLI Generators Test — Part 2
 * Tests: script, idea, item, enemy, story, asset-prompt, jam, gameplay, skilltree, 
 *        trailer, patchnotes, blueprint, commit, test-gen, migrate, sfx, map, voice, visualize
 */

const ai = require('../lib/ai_provider');
const generators = require('../commands/generators');
const analyzers = require('../commands/analyzers');
const inquirer = require('inquirer');
const fs = require('fs');

jest.mock('inquirer');
jest.mock('../lib/ai_provider');
jest.mock('child_process', () => ({
    execSync: jest.fn(() => Buffer.from('feat: added player movement'))
}));
jest.mock('../lib/api', () => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: { success: true } }))
}));
jest.mock('../lib/context', () => ({
    getContext: jest.fn(() => ({ engine: 'unity', name: 'TestProject', genre: 'RPG' }))
}));

describe('CLI Generators — Extended Commands', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ai.generate.mockResolvedValue('Mocked AI Output');
    });

    // ── script ────────────────────────────────────────────────────────────────
    test('script command calls ai.generate with correct endpoint', async () => {
        inquirer.prompt.mockResolvedValue({ request: 'Unity player movement' });
        await generators.script();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/script'
        }));
    });

    // ── idea ──────────────────────────────────────────────────────────────────
    test('idea command calls ai.generate', async () => {
        inquirer.prompt.mockResolvedValue({ topic: 'combat mechanics' });
        await generators.idea();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/idea'
        }));
    });

    // ── item ──────────────────────────────────────────────────────────────────
    test('item command generates loot item', async () => {
        inquirer.prompt.mockResolvedValue({ type: 'weapon', rarity: 'legendary' });
        await generators.item();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/item'
        }));
    });

    // ── enemy ─────────────────────────────────────────────────────────────────
    test('enemy command generates enemy design', async () => {
        inquirer.prompt.mockResolvedValue({ biome: 'forest', difficulty: 'hard' });
        await generators.enemy();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/enemy'
        }));
    });

    // ── story ─────────────────────────────────────────────────────────────────
    test('story command generates narrative', async () => {
        inquirer.prompt.mockResolvedValue({ theme: 'betrayal', tone: 'dark' });
        await generators.story();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/story'
        }));
    });

    // ── economy ──────────────────────────────────────────────────────────────
    test('economy command generates economy balance', async () => {
        await analyzers.economy();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/economy'
        }));
    });

    // ── jam ───────────────────────────────────────────────────────────────────

    // ── gameplay ──────────────────────────────────────────────────────────────
    test('gameplay command generates core loops', async () => {
        await analyzers.gameplay();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/gameplay'
        }));
    });

    // ── skilltree ─────────────────────────────────────────────────────────────
    test('skilltree command generates RPG trees', async () => {
        await analyzers.skilltree();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/skilltree'
        }));
    });

    // ── trailer ───────────────────────────────────────────────────────────────
    test('trailer command generates trailer script', async () => {
        inquirer.prompt.mockResolvedValue({ tone: 'epic', duration: 60 });
        await analyzers.trailer();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/trailer'
        }));
    });

    // ── patchnotes ────────────────────────────────────────────────────────────
    test('patchnotes command generates release notes', async () => {
        inquirer.prompt.mockResolvedValue({ version: '1.2.0', changes: 'fixed bugs' });
        await analyzers.patchnotes();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/patchnotes'
        }));
    });

    // ── blueprint ─────────────────────────────────────────────────────────────
    test('blueprint command generates system blueprint', async () => {
        await generators.blueprint('inventory system');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/blueprint'
        }));
    });

    // ── commit ────────────────────────────────────────────────────────────────
    test('commit command generates git commit message', async () => {
        inquirer.prompt.mockResolvedValue({ diff_summary: 'added player dash ability' });
        await generators.commit();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/commit'
        }));
    });

    // ── brain (NPC profile) already tested in generators.test.js ─────────────
    // ── sfx ───────────────────────────────────────────────────────────────────
    test('sfx command generates SFX description', async () => {
        await generators.sfx('sword swing');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/sfx'
        }));
    });

    // ── map ───────────────────────────────────────────────────────────────────
    test('map command generates world map layout', async () => {
        await generators.map({ size: 'large', biome: 'forest' });
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/map'
        }));
    });

    // ── voice ─────────────────────────────────────────────────────────────────
    test('voice command generates voice acting direction', async () => {
        await generators.voice('Arthur');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/voice'
        }));
    });

    // ── visualize ─────────────────────────────────────────────────────────────
    test('visualize command generates visual concept', async () => {
        await generators.visualize('UI Flow');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/visualize'
        }));
    });

    // ── asset-prompt ──────────────────────────────────────────────────────────
    test('assetPrompt command generates image prompt', async () => {
        inquirer.prompt.mockResolvedValue({ asset: 'character portrait', style: 'pixel art' });
        await generators.assetPrompt();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/asset-prompt'
        }));
    });

    // ── testGen ───────────────────────────────────────────────────────────────
    test('testGen command generates unit tests', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('function add(a, b) { return a + b; }');
        await generators.testGen('utils.js');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/test-gen'
        }));
    });

    // ── migrate ───────────────────────────────────────────────────────────────
    test('migrate command generates migration helper', async () => {
        await generators.migrate('player.cs', { target: 'Unity 6' });
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/migrate'
        }));
    });
});
