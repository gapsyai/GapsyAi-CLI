# GapsyAI CLI ⚡

> The definitive AI orchestration layer for game architects.

GapsyAI CLI is a powerful command-line tool designed to streamline game development workflows. From generating procedural narratives to scanning scripts for logical anomalies, GapsyAI brings the power of neural integration directly to your terminal.

## 🚀 Quick Start

### Installation

Install the CLI globally using npm:

```bash
npm install -g gapsyaicli
```

*Note: If you are developing locally, run `npm link` inside the project directory.*

### Authentication

Initialize your neural link by providing your GapsyAI API key:

```bash
gapsyai login
```

You can find your API key in the GapsyAI Dashboard settings.

## 🛠 Commands

### Generators (`gapsyai <command>`)

Manifest complex assets and logic through neural orchestration.

| Command | Description | Example |
| :--- | :--- | :--- |
| `dialogue` | Generate NPC dialogues and branching narratives | `gapsyai dialogue` |
| `quest` | Orchestrate side quests and objectives | `gapsyai quest` |
| `level` | Generate procedural level design ideas | `gapsyai level` |
| `script` | Generate game scripts (C#, JavaScript, etc.) | `gapsyai script` |
| `idea` | Manifest random game concepts and mechanics | `gapsyai idea` |
| `sound` | Generate AI prompts for sound effects | `gapsyai sound` |

### Analyzers (`gapsyai <command>`)

Scan and refine your project for peak performance and balance.

| Command | Description | Example |
| :--- | :--- | :--- |
| `bug <file>` | Detect logical anomalies and performance bottlenecks | `gapsyai bug player.cs` |
| `balance` | Analyze game difficulty and reward parity | `gapsyai balance` |
| `fix <file>` | Automatically apply AI-driven code optimizations | `gapsyai fix enemy.js` |

### Utilities

Manage your GapsyAI protocol state.

- `usage`: Check your current neural uplink usage and limits.
- `update`: Synchronize with the latest CLI engine.
- `version`: Display the current forge version.

## ⚙️ Configuration

GapsyAI CLI stores local data in your user profile. The default API endpoint is `http://localhost:8000/api`. You can modify this in the configuration files if necessary.

## 📄 License

GapsyAI is proprietary software. All rights reserved. © 2026 GapsyAI Neural Labs.
