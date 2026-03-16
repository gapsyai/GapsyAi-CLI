const ai = require('../lib/ai_provider');
const analyzers = require('../commands/analyzers');
const fs = require('fs');
const path = require('path');

jest.mock('../lib/ai_provider');
jest.mock('../lib/context', () => ({
    getContext: jest.fn(() => ({ engine: 'unity', name: 'TestProject' }))
}));

describe('CLI Analyzers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('bug command reads file and calls ai.generate', async () => {
        const testFile = 'test.cs';
        const testContent = 'public class Test {}';
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(testContent);
        
        ai.generate.mockResolvedValue('No bugs found');

        await analyzers.bug(testFile);

        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/bug',
            data: expect.objectContaining({ filename: testFile, content: testContent })
        }));
    });

    test('analyzeProject command reads directory and calls ai.generate', async () => {
        jest.spyOn(fs, 'readdirSync').mockReturnValue(['file1.js', 'file2.js']);
        ai.generate.mockResolvedValue('Project looks good');

        await analyzers.analyzeProject();

        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/project',
            data: expect.objectContaining({ files_list: 'file1.js, file2.js' })
        }));
    });

    test('performance command calls ai.generate', async () => {
        ai.generate.mockResolvedValue('Optimization required');

        await analyzers.performance();

        expect(ai.generate).toHaveBeenCalledWith(expect.objectContaining({
            endpoint: '/cli/analyze/performance'
        }));
    });
});
