const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const ai = require('../lib/ai_provider');

const docsGen = async () => {
    console.log(chalk.bold.magenta('\n📄 GapsyAI AI Documentation Autocode Engine'));
    console.log(chalk.gray('Synthesizing project neural traces into high-fidelity technical docs...\n'));

    if (!fs.existsSync('.gapsy_index')) {
        console.log(chalk.yellow('⚠️ No project index found. Run "gapsyai index" first for better results.'));
    }

    const indexContent = fs.existsSync('.gapsy_index') ? fs.readFileSync('.gapsy_index', 'utf8') : 'No index available.';
    
    try {
        process.stdout.write(chalk.cyan('  Architecting site structure... '));
        const sitePlan = await ai.generate({
            prompt: `Create a documentation structure for this project index:\n\n${indexContent}`,
            systemInstruction: 'You are a Documentation Architect. Respond with a JSON object: { "pages": [{ "title": "string", "slug": "string" }] }',
            endpoint: '/cli/analyze/docs_gen_plan',
            data: { index: indexContent }
        });
        const plan = JSON.parse(cleanJson(sitePlan));
        console.log(chalk.green('✔'));

        const docsDir = path.join(process.cwd(), 'docs');
        if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);

        for (const page of plan.pages) {
            process.stdout.write(chalk.gray(`    Building ${page.title}... `));
            const content = await ai.generate({
                prompt: `Generate detailed technical documentation for "${page.title}" based on this architecture:\n\n${indexContent}`,
                systemInstruction: 'You are a technical writer. Return content in clean HTML with Tailwind CSS classes for styling (dark mode, glassmorphism).',
                endpoint: '/cli/analyze/docs_gen_page',
                data: { page, index: indexContent }
            });
            
            fs.writeFileSync(path.join(docsDir, `${page.slug}.html`), wrapTemplate(page.title, content));
            console.log(chalk.green('✔'));
        }

        // Generate Index.html
        process.stdout.write(chalk.gray('    Finalizing portal... '));
        const indexHtml = wrapTemplate('Project Documentation Portal', `
            <div className="max-w-4xl mx-auto py-20">
                <h1 class="text-6xl font-black italic tracking-tighter uppercase mb-12">Project <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Docs</span></h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    ${plan.pages.map(p => `
                        <a href="${p.slug}.html" class="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white hover:text-black transition-all group">
                            <h3 class="text-xl font-bold uppercase tracking-tight">${p.title}</h3>
                            <p class="text-sm opacity-40 mt-2 font-mono uppercase tracking-widest group-hover:text-black">Explore documentation →</p>
                        </a>
                    `).join('')}
                </div>
            </div>
        `);
        fs.writeFileSync(path.join(docsDir, 'index.html'), indexHtml);
        console.log(chalk.green('✔'));

        // Sync with Backend
        process.stdout.write(chalk.cyan('  Synchronizing with GapsyAI Portal... '));
        try {
            await ai.generate({
                prompt: `Sync documentation for project. Plan: ${JSON.stringify(plan)}`,
                systemInstruction: 'You are a sync engine. Return success.',
                endpoint: '/cli/sync/documentation',
                data: { 
                    title: 'Project Neural Index',
                    slug: 'neural-index-' + Date.now(),
                    version: '3.0.0',
                    structure: plan
                }
            });
            console.log(chalk.green('✔'));
        } catch (e) {
            console.log(chalk.yellow('SKIPPED (Backend Offline)'));
        }

        console.log(chalk.bold.green(`\n✅ Documentation Suite successfully generated in ${chalk.white('./docs/index.html')}`));
    } catch (error) {
        console.error(chalk.red(`\n✘ Documentation failed: ${error.message}`));
    }
};

const cleanJson = (str) => {
    let clean = str.trim();
    if (clean.includes('{')) {
        clean = clean.substring(clean.indexOf('{'), clean.lastIndexOf('}') + 1);
    }
    return clean;
};

const wrapTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | GapsyAI Docs</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: white; }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); }
    </style>
</head>
<body class="p-8 md:p-20">
    <nav class="mb-12 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
        <a href="index.html" class="font-black italic uppercase tracking-tighter">GapsyAI <span class="text-gray-500">Docs</span></a>
        <span class="text-[10px] font-black uppercase tracking-[0.4em]">v3.0 Index Synth</span>
    </nav>
    <main>
        ${content}
    </main>
    <footer class="mt-20 pt-10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
        Generated by GapsyAI Neural Autocode Engine
    </footer>
</body>
</html>
`;

module.exports = { docsGen };
