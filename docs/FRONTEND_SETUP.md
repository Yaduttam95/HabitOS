# Frontend Setup

This application is built with React, Vite, and Tailwind CSS.

## Prerequisites

*   [Node.js](https://nodejs.org/) (Version 16 or higher recommended)
*   npm (comes with Node.js)

## Installation

1.  Clone the repository or download the source code.
2.  Open your terminal/command prompt.
3.  Navigate to the project directory:
    ```bash
    cd HabitTracker
    ```
4.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Ensure you have set up the Backend first (see [Backend Setup](./BACKEND_SETUP.md)).
2.  Create a `.env` file in the root directory:
    ```bash
    cp .env.example .env
    ```
    *(If `.env.example` doesn't exist, just create a new `.env` file)*
3.  Open `.env` and paste your Google Apps Script Web App URL:
    ```env
    VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
    ```

## Running Locally

To start the development server:
```bash
npm run dev
```
Open your browser and visit `http://localhost:5173` (or the URL shown in the terminal).

## Building for Production

To create a production-ready build:
```bash
npm run build
```
The output files will be in the `dist` directory. You can deploy this folder to any static hosting provider like Netlify, Vercel, or GitHub Pages.
