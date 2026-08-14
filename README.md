<div align="center">

<img src="docs/images/banner.jpg" alt="DeadCode Banner" width="100%" style="border-radius: 14px;" />

# 💀 DeadCode v2.0 (Cloud & Offline Edition)

### *Every commit has a ghost.*

**A privacy-first developer time machine, repository memory stream, and journey visualizer.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20or%20Cloud-10367D.svg)]()
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3%20App%20Router-74B4D9.svg)]()
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0+-EBEBEB.svg)]()
[![Python 3.10+](https://img.shields.io/badge/Python-FastAPI%20Engine-10367D.svg)]()

---

[Key Features](#-key-features) •
[Quickstart & Installation](#-quickstart--installation) •
[Web Interface](#-web-interface) •
[GitHub OAuth & Database Setup](#-github-oauth--database-setup) •
[CLI Commands](#-cli-usage) •
[Privacy Guarantee](#-privacy--security-guarantee)

</div>

---

## 📸 Interface Preview

<div align="center">

<img src="docs/images/dashboard_preview.jpg" alt="DeadCode Dashboard Preview" width="100%" style="border-radius: 14px; border: 1px solid rgba(116, 180, 217, 0.3);" />

</div>

---

## 📖 Overview

**DeadCode** is an open-source Git time machine and developer analytics platform that turns your raw commit history into an interactive memory bank.

Think of it as **Apple Journal + GitHub + Spotify Wrapped** combined into a unified, privacy-first developer console.

It automatically indexes your repositories, discovers historic commits pushed on this exact day over past years (*"On This Day"*), tracks streak dynamics, visualizes multi-year language evolution, and unlocks trophies based on your real coding habits.

---

## 🌟 Key Features

- 🕰️ **On This Day Memories:** Rediscover code you committed 1, 2, 3, 5, or 10+ years ago today with line-by-line diff inspectors.
- 📂 **Multi-Repo Explorer & Local Scanner:** Recursively indexes local repository folders or syncs with your GitHub account.
- 📊 **Contribution Heatmap Calendar:** 52-week GitHub-style activity grid generated from your real commit logs.
- 🏆 **Automated Achievements:** Unlocks trophies for milestones (*Night Owl*, *Refactor Titan*, *First Push*, *Streak Master*).
- 🔍 **Instant Commit Search:** Fast full-text search across commit messages, repositories, files, and branches.
- ⚙️ **Comprehensive User Settings:** Custom profile management, GitHub Personal Access Token (PAT) encryption, PostgreSQL connection testing, and notification controls.
- 🔐 **Dual Auth Suite:** GitHub OAuth and email credentials login with 1-Click Guest Demo mode.
- 📤 **Multi-Format Export:** Download your developer journey in **JSON**, **CSV**, or **Markdown** (ideal for GitHub Profile READMEs).
- 🌌 **3D Ambient Experience:** Sleek Royal Blue (`#10367D`), Sky Blue (`#74B4D9`), and Light Grey (`#EBEBEB`) glassmorphic console with React Three Fiber 3D particles.

---

## 📥 Quickstart & Installation

### Prerequisites
Ensure you have installed:
- **Node.js 18+** & **npm**
- **Python 3.8+** (for Python backend scanner & CLI)
- **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/farhan0haris/Deadcode.git
cd Deadcode
```

---

### Step 2: Install Dependencies & Run Web App
```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to access the dashboard!

---

### Step 3: Run Python CLI (Optional)
```bash
# Scan local repository folder
python backend/cli.py scan "C:\Users\YourName\Documents\Projects"

# Check On This Day memories
python backend/cli.py today

# View developer metrics
python backend/cli.py stats

# System doctor & health check
python backend/cli.py doctor
```

---

## 🔑 GitHub OAuth & Database Setup

DeadCode works **100% offline out-of-the-box** with local SQLite storage (`~/.deadcode/deadcode.db`). To enable real GitHub login or cloud database sync:

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Configure GitHub OAuth
1. Open [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Set **Homepage URL** to `http://localhost:3000`.
4. Set **Authorization Callback URL** to `http://localhost:3000/api/auth/callback/github`.
5. Copy your **Client ID** & **Client Secret** into `.env.local`:
```env
GITHUB_ID=your_client_id_here
GITHUB_SECRET=your_client_secret_here
NEXTAUTH_SECRET=your_32_char_secret_key_here
```

### 3. Connect PostgreSQL Database (Optional)
To use a managed cloud database (Neon, Supabase, Railway, etc.):
```env
DATABASE_URL=postgresql://user:password@ep-cold-lake-8921.neon.tech/deadcode?sslmode=require
```

---

## 🖥️ Web Navigation Overview

| View | Path | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Landing page with product highlights and quick sign-in. |
| **Command Center** | `/dashboard` | Overall statistics, repositories count, commit counter, and language donut chart. |
| **On This Day** | `/today` | Time machine memory stream with line-by-line diff inspector. |
| **Repositories** | `/repos` | Multi-repository explorer with instant filtering and public/private badges. |
| **Commit Timeline** | `/timeline` | Interactive 30-day activity intensity chart. |
| **Language Evolution** | `/languages` | Historical distribution and stack adoption bars. |
| **Heatmap Calendar** | `/heatmap` | 52-week GitHub-style commit frequency heatmap. |
| **Achievements** | `/achievements` | Automated trophies unlocked by your coding habits. |
| **Yearly Wrapped** | `/wrapped` | Interactive yearly retrospective slideshow. |
| **Instant Search** | `/search` | Full-text commit and author search. |
| **User Settings** | `/settings` | Profile editor, security credentials, database tester, and data export. |
| **Public Profile** | `/profile/[username]` | Shareable developer identity card. |
| **Auth Portal** | `/login` & `/register` | Sign In, Register, GitHub OAuth, and 1-Click Guest Demo mode. |

---

## 🔒 Privacy & Security Guarantee

- 🟢 **Zero Telemetry:** DeadCode does not track, collect, or transmit your source code.
- 🟢 **Read-Only Operations:** DeadCode only reads Git commit metadata via `git log`. It never alters, commits, pushes, or modifies your repositories.
- 🟢 **Local & Cloud Choice:** Keep your data 100% on your machine using SQLite, or connect your own private PostgreSQL instance.

---

## 📄 License

Distributed under the **MIT License**. Created by [Farhan Haris](https://github.com/farhan0haris).
