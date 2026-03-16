# GapsyAI CLI ⚡ [v3.0 Deep Evolution]

> The First Forever-Free AI CLI for Game Devs with Pro Visual Intelligence.

GapsyAI CLI is a high-performance command-line tool designed to bridge your local game scripts with deep neural intelligence. Generate procedural assets, audit memory heaps, forecast monetization A/B tests, and automate behavior-driven playtesting directly from your terminal.

**Why Free?** We believe core developer tools should be free. Bring your own keys (Gemini, OpenAI, Ollama) and keep your workflow local. **GapsyAI 3.0** introduces deep integration with the Pro Platform for visual heatmaps and advanced reporting.

## 🚀 Quick Start

### Installation
```bash
npm install -g gapsyaicli
```

### Configuration
```bash
gapsyai config set provider ai_core
gapsyai config set apiKey YOUR_AI_API_KEY
```

---

## 🛠 Commands (v3.0 Deep Evolution)

### 🔬 Deep Analyzers (`gapsyai <command>`)
*Requires GapsyAI Pro for visual data processing.*

| Command | Description | Example |
| :--- | :--- | :--- |
| `archetypes` | Cluster playtesters into behavioral cohorts (Bartle types) | `gapsyai archetypes` |
| `security-scan`| Run AI-powered DevSecOps vulnerability scan on CI/CD | `gapsyai security-scan` |
| `ab-test` | Forecast the winner of monetization A/B variants | `gapsyai ab-test --variant-a "Battle Pass" --variant-b "Loot Boxes"` |
| `heap-scan` | Visualize memory leaks and allocation hotspots | `gapsyai heap-scan` |
| `l10n-audit` | Audit dialogue localization quality across regions | `gapsyai l10n-audit` |
| `poly-optimize`| Analyze mesh complexity and generate LOD strategy | `gapsyai poly-optimize` |
| `montecarlo` | Run 10,000-player economy Monte Carlo simulations | `gapsyai montecarlo` |
| `arc` | Map the emotional intensity arc of your trailers | `gapsyai arc` |
| `burnout` | Predict team burnout risk via velocity vs crunch analysis | `gapsyai burnout` |
| `complexity` | Generate a visual complexity heatmap for quest nodes | `gapsyai complexity` |
| `navmesh` | Extract walkable AI NavMesh from playtest heatmap data | `gapsyai navmesh` |
| `pulse` | Get high-level project health metrics from Pulse Dashboard | `gapsyai pulse` |
| `replay` | Visualize a neural playtest trace in the terminal | `gapsyai replay <id>` |
| `docs- `gapsyai find`: Search your project neural index semantically.
- `gapsyai heal [--dry-run]`: Autonomous self-healing engine to fix bugs and lints.
- `gapsyai refactor [target]`: Refactor and optimize code for performance and readability.
- `gapsyai sense`: Analyze real-time project sentiment and "vibe".
- `gapsyai docs-gen`: Generate a complete technical documentation site.
| Command | Description | Example |
| :--- | :--- | :--- |
| `analyze` | Run a full project health scan | `gapsyai analyze` |
| `bug <file>` | Detect bugs and performance bottlenecks | `gapsyai bug player.cs` |
| `fix <file>` | Automatically suggest and apply code fixes | `gapsyai fix enemy.js` |
| `optimize <file>`| Suggest FPS and performance improvements | `gapsyai optimize player.cs` |
| `balance` | Analyze enemy stats, rewards, and difficulty | `gapsyai balance` |
| `performance` | Profile FPS drops and memory leak patterns | `gapsyai performance` |
| `economy` | Analyze economy flow, prices, and inflation | `gapsyai economy` |
| `playtest` | Simulate player behavior and difficulty spikes | `gapsyai playtest` |
| `monitor` | Run automated CI/CD quality gates | `gapsyai monitor` |

### 🎨 Generators
| Command | Description | Example |
| :--- | :--- | :--- |
| `dialogue` | Generate NPC dialogues and player choices | `gapsyai dialogue` |
| `quest` | Generate side quests and objectives | `gapsyai quest` |
| `level` | Generate level layouts and environmental ideas | `gapsyai level` |
| `script` | Generate boilerplate for Unity, Unreal, or Godot | `gapsyai script` |
| `blueprint` | Generate complete game systems (e.g., "Combat System") | `gapsyai blueprint` |
| `item/enemy` | Procedural item and enemy ability generation | `gapsyai item` |
| `story` | Generate narrative plot points and twists | `gapsyai story` |
| `scaffold` | [Phase 4] Generate full project structure | `gapsyai scaffold` |

### 🛠 Utility & Media
| Command | Description | Example |
| :--- | :--- | :--- |
| `asset-prompt`| Generate AI prompts for art/textures | `gapsyai asset-prompt` |
| `sfx` | Generate technical sound effect prompts | `gapsyai sfx "sci-fi reload"` |
| `sonic` | Get AI-suggested music/SFX directions | `gapsyai sonic "eerie cave"` |
| `map` | Generate procedural ASCII game maps | `gapsyai map --biome cave` |
| `voice` | Create character voice/personality guides | `gapsyai voice "Grom the Orc"` |
| `visualize` | Generate diagrams (story/logic/quest) | `gapsyai visualize story` |
| `chat` | Chat with AI for real-time help | `gapsyai chat "How to Raycast?"` |
| `migrate` | Migrate logic between game engines | `gapsyai migrate --target unity` |

### 🧠 Knowledge & Teamwork
| Command | Description | Example |
| :--- | :--- | :--- |
| `hooks` | Manage Git hooks for AI monitoring | `gapsyai hooks setup` |
| `team-activity`| View recent AI activity from your team | `gapsyai team-activity` |
| `knowledge` | Manage team-wide AI Knowledge Base | `gapsyai knowledge list` |

---

## 💎 Pro Platform Integration
The CLI handles the raw data; the **[GapsyAI Dashboard](https://gapsyai.com)** provides the visual intelligence:
- **Visual Quest Graph**: Interactive node-based story designer.
- **Neural Heatmaps**: Behavioral visualization of playtest runs.
- **A/B Predictor UI**: Visual comparison of monetization strategies.
- **Team Health Radar**: Track burnout risks and velocity visually.

## ⚙️ Configuration
The default API endpoint is typically set to `http://localhost:8000/api` for local development. Adjust via:
```bash
gapsyai config set apiUrl http://your-server/api
```

## 📄 License
GapsyAI CLI is open-sourced software licensed under the [MIT license](LICENSE).
