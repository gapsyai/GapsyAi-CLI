const ai = require('../lib/ai_provider');
const generators = require('../commands/generators');
const inquirer = require('inquirer');

jest.mock('inquirer');
jest.mock('../lib/ai_provider');
jest.mock('../lib/context', () => ({
    getContext: jest.fn(() => ({ engine: 'unity', name: 'TestProject' }))
}));

describe('CLI Generators', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('dialogue command calls ai.generate with correct prompt', async () => {
        inquirer.prompt.mockResolvedValue({
            genre: 'horror',
            character: 'ghost',
            scene: 'attic'
        });
        
        ai.generate.mockResolvedValue('Mocked Dialogue Response');

        await generators.dialogue();

        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/dialogue',
            data: expect.objectContaining({
                genre: 'horror',
                character: 'ghost',
                scene: 'attic'
            })
        }));
    });

    test('quest command calls ai.generate with correct prompt', async () => {
        inquirer.prompt.mockResolvedValue({ theme: 'Space Exploration' });
        ai.generate.mockResolvedValue('Mocked Quest Response');

        await generators.quest();

        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/quest',
            data: expect.objectContaining({ theme: 'Space Exploration' })
        }));
    });

    test('level command calls ai.generate with correct prompt', async () => {
        inquirer.prompt.mockResolvedValue({ environment: 'Mars', difficulty: 'Legendary' });
        ai.generate.mockResolvedValue('Mocked Level Response');

        await generators.level();

        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/level'
        }));
    });

    test('brain command saves npc profile to file', async () => {
        const fs = require('fs');
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
        
        ai.generate.mockResolvedValue({ personality: 'cheerful' });

        await generators.brain('Sunny');

        expect(fs.writeFileSync).toHaveBeenCalled();
        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/generate/brain',
            data: expect.objectContaining({ name: 'Sunny' })
        }));
    });
});
