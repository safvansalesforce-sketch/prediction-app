// ============================================================
// Google Apps Script - World Cup Prediction Backend
// Deploy this as a Web App in Google Apps Script
// ============================================================

// *** IMPORTANT: Replace with your Google Spreadsheet ID ***
// Find it in the spreadsheet URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edithttps://docs.google.com/spreadsheets/d/1KD2dUJdbz9tWXhqENHLdQCDN1hqztCOC4IwzF3HGc1A/edit?hl=id&gid=0#gid=0
const SPREADSHEET_ID = '1KD2dUJdbz9tWXhqENHLdQCDN1hqztCOC4IwzF3HGc1A';

// Sheet names
const SHEET_MATCHES = 'Matches';
const SHEET_PREDICTIONS = 'Predictions';
const SHEET_LEADERBOARD = 'Leaderboard';
const SHEET_TOURNAMENTS = 'Tournaments';

// Helper to get spreadsheet (works for both bound and standalone scripts)
function getSpreadsheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// ============================================================
// WEB APP HANDLERS
// ============================================================

function doGet(e) {
  const action = e.parameter.action;

  let result;
  switch (action) {
    case 'getMatch':
      result = getMatch(e.parameter.matchId);
      break;
    case 'listMatches':
      result = listMatches(e.parameter.tournamentId);
      break;
    case 'getLeaderboard':
      result = getLeaderboard(e.parameter.tournamentId);
      break;
    case 'getPredictions':
      result = getPredictions(e.parameter.matchId);
      break;
    case 'listTournaments':
      result = listTournaments();
      break;
    default:
      result = { success: false, message: 'Invalid action' };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  let result;
  switch (payload.action) {
    case 'createMatch':
      result = createMatch(payload);
      break;
    case 'createTournament':
      result = createTournament(payload);
      break;
    case 'createBulkMatches':
      result = createBulkMatches(payload);
      break;
    case 'submitPrediction':
      result = submitPrediction(payload);
      break;
    case 'submitResult':
      result = submitResult(payload);
      break;
    default:
      result = { success: false, message: 'Invalid action' };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// MATCH OPERATIONS
// ============================================================

function createMatch(payload) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_MATCHES);

    // Create sheet if not exists
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_MATCHES);
      sheet.appendRow(['Match ID', 'Tournament ID', 'Home Team', 'Away Team', 'Date', 'Venue', 'Group', 'Actual Home Goals', 'Actual Away Goals', 'Actual Winner', 'Status']);
    }

    // Check if match ID already exists
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.matchId) {
        return { success: false, message: 'Match ID already exists' };
      }
    }

    // Add match
    sheet.appendRow([
      payload.matchId,
      payload.tournamentId || 'default',
      payload.homeTeam,
      payload.awayTeam,
      payload.date,
      payload.venue || '',
      payload.group || '',
      '', '', '', 'open'
    ]);

    return { success: true, message: 'Match created' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ============================================================
// TOURNAMENT OPERATIONS
// ============================================================

function createTournament(payload) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_TOURNAMENTS);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_TOURNAMENTS);
      sheet.appendRow(['Tournament ID', 'Name', 'Description', 'Created At']);
    }

    // Check if tournament already exists
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.tournamentId) {
        return { success: false, message: 'Tournament ID already exists' };
      }
    }

    sheet.appendRow([
      payload.tournamentId,
      payload.name,
      payload.description || '',
      new Date().toISOString()
    ]);

    return { success: true, message: 'Tournament created' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function createBulkMatches(payload) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_MATCHES);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_MATCHES);
      sheet.appendRow(['Match ID', 'Tournament ID', 'Home Team', 'Away Team', 'Date', 'Venue', 'Group', 'Actual Home Goals', 'Actual Away Goals', 'Actual Winner', 'Status']);
    }

    const matches = payload.matches || [];
    let created = 0;
    let skipped = 0;

    const data = sheet.getDataRange().getValues();
    const existingIds = new Set(data.slice(1).map(row => row[0]));

    matches.forEach(m => {
      if (existingIds.has(m.matchId)) {
        skipped++;
        return;
      }
      sheet.appendRow([
        m.matchId,
        payload.tournamentId || 'default',
        m.homeTeam,
        m.awayTeam,
        m.date,
        m.venue || '',
        m.group || '',
        '', '', '', 'open'
      ]);
      created++;
    });

    return { success: true, message: `Created ${created} matches, skipped ${skipped} duplicates` };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function listTournaments() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_TOURNAMENTS);

    if (!sheet) {
      return { success: true, tournaments: [] };
    }

    const data = sheet.getDataRange().getValues();
    const tournaments = [];

    for (let i = 1; i < data.length; i++) {
      tournaments.push({
        tournamentId: data[i][0],
        name: data[i][1],
        description: data[i][2]
      });
    }

    return { success: true, tournaments: tournaments };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function getMatch(matchId) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_MATCHES);

    if (!sheet) {
      return { success: false, message: 'No matches found' };
    }

    const data = sheet.getDataRange().getValues();
    let match = null;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === matchId) {
        match = {
          matchId: data[i][0],
          tournamentId: data[i][1],
          homeTeam: data[i][2],
          awayTeam: data[i][3],
          date: data[i][4],
          venue: data[i][5],
          group: data[i][6],
          status: data[i][10]
        };
        break;
      }
    }

    if (!match) {
      return { success: false, message: 'Match not found' };
    }

    // Get leaderboard for this tournament
    const leaderboard = getLeaderboardData(match.tournamentId);

    return { success: true, match: match, leaderboard: leaderboard };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function listMatches(tournamentId) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_MATCHES);

    if (!sheet) {
      return { success: true, matches: [] };
    }

    const data = sheet.getDataRange().getValues();
    const matches = [];

    for (let i = 1; i < data.length; i++) {
      // Filter by tournament if specified
      if (tournamentId && data[i][1] !== tournamentId) continue;

      matches.push({
        matchId: data[i][0],
        tournamentId: data[i][1],
        homeTeam: data[i][2],
        awayTeam: data[i][3],
        date: data[i][4],
        venue: data[i][5],
        group: data[i][6],
        status: data[i][10]
      });
    }

    return { success: true, matches: matches };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ============================================================
