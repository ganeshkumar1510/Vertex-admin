# Project Architecture: Tesseract Vertex

## 🛠️ The Stack
- **Framework**: React 19 (Vite)
- **Intelligence**: Antigravity Multi-Agent Workflow
- **Styling**: Tailwind CSS + Custom Design Tokens (tokens.css)
- **Routing**: React Router v7 (Context Shell Strategy)
- **Persistence**: LocalStorage with Prefix-Isolation (storage.js)
- **Icons**: Lucide React

## 📂 Directory Structure
```
Tesseract/
├── src/
│   ├── components/
│   │   ├── ui/                  # Atomic Primitives (Logo, Card, ModeToggle)
│   │   └── layout/              # Structural Shells (Sidebar, Topbar)
│   ├── providers/               # Context Providers (ModeProvider)
│   ├── pages/                   # Feature Screens (Dashboard, Onboarding)
│   ├── utils/                   # Logic (Storage, MockData)
│   ├── lib/                     # Helpers (cn utility)
│   └── index.css                # Style Orchestrator
├── styles/
│   └── tokens.css               # Design Token Definitions
└── docs/                        # Specifications & Philosophy
```

## 🗺️ Routing Strategy: Context Shells
Tesseract Vertex uses a **Multi-Path Context Shell** strategy to isolate data scopes:
- `/onboarding`: Gateway choice and PIN verification.
- `/admin-demo/*`: Static mock-data instance.
- `/:username/*`: Personal persistent instance.

Each path is wrapped in a `<CRMShell>` which handles the data-provider context and injected styles. The `ModeProvider` manages the visual state (Aether/Quasar) globally.

## 🔒 Persistence Engine
The `storage.js` utility implements a **Prefix-Isolation** engine. Depending on the current route (`/demo`, `/test`, or personal), it automatically prefixes all LocalStorage keys to prevent data pollution across different work instances.
