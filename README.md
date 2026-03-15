# GapsyAI CLI ⚡

> The First Forever-Free AI CLI for Game Devs.

GapsyAI CLI is a powerful command-line tool designed to streamline game development workflows. Generate procedural assets, analyze scripts for bugs, and automate CI/CD checks directly from your terminal.

**Why Free?** We believe developers shouldn't pay for CLI tools. Use your own AI keys (Gemini, OpenAI, Ollama) and keep your workflow local. Upgrade to GapsyAI Pro for visual dashboards and advanced reporting.

## 🚀 Quick Start

### Installation

Install the CLI globally using npm:

```bash
npm install -g gapsyaicli
```

### Configuration (Bring Your Own Key)

Unlike other tools, GapsyAI CLI lets you choose your AI provider. Set up your provider and API key:

```bash
gapsyai config set provider gemini
gapsyai config set apiKey YOUR_GEMINI_API_KEY
```

*Supported Providers: gemini, openai, ollama (local), custom.*

## ❓ CLI Help

To see all available commands and options, run:

```bash
gapsyai --help
```

## 🛠 Commands

### Generators (`gapsyai <command>`)

Generate game assets and logic using AI.

| Command | Description | Example |
| :--- | :--- | :--- |
| `dialogue` | Generate NPC dialogues and player choices | `gapsyai dialogue` |
| `quest` | Generate side quests and objectives | `gapsyai quest` |
| `level` | Generate level design ideas and layouts | `gapsyai level` |
| `script` | Generate game scripts (C#, JavaScript, etc.) | `gapsyai script` |
| `idea` | Generate random game concepts and mechanics | `gapsyai idea` |
| `item` | Generate procedural items (weapons, magic) | `gapsyai item` |
| `enemy` | Generate enemy abilities and attack patterns | `gapsyai enemy` |
| `story` | Generate main storylines and plot twists | `gapsyai story` |
| `gameplay` | Generate core loops and progression systems | `gapsyai gameplay` |
| `skilltree` | Generate branching RPG skill trees | `gapsyai skilltree` |
| `asset-prompt`| Generate AI prompts for textures and assets | `gapsyai asset-prompt`|
| `jam` | Generate ideas for game jams | `gapsyai jam` |
| `trailer` | Generate YouTube scripts and marketing hooks | `gapsyai trailer` |
| `patchnotes` | Generate developer release notes from Git commits | `gapsyai patchnotes` |
| `chat` | **[NEW]** Interactive AI chat for game dev help | `gapsyai chat "Help me with quest design"` |
| `blueprint` | **[NEW]** Generate complete game system boilerplate | `gapsyai blueprint "Lobby System"` |

### Analyzers (`gapsyai <command>`)

Analyze and optimize your project for performance and balance.

| Command | Description | Example |
| :--- | :--- | :--- |
| `analyze` | Run a full project health scan | `gapsyai analyze` |
| `bug <file>` | Detect bugs and performance bottlenecks | `gapsyai bug player.cs` |
| `explain <file>`| Explain complex code logic in simple terms | `gapsyai explain player.cs` |
| `fix <file>` | Suggest and apply AI-driven code fixes | `gapsyai fix enemy.js` |
| `optimize <file>`| Suggest FPS and performance improvements | `gapsyai optimize player.cs` |
| `docs <file>` | Generate code documentation and API notes | `gapsyai docs player.cs` |
| `balance` | Analyze game difficulty and reward parity | `gapsyai balance` |
| `performance`| Profile FPS drops and memory leaks | `gapsyai performance` |
| `economy` | Analyze game economy and inflation risks | `gapsyai economy` |
| `assets` | Scan for duplicate and unused textures | `gapsyai assets` |
| `playtest` | Simulate player behavior and difficulty | `gapsyai playtest` |
| `multiplayer` | Help with lobby, matchmaking, and sync logic| `gapsyai multiplayer`|
| `monitor` | Run automated CI/CD quality checks | `gapsyai monitor` |
| `index` | **[NEW]** Index project for local AI context (RAG) | `gapsyai index` |

### Utilities

Manage your GapsyAI CLI state.

- `init`: Initialize GapsyAI context for your project.
- `login`: Authenticate with your GapsyAI API key.
- `brain <name>`: Generate a structured NPC personality.
- `translate <file>`: Localize dialogue files into ES, JP, CH.
- `usage`: Check your AI usage and limits.
- `config`: Manage CLI configuration and endpoints.
- `chat`: Interactive AI chat with Smart Actions.
- `index`: Index project files for better AI context.
- `hooks setup`: Install Git hooks for auto-monitoring.
- `update`: Check and install latest updates.
- `version`: Display the current version.

## 📖 Example Usage

### `gapsyai dialogue`
**Example Output:**
```text
NPC: Old Wizard
"The sword you seek lies beyond the cursed forest."

Choices:
1. Tell me more
2. Why is it cursed?
3. I will find it myself
```

## 🧠 AI Engine & Smart Actions

GapsyAI CLI is powered by the **GapsyAI Engine**, an AI system designed specifically for game development workflows. 

**Smart Actions**: The new `gapsyai chat` mode supports "Smart Actions." You can simply ask GapsyAI to "Generate a quest for me" or "Analyze this file for bugs," and it will automatically trigger the corresponding CLI command for you.

## 🎮 Supported Engines

GapsyAI works with most game development environments because it analyzes scripts and project files directly:
- **Unity** (C#)
- **Unreal Engine** (C++, Blueprints)
- **Godot** (GDScript, C#)
- **GameMaker**, **RPG Maker**, and more.

## ⚙️ Project Context

The CLI supports **Enhanced Project Context**. Run `gapsyai init` to create a `.gapsy` configuration file. 

### `.gapsy` Example:
```json
{
  "name": "MyAwesomeRPG",
  "engine": "unity",
  "language": "csharp",
  "genre": "rpg",
  "target_platform": "pc",
  "scriptsPath": "./Assets/Scripts"
}
```

## ⚙️ Configuration

GapsyAI CLI stores local data in your user profile. The default API endpoint is `http://localhost:8000/api`. You can modify this via `gapsyai config`.

## 🛠 CI/CD Integration

Automate your quality checks using GitHub Actions:

```yaml
- name: GapsyAI Analysis
  run: |
    npm install -g gapsyaicli
    gapsyai analyze
    gapsyai balance
```

## 💎 GapsyAI Platform (Premium)

While the CLI is free, the **GapsyAI Web Dashboard** provides premium visual tools for Pro and Studio members:

- **Visual Quest Graph (Pro)**: Design narrative flows on an interactive canvas.
- **AI Live Debugger (Pro)**: Get 1-click fixes for runtime errors.
- **Cloud Dialogue DB (Pro)**: Store and fetch PCG dialogues at runtime.
- **Behavior Tree Architect (Pro)**: Design NPC logic visually.
- **AI Playtest Bots (Studio)**: Stress-test your game with automated bots.
- **Asset Intelligence (Pro)**: Visual diff and versioning for 3D assets.
- **AI Playtest Reports (Pro)**: Get behavior heatmaps and difficulty spike graphs.

[Explore GapsyAI Pro →](https://gapsyai.com/plans)

## 🤝 Contributing

Contributions are welcome!
1. **Fork** the repository.
2. Create a **new branch**.
3. Submit a **Pull Request**.

## 📄 License

GapsyAI CLI is open-sourced software licensed under the [MIT license](LICENSE).
