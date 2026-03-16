/**
 * Deep CLI Workflow, Translate, Debug & Cloud Tests
 * Tests: explain, fix-workflow, optimize-workflow, translate, debug,
 *        cloud-dialogue, behavior-tree, playtest-bots, asset-version
 */

const ai = require('../lib/ai_provider');
const analyzers = require('../commands/analyzers');
const generators = require('../commands/generators');
const inquirer = require('inquirer');
const fs = require('fs');

jest.mock('inquirer');
jest.mock('../lib/ai_provider');
jest.mock('../lib/api', () => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: { success: true } }))
}));
jest.mock('../lib/context', () => ({
    getContext: jest.fn(() => ({ engine: 'godot', name: 'Mazerunners', genre: 'Puzzle' }))
}));

describe('CLI Workflow Commands', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ai.generate.mockResolvedValue('Mocked Workflow Output');
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('// code here');
    });

    test('explain command explains code logic', async () => {
        await analyzers.explain('combat.cs');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/workflow/explain'
        }));
    });

    test('explain returns early when no file given', async () => {
        await analyzers.explain();
        expect(ai.generate).not.toHaveBeenCalled();
    });

    test('optimize workflow command optimizes code', async () => {
        await analyzers.optimize('physics.cs');
        expect(ai.generate).toHaveBeenCalled();
    });
});

describe('CLI Translate Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ai.generate.mockResolvedValue('Mocked Translation');
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('void Start() {}');
    });

    test('translate command converts code between languages', async () => {
        inquirer.prompt.mockResolvedValue({ target_lang: 'GDScript' });
        await analyzers.translate('player.cs');
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/translate'
        }));
    });

    test('translate returns early without file', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        await analyzers.translate();
        expect(ai.generate).not.toHaveBeenCalled();
    });
});

describe('CLI Advanced Features', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ai.generate.mockResolvedValue('Mocked Cloud Output');
    });

    // chat is in generators
    test('chat command works', async () => {
        inquirer.prompt.mockResolvedValue({ message: 'exit' });
        await generators.chat('hello');
        expect(ai.generate).toHaveBeenCalled();
    });

    test('worldBridge command works', async () => {
        const api = require('../lib/api');
        await generators.worldBridge();
        expect(api.post).toHaveBeenCalledWith('/user/world-builder/sync', expect.anything());
    });
});
