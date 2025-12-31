// ============================================
// GOOGLE APPS SCRIPT - HABIT TRACKER BACKEND
// ============================================
// 
// SETUP INSTRUCTIONS:
// 1. Create Google Sheet with 3 sheets: "Habits", "DailyLogs", "Settings"
// 2. Add headers to each sheet (see below)
// 3. Go to Extensions → Apps Script
// 4. Paste this entire code
// 5. Click Deploy → New Deployment → Web app
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Copy the deployment URL
//
// SHEET HEADERS:
// Habits: id | name | createdAt | color | icon
// DailyLogs: date | completedHabits | sleep | journal | screenTime
// Settings: key | value
//
// ============================================
// Main GET handler
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch(action) {
      case 'getHabits':
        return jsonResponse(getHabits());
      case 'getLogs':
        const days = parseInt(e.parameter.days) || 90;
        return jsonResponse(getLogs(days));
      case 'getSettings':
        return jsonResponse(getSettings());
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}
// Main POST handler
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    
    switch(params.action) {
      case 'addHabit':
        return jsonResponse(addHabit(params.name, params.color, params.icon));
      case 'deleteHabit':
        return jsonResponse(deleteHabit(params.id));
      case 'updateLog':
        return jsonResponse(updateLog(params.date, params.data));
      case 'updateSetting':
        return jsonResponse(updateSetting(params.key, params.value));
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}
// ============================================
// HABITS OPERATIONS
// ============================================
function getHabits() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Habits');
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const habits = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) { // Check if id exists
      habits.push({
        id: data[i][0],
        name: data[i][1],
        createdAt: data[i][2],
        color: data[i][3] || 'indigo',
        icon: data[i][4] || '⚡️'
      });
    }
  }
  
  return { success: true, habits };
}
function addHabit(name, color = 'indigo', icon = '⚡️', id = null) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Habits');
  // Use provided ID or generate a new one
  const finalId = id || ('habit-' + new Date().getTime());
  const createdAt = new Date().toISOString();
  
  sheet.appendRow([finalId, name, createdAt, color, icon]);
  
  return { 
    success: true, 
    habit: { id: finalId, name, createdAt, color, icon }
  };
}
function deleteHabit(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Habits');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Habit deleted' };
    }
  }
  
  return { success: false, error: 'Habit not found' };
}
// ============================================
// DAILY LOGS OPERATIONS
// ============================================
function getLogs(days = 90) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DailyLogs');
  const data = sheet.getDataRange().getValues();
  
  const logs = {};
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) { // Check if date exists
      const date = new Date(data[i][0]);
      if (date >= cutoffDate) {
        const dateStr = formatDate(date);
        logs[dateStr] = {
          completedHabits: data[i][1] ? JSON.parse(data[i][1]) : [],
          sleep: data[i][2] || 0,
          journal: data[i][3] || '',
          screenTime: data[i][4] || 0
        };
      }
    }
  }
  
  return { success: true, logs };
}
function updateLog(dateStr, logData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DailyLogs');
  const data = sheet.getDataRange().getValues();
  
  // Find existing row
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (formatDate(new Date(data[i][0])) === dateStr) {
      rowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
  }
  
  const completedHabits = JSON.stringify(logData.completedHabits || []);
  const sleep = logData.sleep || 0;
  const journal = logData.journal || '';
  const screenTime = logData.screenTime || 0;
  
  if (rowIndex > 0) {
    // Update existing row
    sheet.getRange(rowIndex, 2).setValue(completedHabits);
    sheet.getRange(rowIndex, 3).setValue(sleep);
    sheet.getRange(rowIndex, 4).setValue(journal);
    sheet.getRange(rowIndex, 5).setValue(screenTime);
  } else {
    // Append new row
    sheet.appendRow([dateStr, completedHabits, sleep, journal, screenTime]);
  }
  
  return { success: true, message: 'Log updated' };
}
// ============================================
// SETTINGS OPERATIONS
// ============================================
function getSettings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  const data = sheet.getDataRange().getValues();
  
  const settings = {
    username: 'User',
    theme: 'indigo',
    mode: 'dark'
  };
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) { // Check if key exists
      settings[data[i][0]] = data[i][1];
    }
  }
  
  return { success: true, settings };
}
function updateSetting(key, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  const data = sheet.getDataRange().getValues();
  
  // Find existing row
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex > 0) {
    // Update existing row
    sheet.getRange(rowIndex, 2).setValue(value);
  } else {
    // Append new row
    sheet.appendRow([key, value]);
  }
  
  return { success: true, message: 'Setting updated' };
}
// ============================================
// HELPER FUNCTIONS
// ============================================
function jsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers - THIS IS THE FIX!
  return output;
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// Handle OPTIONS request for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}
