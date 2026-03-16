# GapsyAI CLI ⚡ [v3.0.6 Deep Evolution]

> The First Forever-Free AI CLI for Game Devs with Pro Visual Intelligence.

GapsyAI CLI is a high-performance command-line tool designed to bridge your local game scripts with deep neural intelligence. Generate procedural assets, audit memory heaps, forecast monetization A/B tests, and automate behavior-driven playtesting directly from your terminal.

---

## 🚀 Quick Start

### Installation
```bash
npm install -g gapsyaicli
```

### Authentication (Improved)
GapsyAI 3.0.6 offers two ways to connect:

1. **GapsyAI.com (Recommended)**: Connect to the GapsyAI cloud for visual reporting, RAG, and team features.
2. **Direct API Connection (BYOK)**: Bring Your Own Key! Connect directly to Google Gemini, OpenAI, or local Ollama instances.

```bash
gapsyai login
```
*The CLI will guide you through selecting a provider and automatically discovering available models.*

---

## 🛠 Features

### 🔬 Deep Analyzers (`gapsyai <command>`)
| Command | Description | Example |
| :--- | :--- | :--- |
| `archetypes` | Cluster playtesters into behavioral cohorts | `gapsyai archetypes` |
| `security-scan`| AI-powered DevSecOps vulnerability scan | `gapsyai security-scan` |
| `ab-test` | Forecast monetization A/B variants | `gapsyai ab-test` |
| `heap-scan` | Visualize memory leaks & hotspots | `gapsyai heap-scan` |
| `l10n-audit` | Audit dialogue localization quality | `gapsyai l10n-audit` |
| `poly-optimize`| Analyze mesh complexity & LOD strategy | `gapsyai poly-optimize` |
| `montecarlo` | 10k-player economy simulations | `gapsyai montecarlo` |
| `pulse` | Get high-level project health metrics | `gapsyai pulse` |
| `heal` | Autonomous self-healing engine | `gapsyai heal` |

### 🎨 Generators
| Command | Description | Example |
| :--- | :--- | :--- |
| `dialogue` | Generate NPC dialogues and choices | `gapsyai dialogue` |
| `quest` | Generate side quests and objectives | `gapsyai quest` |
| `level` | Generate level layouts and puzzles | `gapsyai level` |
| `script` | Generate code for Unity, Unreal, Godot | `gapsyai script` |
| `blueprint` | Generate complete game system boilerplate | `gapsyai blueprint` |
| `idea` | Generate unique game concepts | `gapsyai idea` |
| `item/enemy` | Procedural asset generation | `gapsyai item` |

### 🛠 Utility & Chat
- `gapsyai chat`: Interactive AI help for game dev questions.
- `gapsyai docs-gen`: Generate technical documentation sites.
- `gapsyai update`: Stay on the latest neural version.
- `gapsyai usage`: Monitor your AI call limits and plan.

---

## ⚙️ Configuration
Manually override settings if needed:
```bash
gapsyai config view
gapsyai config set provider ai_core
gapsyai config set model gemini-1.5-flash
```

## 💎 Pro Platform Integration
While the CLI handles raw data, visit **[GapsyAI Dashboard](https://gapsyai.com)** for:
- **Visual Quest Graphs**
- **Neural Playtest Heatmaps**
- **Team Burnout Radar**
- **Monetization Predictors**

## 📄 License
GapsyAI CLI is open-sourced software licensed under the [MIT license](LICENSE).
