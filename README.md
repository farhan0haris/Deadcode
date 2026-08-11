# DeadCode 💀⏳

> *Every commit has a ghost.*

DeadCode is a privacy-first, 100% offline Git time machine and developer journey visualizer. It scans local Git repositories to reveal what you were coding on this exact day in previous years ("On This Day"), calculates comprehensive developer stats, tracks language evolution, unlocks local achievements, and renders an interactive 3D Git constellation background.

---

## 🌟 Key Features

- 🕰️ **On This Day Memories:** Automatically discovers commits pushed 1, 2, 3, 5, or 10+ years ago today.
- 📁 **Recursive Git Scanner:** Scans user-selected local directories while skipping heavy folders (`node_modules`, `dist`, `.cache`, etc.).
- 📊 **Local Analytics Engine:** Computes total lines added/removed, streaks, night coding percentages, and peak activity times offline.
- 🏆 **Automated Achievements:** Unlocks local badges like *First Commit*, *Night Owl*, *Refactor Master*, and *Polyglot*.
- 🔍 **Instant Search & Diff Viewer:** Search across commits and view colorized diff additions/deletions inline.
- 🌌 **Subtle 3D Background:** React Three Fiber ambient Git constellation particle background.
- 💻 **CLI Tool:** Rich terminal commands (`deadcode scan`, `deadcode today`, `deadcode stats`, `deadcode doctor`).
- 🔒 **100% Offline & Private:** Read-only Git operations. No accounts, cloud sync, telemetry, or API keys required.

---

## 🏗️ Architecture

```
deadcode/
├── backend/                  # Python FastAPI & CLI
│   ├── app/
│   │   ├── main.py           # REST API Server
│   │   ├── scanner.py        # Recursive Git & SQLite Indexer
│   │   ├── analytics.py      # Stats & Milestone Calculators
│   │   ├── achievements.py   # Badge Engine
│   │   └── export.py         # Markdown, HTML, JSON & CSV Exporter
│   └── cli.py                # Typer + Rich CLI Application
└── frontend/                 # Vite + React + TypeScript
    ├── src/
    │   ├── components/       # Glassmorphic UI & R3F 3D Canvas
    │   ├── pages/            # 10 Responsive Dashboard & Feature Views
    │   └── api/              # TanStack Query & API Client
```

---

## 🚀 Quick Start & Installation

### 1. Backend & CLI Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

Run the backend server:
```bash
python -m app.main
```

Run the CLI tool:
```bash
python cli.py scan C:\Users\YourName\Documents
python cli.py today
python cli.py stats
```

### 2. Frontend Web App Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📄 License
MIT License. 100% Open Source.