// PREDICTION OPERATIONS
// ============================================================

function submitPrediction(payload) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_PREDICTIONS);

    // Create sheet if not exists
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_PREDICTIONS);
      sheet.appendRow(['Match ID', 'User Name', 'Phone', 'Home Team', 'Away Team', 'Predicted Home Goals', 'Predicted Away Goals', 'Predicted Winner', 'Timestamp', 'Points Awarded']);
    }

    // Check if user already predicted for this match (by phone number)
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.matchId && data[i][2] === payload.userPhone) {
        return { success: false, message: 'You have already submitted a prediction for this match.' };
      }
    }

    // Validate prediction window (9 PM IST check)
    // IST is UTC+5:30
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset + (now.getTimezoneOffset() * 60000));

    // Get match date to check cutoff and status
    const matchSheet = ss.getSheetByName(SHEET_MATCHES);
    if (matchSheet) {
      const matchData = matchSheet.getDataRange().getValues();
      for (let i = 1; i < matchData.length; i++) {
        if (matchData[i][0] === payload.matchId) {
          // Check if match result already published
          const status = matchData[i][10];
          if (status === 'completed') {
            return { success: false, message: 'This match is over. Predictions are no longer accepted.' };
          }

          const matchDate = new Date(matchData[i][4]);
          const cutoff = new Date(matchDate);
          cutoff.setHours(18, 0, 0, 0); // 6 PM IST

          // Compare IST times
          const istMatchDay = new Date(matchDate.getTime() + istOffset + (matchDate.getTimezoneOffset() * 60000));
          const istCutoff = new Date(istMatchDay);
          istCutoff.setHours(18, 0, 0, 0);

          if (istNow >= istCutoff) {
            return { success: false, message: 'Prediction window has closed (6:00 PM IST).' };
          }
          break;
        }
      }
    }

    // Save prediction
    sheet.appendRow([
      payload.matchId,
      payload.userName,
      payload.userPhone,
      payload.homeTeam,
      payload.awayTeam,
      payload.goalsHome,
      payload.goalsAway,
      payload.winner,
      payload.timestamp || new Date().toISOString(),
      '' // Points - calculated later
    ]);

    return { success: true, message: 'Prediction saved!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ============================================================
// RESULTS & LEADERBOARD
// ============================================================

function submitResult(payload) {
  try {
    const ss = getSpreadsheet();
    const matchSheet = ss.getSheetByName(SHEET_MATCHES);

    if (!matchSheet) {
      return { success: false, message: 'No matches sheet found' };
    }

    // Update match with actual result
    const data = matchSheet.getDataRange().getValues();
    let matchRow = -1;
    let tournamentId = '';

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.matchId) {
        matchRow = i + 1; // 1-indexed for sheet
        tournamentId = data[i][1];
        break;
      }
    }

    if (matchRow === -1) {
      return { success: false, message: 'Match not found' };
    }

    // Set actual results (columns H, I, J, K = 8, 9, 10, 11)
    matchSheet.getRange(matchRow, 8).setValue(payload.actualGoalsHome);
    matchSheet.getRange(matchRow, 9).setValue(payload.actualGoalsAway);
    matchSheet.getRange(matchRow, 10).setValue(payload.actualWinner);
    matchSheet.getRange(matchRow, 11).setValue('completed');

    // Calculate points for all predictions of this match
    calculatePoints(payload.matchId, payload.actualGoalsHome, payload.actualGoalsAway, payload.actualWinner);

    // Update leaderboard for this tournament
    updateLeaderboard(tournamentId);

    return { success: true, message: 'Result saved and leaderboard updated!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function calculatePoints(matchId, actualHome, actualAway, actualWinner) {
  const ss = getSpreadsheet();
  const predSheet = ss.getSheetByName(SHEET_PREDICTIONS);

  if (!predSheet) return;

  const data = predSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === matchId) {
      const predHome = parseInt(data[i][5]);
      const predAway = parseInt(data[i][6]);
      const predWinner = data[i][7];

      let points = 0;

      // Correct score: 5 points
      if (predHome === actualHome && predAway === actualAway) {
        points = 5;
      }
      // Correct winner: 3 points
      else if (predWinner === actualWinner) {
        points = 3;
      }

      // Update points column (column J = 10)
      predSheet.getRange(i + 1, 10).setValue(points);
    }
  }
}

