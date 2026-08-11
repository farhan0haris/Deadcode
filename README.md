<div align="center">

# 💀 DeadCode

### *Every commit has a ghost.*

**A privacy-first, 100% offline Git time machine and developer journey visualizer.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline-emerald.svg)]()
[![Python 3.8+](https://img.shields.io/badge/Python-3.8+-blue.svg)]()
[![React 18+](https://img.shields.io/badge/React-18+-61dafb.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)]()
[![Zero External Dependencies](https://img.shields.io/badge/Backend-Zero%20Dependencies-purple.svg)]()

---

[Key Features](#-key-features) •
[Quick Start](#-quick-start) •
[Web Interface](#-web-interface) •
[CLI Usage](#-cli-usage) •
[Architecture](#-architecture) •
[Privacy Guarantee](#-privacy--security-guarantee)

</div>

---

## 📖 Overview

**DeadCode** is an open-source local desktop visualizer and Command Line Interface (CLI) that turns your raw Git history into a personal memory bank and interactive dashboard.

Think of it as **Apple Journal + GitHub + Spotify Wrapped** combined into a single, offline developer experience.

It automatically scans your local project folders, discovers historic commits pushed on this exact day over past years (*"On This Day"*), calculates streak dynamics, maps language evolution over time, and unlocks automated achievement trophies based on your real coding habits.

---

## 🌟 Key Features

- 🕰️ **On This Day Memories:** Rediscover code you wrote 1, 2, 3, 5, or 10+ years ago today.
- 📂 **Multi-Directory Git Scanner:** Recursively indexes local project folders while skipping build artifacts (`node_modules`, `dist`, `.cache`, `vendor`).
- 📊 **Comprehensive Analytics:** Computes total lines added/removed, active/longest streaks, most productive days, and night-owl coding percentages.
- 🏆 **Automated Achievements:** Unlocks local trophies like *First Commit*, *Night Owl*, *Refactor Master*, and *Polyglot*.
- 🔍 **Instant Search & Diff Viewer:** Full text search across all indexed commits with colorized line additions and deletions.
- 🌌 **3D Ambient Experience:** Glassmorphic dark UI featuring a subtle 60 FPS React Three Fiber Git constellation particle background.
- 💻 **Standalone CLI:** Zero-dependency terminal application (`deadcode scan`, `deadcode today`, `deadcode stats`, `deadcode doctor`).
- 📤 **Multi-Format Export:** One-click exporter to Markdown (perfect for GitHub Profile READMEs), HTML, JSON, and CSV.

---

## 🚀 Quick Start

### Prerequisites
- [Python 3.8+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/) (for running the React Web UI)
- [Git](https://git-scm.com/) installed locally

---

### 💻 1. Running via CLI (Command Line)

You can run the DeadCode engine instantly without starting any web server!

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/deadcode.git
cd deadcode

# Scan your local projects directory
python backend/cli.py scan "C:\Users\YourName\Documents\Projects"

# View historic "On This Day" commits
python backend/cli.py today

# View overall developer statistics
python backend/cli.py stats

# Run system health check
python backend/cli.py doctor
```

---

### 🌐 2. Running the Glassmorphic Web App

To launch the full visual dashboard:

#### **Step A: Start Backend Server**
```bash
python backend/app/main.py
```
*(Runs backend HTTP server on `http://127.0.0.1:8000`)*

#### **Step B: Start Web UI**
In a new terminal tab/window:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser!

---

## 🖥️ Web Interface Overview

| View | Description |
| :--- | :--- |
| **Command Center (Dashboard)** | Overview of total repos, commits, streak counters, and primary language breakdown. |
| **On This Day** | Time machine cards displaying past year commits with quick diff expanders. |
| **Repository Explorer** | Grid/list explorer for all indexed projects with folder scanner trigger & pin toggle. |
| **Visual Timeline** | Recharts 30-day activity graph and streak counters. |
| **Language Evolution** | Tech stack evolution and repository language distribution bars. |
| **Developer Journey** | Historic timeline of key milestones (First Repo, Century Commit, Refactor Titan). |
| **Trophies & Badges** | Grid of unlocked automated coding achievements. |
| **Instant Search** | Fast filter across commit messages, repo names, branches, and authors. |
| **Report Exporter** | Export metrics to Markdown, HTML, JSON, or CSV. |

---

## 🏗️ Architecture

```
deadcode/
├── backend/                  # Python Engine (Zero-Dependency Backend)
│   ├── app/
│   │   ├── main.py           # Standard Library HTTP API Server
│   │   ├── scanner.py        # Subprocess-based Recursive Git Indexer
│   │   ├── analytics.py      # Streak & Metric Calculation Engine
│   │   ├── achievements.py   # Automated Badge Unlocker
│   │   ├── db.py             # SQLite Schema (~/.deadcode/deadcode.db)
│   │   └── export.py         # Multi-format Exporter
│   └── cli.py                # Standalone Terminal Interface
│
└── frontend/                 # React Web App
    ├── src/
    │   ├── components/       # Glassmorphic UI, Diff Viewer & R3F 3D Canvas
    │   ├── pages/            # 10 Responsive Dashboard & Feature Views
    │   ├── api/              # TanStack Query Hooks & Client
    │   └── types/            # TypeScript Type Definitions
    ├── package.json
    └── vite.config.ts
```

---

## 🔒 Privacy & Security Guarantee

- 🟢 **100% Offline:** Zero external API calls, tracking scripts, or cloud servers.
- 🟢 **Read-Only Operations:** DeadCode only reads Git logs via `git log`. It will **never** modify, commit, push, or alter your repositories.
- 🟢 **Local Storage:** All metadata is saved locally on your machine in `~/.deadcode/deadcode.db`.

---

## 🤝 How to Contribute

Contributions are welcome! Feel free to report issues, submit feature requests, or send pull requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
