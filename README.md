# ⚽ World Cup 2026 Prediction App

A simple web app that lets users predict World Cup match scores. Predictions are saved to Google Sheets and a live leaderboard tracks everyone's performance.

## Features

- **Unique link per match** — Share a URL for each match
- **Team flags** — Visual display of playing teams with country flags
- **Score prediction** — Users predict goals for each team + winner
- **User registration** — Name and phone number for tracking
- **9 PM IST cutoff** — Predictions auto-close at 9:00 PM IST on match day
- **Google Sheets storage** — All data stored in a Google Sheet
- **Live leaderboard** — Cumulative standings shown on prediction page

## Scoring System

| Prediction | Points |
|---|---|
| Exact score (e.g., 2-1 and result was 2-1) | 5 |
| Correct winner + correct goal difference | 3 |
| Correct winner only | 2 |

---

## Setup Instructions

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "World Cup Predictions 2026"
3. Note the spreadsheet URL (you'll need the file ID later)

### Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in `Code.gs`
3. Copy-paste the entire content of `google-apps-script/Code.gs` into the editor
4. Click **Save** (💾)

### Step 3: Initialize the Sheets

1. In the Apps Script editor, select `setupSheets` from the function dropdown (top toolbar)
2. Click **Run** (▶️)
3. Grant the required permissions when prompted
4. This creates the 3 sheets: `Matches`, `Predictions`, `Leaderboard`

### Step 4: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ and select **Web app**
3. Set:
   - **Description**: "World Cup Prediction API"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL** — you'll need this!

### Step 5: Configure the Frontend

1. Open `config.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your deployed Web App URL:

```javascript
APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
```

### Step 6: Host the Frontend

#### Option A: Local (for testing)
```bash
cd worldcup-prediction-app
python3 -m http.server 8000
# Open http://localhost:8000/admin.html
```

#### Option B: GitHub Pages (free hosting)
1. Push the project to a GitHub repository
2. Go to Settings → Pages → Deploy from main branch
3. Your app will be at `https://yourusername.github.io/repo-name/`

#### Option C: Netlify / Vercel
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant free hosting with a URL

---

## Usage

### Admin Workflow

1. Open `admin.html`
2. Select home team, away team, date, and venue
3. Click "Create Match & Generate Link"
4. Share the generated link with participants
5. After the match, enter actual results to update the leaderboard

### User Workflow

1. User opens the shared prediction link
2. Sees team flags and match details
3. Enters predicted score, winner, name, and phone
4. Submits before 9 PM IST cutoff
5. From match 2 onwards, sees the leaderboard

---

## Project Structure

```
worldcup-prediction-app/
├── index.html              # Main prediction page
├── admin.html              # Admin panel (create matches, enter results)
├── style.css               # Styling for prediction page
├── script.js               # Frontend logic
├── config.js               # Configuration (API URL, team codes)
├── google-apps-script/
│   └── Code.gs             # Google Apps Script backend
└── README.md               # This file
```

## Google Sheet Structure

### Matches Sheet
| Match ID | Home Team | Away Team | Date | Venue | Actual Home Goals | Actual Away Goals | Actual Winner | Status |
|---|---|---|---|---|---|---|---|---|

### Predictions Sheet
| Match ID | User Name | Phone | Home Team | Away Team | Predicted Home Goals | Predicted Away Goals | Predicted Winner | Timestamp | Points Awarded |
|---|---|---|---|---|---|---|---|---|---|

### Leaderboard Sheet
| Rank | Name | Phone | Points | Exact Scores | Correct Winners |
|---|---|---|---|---|---|

---

## Customization

- **Change cutoff time**: Edit `CUTOFF_HOUR_IST` in `config.js`
- **Add more teams**: Add entries to `COUNTRY_CODES` in `config.js`
- **Change scoring**: Modify `calculatePoints()` in `Code.gs`
- **Styling**: Edit `style.css` to change colors, layout, etc.

## Notes

- Phone numbers are used as unique identifiers (one prediction per phone per match)
- Phone numbers are masked in the leaderboard (shows only last 4 digits)
- The app works on mobile and desktop
- No login required — simple name + phone authentication