function updateLeaderboard(tournamentId) {
  const ss = getSpreadsheet();
  const predSheet = ss.getSheetByName(SHEET_PREDICTIONS);
  const matchSheet = ss.getSheetByName(SHEET_MATCHES);

  if (!predSheet) return;

  // Get match IDs for this tournament
  let tournamentMatchIds = new Set();
  if (tournamentId && matchSheet) {
    const matchData = matchSheet.getDataRange().getValues();
    for (let i = 1; i < matchData.length; i++) {
      if (matchData[i][1] === tournamentId) {
        tournamentMatchIds.add(matchData[i][0]);
      }
    }
  }

  let lbSheet = ss.getSheetByName(SHEET_LEADERBOARD);
  if (!lbSheet) {
    lbSheet = ss.insertSheet(SHEET_LEADERBOARD);
  }

  const data = predSheet.getDataRange().getValues();
  const userStats = {};

  // Aggregate points per user (by phone number as unique ID)
  for (let i = 1; i < data.length; i++) {
    // Filter by tournament matches if tournamentId specified
    if (tournamentId && !tournamentMatchIds.has(data[i][0])) continue;

    const name = data[i][1];
    const phone = data[i][2];
    const points = parseInt(data[i][9]) || 0;

    const key = phone;
    if (!userStats[key]) {
      userStats[key] = { name: name, phone: phone, tournamentId: tournamentId || '', points: 0, exactScores: 0, correctWinners: 0 };
    }
    userStats[key].points += points;
    if (points === 5) userStats[key].exactScores++;
    else if (points >= 2) userStats[key].correctWinners++;
  }

  // Sort by points desc, then exact scores desc
  const sorted = Object.values(userStats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.exactScores - a.exactScores;
  });

  // Clear and rewrite leaderboard sheet
  lbSheet.clear();
  lbSheet.appendRow(['Rank', 'Name', 'Phone', 'Tournament ID', 'Points', 'Exact Scores', 'Correct Winners']);

  sorted.forEach((user, index) => {
    lbSheet.appendRow([index + 1, user.name, user.phone, user.tournamentId, user.points, user.exactScores, user.correctWinners]);
  });
}

