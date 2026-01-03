<div align="center">
  <img src="./public/logo.png" alt="Habit OS Logo" width="120" />
  <h1>Habit OS</h1>
  <p>
    <strong>Privacy-First • Offline-Capable • 60fps Performance</strong>
  </p>
  <p>
    <a href="#-getting-started">Getting Started</a> •
    <a href="./docs/DATA_FLOW.md">Architecture</a> •
    <a href="#-tech-stack">Tech Stack</a>
  </p>
</div>

---

## 📖 The Philosophy

**Most habit trackers hold your data hostage or charge monthly subscriptions.**
Habit OS is different. It is a professional-grade, **Offline-First** application that treats **Google Sheets** as a dedicated, private backend.

> **"Your Data, Your Database, Your Rules."**

### Why Developers Love This
*   **Zero Latency**: Optimistic UI updates mean the interface never freezes.
*   **Universal Sync**: Changes sync seamlessly across devices via Google Sheets.
*   **Total Ownership**: Your data lives in your Google Drive, not on our servers.

## ⚡️ Architecture

We employ a **Queue-Based Optimistic UI** pattern. The application maintains a local source of truth that reconciles with the backend asynchronously.

*   **Frontend**: React + Vite (Single Page Application)
*   **Backend**: Google Apps Script (Serverless)
*   **Database**: Google Sheets (Relational-like data store)

👉 **[Read the Deep Dive: Architecture & Data Flow](./docs/DATA_FLOW.md)**

## ✨ Features

### Core Habits
*   **Unlimited Tracking**: Customizable habits with rich iconography.
*   **Daily Analytics**: Completion rates, streaks, and trends.

### Lifestyle & Wellness
*   **Finance Tracking**: Log expenses, view daily summaries, and analyze monthly spending.
*   **Sleep Tracking**: Detailed sleep duration and quality logging.
*   **Digital Wellbeing**: Screen time monitoring and impact analysis.
*   **Journaling**: Markdown-supported daily reflections.

### Engineering
*   **Offline Support**: Full functionality without internet access.
*   **Sync Logic**: Atomic batch processing for battery efficiency.

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Data Store** | Google Sheets |
| **Backend** | Google Apps Script |
| **Frontend** | React, Vite, Tailwind CSS |
| **State** | React Context + LocalStorage |
| **Visualization** | Recharts |
| **Icons** | Lucide React |

## 🚀 Getting Started

Deploy your own instance in less than 10 minutes.

### 1. Backend (The Data)
Set up your Google Sheet to act as the database.
👉 **[Backend Setup Guide](./docs/BACKEND_SETUP.md)**

### 2. Frontend (The App)
Run the interface on your local machine or deploy to Vercel/Netlify.
👉 **[Frontend Setup Guide](./docs/FRONTEND_SETUP.md)**

## 📂 Project Structure

```bash
src/
├── components/   # Feature-based UI components
├── context/      # Global state management
├── services/     # API connectors & Sync logic
└── utils/        # Helper functions
```

---
<div align="center">
  Created by Yaduttam Pareek
</div>
