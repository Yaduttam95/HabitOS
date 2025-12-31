# Backend Setup (Google Sheets + Apps Script)

This project uses Google Sheets as a free, customizable database/backend. Follow these steps to set it up.

## 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a **Blank spreadsheet**.
2. Rename the spreadsheet to **"HabitTracker DB"** (or anything you like).
3. Create generic sheets (tabs) with the exact names below. You don't need to add headers manually if you run the setup script, but here is the structure for reference:

### Required Sheets (Tabs)
*   **`Habits`**
*   **`DailyLogs`**
*   **`Settings`**

## 2. Add the Backend Code

1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Rename the project to **"HabitTracker API"**.
3. Clear any code in the `Code.gs` file.
4. Copy the entire content of the `googleappscript.js` file located in the root of this project repository.
    *   [Click here to view googleappscript.js](../googleappscript.js)
5. Paste the code into the Apps Script editor.
6. Save the project (Cmd/Ctrl + S).

## 3. Deploy the API

1. Click the blue **Deploy** button in the top right.
2. Select **New deployment**.
3. Click the gear icon (Select type) next to "Select type" and choose **Web app**.
4. Configure the following settings **exactly**:
    *   **Description**: `v1` (or generic)
    *   **Execute as**: `Me` (your email)
    *   **Who has access**: `Anyone`
        *   *Note: This is required so your local React app can access the data without complex OAuth flow. The data is still obfuscsated by the unique URL.*
5. Click **Deploy**.
6. You may be asked to **Authorize access**. Click "Review permissions", select your account, and if you see a warning screen ("Google hasn't verified this app"), click "Advanced" > "Go to ... (unsafe)". *This is safe because it is your own code accessing your own sheet.*
7. **Copy the Web app URL** provided. It will look like `https://script.google.com/macros/s/.../exec`.

## 4. Connect to Frontend

1. Go back to your local project.
2. Create a file named `.env` in the root directory (copy `.env.example` if it exists).
3. Add your URL:
   ```bash
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

## 5. Initialize the Database

The first time you run the app (or if you manually run the `setupSheets` function in Apps Script editor), the necessary headers will be created automatically in your Sheets.