function getLeaderboard(tournamentId) {
  return { success: true, leaderboard: getLeaderboardData(tournamentId) };
}

function getPredictions(matchId) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_PREDICTIONS);

    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: true, predictions: [] };
    }

    const data = sheet.getDataRange().getValues();
    const predictions = [];

    for (let i = 1; i < data.length; i++) {
      if (!matchId || data[i][0] === matchId) {
        predictions.push({
          matchId: data[i][0],
          userName: data[i][1],
          phone: data[i][2],
          homeTeam: data[i][3],
          awayTeam: data[i][4],
          predictedHomeGoals: data[i][5],
          predictedAwayGoals: data[i][6],
          predictedWinner: data[i][7],
          timestamp: data[i][8],
          pointsAwarded: data[i][9] || 0
        });
      }
    }

    return { success: true, predictions: predictions };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function getLeaderboardData(tournamentId) {
  const ss = getSpreadsheet();
  const lbSheet = ss.getSheetByName(SHEET_LEADERBOARD);

  if (!lbSheet || lbSheet.getLastRow() <= 1) {
    return [];
  }

  const data = lbSheet.getDataRange().getValues();
  const leaderboard = [];

  for (let i = 1; i < data.length; i++) {
    // Filter by tournament if specified
    if (tournamentId && data[i][3] !== tournamentId) continue;

    leaderboard.push({
      rank: data[i][0],
      name: data[i][1],
      phone: maskPhone(String(data[i][2])),
      tournamentId: data[i][3],
      points: data[i][4],
      exactScores: data[i][5],
      correctWinners: data[i][6]
    });
  }

  return leaderboard;
}

// Mask phone number for privacy: show only last 4 digits
function maskPhone(phone) {
  if (phone.length <= 4) return phone;
  return '******' + phone.slice(-4);
}

// ============================================================
// SETUP HELPER - Run this once to initialize sheets
// ============================================================

function setupSheets() {
  const ss = getSpreadsheet();

  // Tournaments sheet
  let tournSheet = ss.getSheetByName(SHEET_TOURNAMENTS);
  if (!tournSheet) {
    tournSheet = ss.insertSheet(SHEET_TOURNAMENTS);
    tournSheet.appendRow(['Tournament ID', 'Name', 'Description', 'Created At']);
    tournSheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }

  // Matches sheet
  let matchSheet = ss.getSheetByName(SHEET_MATCHES);
  if (!matchSheet) {
    matchSheet = ss.insertSheet(SHEET_MATCHES);
    matchSheet.appendRow(['Match ID', 'Tournament ID', 'Home Team', 'Away Team', 'Date', 'Venue', 'Group', 'Actual Home Goals', 'Actual Away Goals', 'Actual Winner', 'Status']);
    matchSheet.getRange(1, 1, 1, 11).setFontWeight('bold');
  }

  // Predictions sheet
  let predSheet = ss.getSheetByName(SHEET_PREDICTIONS);
  if (!predSheet) {
    predSheet = ss.insertSheet(SHEET_PREDICTIONS);
    predSheet.appendRow(['Match ID', 'User Name', 'Phone', 'Home Team', 'Away Team', 'Predicted Home Goals', 'Predicted Away Goals', 'Predicted Winner', 'Timestamp', 'Points Awarded']);
    predSheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  }

  // Leaderboard sheet
  let lbSheet = ss.getSheetByName(SHEET_LEADERBOARD);
  if (!lbSheet) {
    lbSheet = ss.insertSheet(SHEET_LEADERBOARD);
    lbSheet.appendRow(['Rank', 'Name', 'Phone', 'Points', 'Exact Scores', 'Correct Winners']);
    lbSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }

  Logger.log('All sheets created successfully!');
}
