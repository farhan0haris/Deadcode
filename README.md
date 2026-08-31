<div align="center">

# 💀 DeadCode v3.0 (Cloud & Offline Edition)

### *Every commit has a ghost.*

**A privacy-first developer time machine, repository memory stream, AI codebase intelligence, and journey visualizer.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20or%20Cloud-10367D.svg)]()
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3%20App%20Router-74B4D9.svg)]()
[![Prisma](https://img.shields.io/badge/Prisma-5.22%20ORM-EBEBEB.svg)]()
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0+-74B4D9.svg)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20DB-10367D.svg)]()

---

[Key Features](#-key-features) •
[Quickstart & Setup](#-quickstart--installation) •
[Web Navigation](#-web-navigation-overview) •
[GitHub OAuth & Database Setup](#-github-oauth--database-setup) •
[CLI Commands](#-cli-usage) •
[Privacy Guarantee](#-privacy--security-guarantee)

</div>

---

## 📖 Overview

**DeadCode** is an open-source Git time machine, developer analytics platform, and AI codebase intelligence tool that turns your raw commit history into an interactive developer memory bank.

Think of it as **Apple Journal + GitHub + AI Code Assistant + Spotify Wrapped** combined into a unified, privacy-first developer console.

It automatically synchronizes your public and private GitHub repositories, discovers historic commits pushed on this exact day over past years (*"On This Day"*), audits codebase health for security risks, generates documentation, and unlocks trophies based on your real coding habits.

---

## 🌟 Key Features

- ⚡ **1-Click Automatic GitHub Sync:** Authenticate with GitHub OAuth and instantly synchronize all your public and private repositories without manual configuration.
- 🤖 **AI Codebase Chat (`/chat`):** Query connected repositories, explain functions, and ask questions using privacy-first AI intelligence.
- 🛡️ **AI Code Health Audit (`/audit`):** Automated static code analysis to scan repositories for security vulnerabilities, bugs, and performance bottlenecks, with 1-click GitHub Issue creation.
- 📄 **AI Documentation Generator (`/docs-gen`):** Auto-generate production-grade READMEs, API specifications, and architecture summaries.
- 🕰️ **On This Day Memories (`/today`):** Rediscover code you committed 1, 2, 3, 5, or 10+ years ago today with line-by-line diff inspectors.
- 📂 **Multi-Repo Explorer (`/repos`):** Multi-repository explorer with instant search, language filters, and public/private badges.
- 📊 **Contribution Heatmap Calendar (`/heatmap`):** 52-week GitHub-style activity grid generated from your real commit logs.
- 🏆 **Automated Achievements (`/achievements`):** Unlocks trophies for milestones (*Night Owl*, *Refactor Titan*, *First Push*, *Streak Master*).
- 🔍 **Instant Commit Search (`/search`):** Fast full-text search across commit messages, repositories, files, and branches.
- 🗄️ **PostgreSQL Database Persistence:** Managed cloud database integration using Prisma ORM with Neon PostgreSQL.
- 🌌 **Unified Responsive Console:** Sleek Royal Blue (`#10367D`), Sky Blue (`#74B4D9`), and Light Grey (`#EBEBEB`) glassmorphic console with React Three Fiber 3D ambient graphics.

---

## 📥 Quickstart & Installation

### Prerequisites
Ensure you have installed:
- **Node.js 18+** & **npm**
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

Open **[http://localhost:3000](http://localhost:3000)** in your browser to access the application!

---

## 🔑 GitHub OAuth & Environment Configuration

To enable real GitHub OAuth login and PostgreSQL database sync:

### 1. Create `.env.local` File
Create a `.env.local` file in the root directory:

```env
# Neon PostgreSQL Database URL
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-solitary-hill.aws.neon.tech/neondb?sslmode=require"

# GitHub OAuth Credentials
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"

# NextAuth Secret & Host Configuration
AUTH_SECRET="your_random_base64_secret_key"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Configure GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **OAuth Apps** → **New OAuth App**.
3. Set **Homepage URL** to `http://localhost:3000` (or your Vercel deployment URL).
4. Set **Authorization Callback URL** to `http://localhost:3000/api/auth/callback/github` (or `https://your-domain.vercel.app/api/auth/callback/github`).
5. Register application and copy your **Client ID** (`GITHUB_ID`) and **Client Secret** (`GITHUB_SECRET`).

---

## 🖥️ Web Navigation Overview

| View | Path | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Landing page with product highlights and 1-click sign-in. |
| **Command Center** | `/dashboard` | Central command center displaying live stats, connected repositories, and quick tools. |
| **AI Codebase Chat** | `/chat` | Contextual AI chat assistant for querying connected repository code. |
| **Code Health Audit** | `/audit` | Automated code vulnerability and performance audit scanner with 1-click GitHub issue creation. |
| **Documentation Gen** | `/docs-gen` | AI generator for READMEs, API specifications, and architecture docs. |
| **On This Day** | `/today` | Time machine memory stream with line-by-line diff inspector. |
| **Repositories** | `/repos` | Repository explorer with instant search and status badges. |
| **Commit Timeline** | `/timeline` | Interactive commit activity charts and metrics. |
| **Language Evolution** | `/languages` | Live distribution of programming languages across repositories. |
| **Heatmap Calendar** | `/heatmap` | 52-week GitHub-style contribution calendar. |
| **Achievements** | `/achievements` | Milestone badges and trophies unlocked by your real code. |
| **Yearly Retrospective** | `/wrapped` | Interactive yearly developer journey slideshow. |
| **Instant Search** | `/search` | Instant search across commits, repos, and code snippets. |
| **User Settings** | `/settings` | Profile management, PAT tokens, privacy controls, and data export. |
| **Public Profile** | `/profile/[username]` | Shareable developer profile card. |

---

## 🔒 Privacy & Security Guarantee

- 🟢 **Zero Telemetry:** DeadCode does not track, collect, or sell your source code.
- 🟢 **Read-Only Operations:** DeadCode only reads Git metadata to index your developer journey.
- 🟢 **Database Security:** User sessions and repository indices are secured using Prisma ORM with encrypted parameters.

---

## 📄 License

Distributed under the **MIT License**. Created by [Farhan Haris](https://github.com/farhan0haris).
