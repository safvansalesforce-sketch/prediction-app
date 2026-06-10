// ============================================
// CONFIGURATION - Update these values
// ============================================
const CONFIG = {
    // Google Apps Script Web App URL (deployed URL)
    // Replace this after deploying your Google Apps Script
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyWMYVmbffNTHpyIz-L2XD5bJcqS5dby8Er1aT7dq2G8mV3f_oarzo4ymNOlBuCJk8L/exec',

    // ── Admin Auth ─────────────────────────────────────────────
    // Password shown on the admin page login screen
    ADMIN_PASSWORD: 'admin123',   // ← change this
    // Secret token sent with every admin API request — must match ADMIN_TOKEN in Code.gs
    ADMIN_TOKEN: 'wc2026-secret-token-changeme',  // ← change this (use a long random string)

    // Fallback cutoff time — used only when match has no kickoff time set
    // When kickoff time IS set, cutoff = kickoff - 30 minutes automatically
    CUTOFF_HOUR_IST: 18,
    CUTOFF_MINUTE_IST: 0,

    // Flag API - using flagcdn.com (free, no API key needed)
    FLAG_API: 'https://flagcdn.com/w160/',

    // Country code mapping (ISO 3166-1 alpha-2 lowercase)
    COUNTRY_CODES: {
        'India': 'in',
        'Australia': 'au',
        'England': 'gb-eng',
        'Brazil': 'br',
        'Argentina': 'ar',
        'Germany': 'de',
        'France': 'fr',
        'Spain': 'es',
        'Portugal': 'pt',
        'Netherlands': 'nl',
        'Italy': 'it',
        'Belgium': 'be',
        'Croatia': 'hr',
        'Morocco': 'ma',
        'Japan': 'jp',
        'South Korea': 'kr',
        'United States': 'us',
        'Mexico': 'mx',
        'Canada': 'ca',
        'South Africa': 'za',
        'Haiti': 'ht',
        'Curaçao': 'cw',
        'Ivory Coast': 'ci',
        'Cape Verde': 'cv',
        'DR Congo': 'cd',
        'Uruguay': 'uy',
        'Colombia': 'co',
        'Chile': 'cl',
        'Peru': 'pe',
        'Ecuador': 'ec',
        'Senegal': 'sn',
        'Ghana': 'gh',
        'Nigeria': 'ng',
        'Cameroon': 'cm',
        'Egypt': 'eg',
        'Tunisia': 'tn',
        'Algeria': 'dz',
        'Saudi Arabia': 'sa',
        'Iran': 'ir',
        'Qatar': 'qa',
        'Poland': 'pl',
        'Denmark': 'dk',
        'Sweden': 'se',
        'Norway': 'no',
        'Switzerland': 'ch',
        'Austria': 'at',
        'Serbia': 'rs',
        'Wales': 'gb-wls',
        'Scotland': 'gb-sct',
        'Ireland': 'ie',
        'Costa Rica': 'cr',
        'Panama': 'pa',
        'Honduras': 'hn',
        'Jamaica': 'jm',
        'Paraguay': 'py',
        'Bolivia': 'bo',
        'Venezuela': 've',
        'China': 'cn',
        'Indonesia': 'id',
        'Thailand': 'th',
        'Vietnam': 'vn',
        'Philippines': 'ph',
        'New Zealand': 'nz',
        'Czech Republic': 'cz',
        'Romania': 'ro',
        'Greece': 'gr',
        'Turkey': 'tr',
        'Ukraine': 'ua',
        'Russia': 'ru',
        'Iceland': 'is',
        'Slovenia': 'si',
        'Slovakia': 'sk',
        'Bosnia': 'ba',
        'Albania': 'al',
        'North Macedonia': 'mk',
        'Montenegro': 'me',
        'Georgia': 'ge',
        'Israel': 'il',
        'Uzbekistan': 'uz',
        'Iraq': 'iq',
        'Jordan': 'jo',
        'Palestine': 'ps',
        'Bahrain': 'bh',
        'Oman': 'om',
        'Kuwait': 'kw',
        'UAE': 'ae',
        'Syria': 'sy',
        'Lebanon': 'lb',
        'Mali': 'ml',
        'Ivory Coast': 'ci',
        'DR Congo': 'cd',
        'South Africa': 'za',
        'Zimbabwe': 'zw',
        'Zambia': 'zm',
        'Angola': 'ao',
        'Mozambique': 'mz',
        'Tanzania': 'tz',
        'Kenya': 'ke',
        'Uganda': 'ug',
        'Ethiopia': 'et',
        'Cuba': 'cu',
        'Trinidad and Tobago': 'tt',
        'Haiti': 'ht',
        'El Salvador': 'sv',
        'Guatemala': 'gt',
        'Dominican Republic': 'do'
    },

    // Tournament definitions
    TOURNAMENTS: [
        {
            id: 'worldcup-2026',
            name: 'FIFA World Cup 2026',
            description: 'FIFA World Cup 2026 - USA, Mexico & Canada'
        }
    ],

    // Exhibition Match
    EXHIBITION_MATCHES: [
        { homeTeam: 'Argentina', awayTeam: 'Brazil', date: '2026-06-10', venue: 'Exhibition Match', group: '' }
    ],

    // =============================================
    // ANNOUNCEMENTS - Edit these freely!
    // Types: 'announce' | 'fun' | 'tip' | 'hot'
    // =============================================
    ANNOUNCEMENTS: [
        {
            type: 'announce',
            title: '📢 Advertise Here!',
            text: 'Want your brand on this ticker? For sponsorship & ads, contact Siva or Safvan! 🤝'
        },
        {
            type: 'hot',
            title: '🔥 ബ്രേക്കിംഗ് ന്യൂസ്!',
            text: 'യൂനസ് ഈ ആഴ്ച 5 ദിവസവും ഓഫീസിൽ വന്നു! ചരിത്രം സൃഷ്ടിച്ചു! 🎉'
        },
        {
            type: 'hot',
            title: '🚨 BREAKING',
            text: 'Local man predicts all 48 World Cup matches correctly using astrology. Scientists baffled. 🔮⚽'
        },
        {
            type: 'fun',
            title: '😂 Fun Fact',
            text: 'VAR was invented to make everyone angry at the same time, regardless of which team they support. 📺😡'
        }
    ],

    // FIFA World Cup 2026 Group Stage Matches
    WORLDCUP_2026_MATCHES: [
        // Group A - Mexico, South Africa, South Korea, Czech Republic
        { homeTeam: 'Mexico', awayTeam: 'South Africa', date: '2026-06-12', time: '12:30 AM IST', venue: 'Estadio Azteca, Mexico City', group: 'A' },
        { homeTeam: 'South Korea', awayTeam: 'Czech Republic', date: '2026-06-12', time: '7:30 AM IST', venue: 'Estadio Akron, Guadalajara', group: 'A' },
        { homeTeam: 'Czech Republic', awayTeam: 'South Africa', date: '2026-06-18', time: '9:30 PM IST', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'A' },
        { homeTeam: 'Mexico', awayTeam: 'South Korea', date: '2026-06-19', time: '6:30 AM IST', venue: 'Estadio Akron, Guadalajara', group: 'A' },
        { homeTeam: 'Czech Republic', awayTeam: 'Mexico', date: '2026-06-25', time: '6:30 AM IST', venue: 'Estadio Azteca, Mexico City', group: 'A' },
        { homeTeam: 'South Africa', awayTeam: 'South Korea', date: '2026-06-25', time: '6:30 AM IST', venue: 'Estadio BBVA, Monterrey', group: 'A' },

        // Group B - Canada, Bosnia and Herzegovina, Qatar, Switzerland
        { homeTeam: 'Canada', awayTeam: 'Bosnia', date: '2026-06-13', time: '12:30 AM IST', venue: 'BMO Field, Toronto', group: 'B' },
        { homeTeam: 'Qatar', awayTeam: 'Switzerland', date: '2026-06-14', time: '12:30 AM IST', venue: 'Levi\'s Stadium, Santa Clara', group: 'B' },
        { homeTeam: 'Switzerland', awayTeam: 'Bosnia', date: '2026-06-19', time: '12:30 AM IST', venue: 'SoFi Stadium, Los Angeles', group: 'B' },
        { homeTeam: 'Canada', awayTeam: 'Qatar', date: '2026-06-19', time: '3:30 AM IST', venue: 'BC Place, Vancouver', group: 'B' },
        { homeTeam: 'Switzerland', awayTeam: 'Canada', date: '2026-06-25', time: '12:30 AM IST', venue: 'BC Place, Vancouver', group: 'B' },
        { homeTeam: 'Bosnia', awayTeam: 'Qatar', date: '2026-06-25', time: '12:30 AM IST', venue: 'Lumen Field, Seattle', group: 'B' },

        // Group C - Brazil, Morocco, Haiti, Scotland
        { homeTeam: 'Brazil', awayTeam: 'Morocco', date: '2026-06-14', time: '3:30 AM IST', venue: 'MetLife Stadium, New Jersey', group: 'C' },
        { homeTeam: 'Haiti', awayTeam: 'Scotland', date: '2026-06-14', time: '6:30 AM IST', venue: 'Gillette Stadium, Boston', group: 'C' },
        { homeTeam: 'Scotland', awayTeam: 'Morocco', date: '2026-06-20', time: '3:30 AM IST', venue: 'Gillette Stadium, Boston', group: 'C' },
        { homeTeam: 'Brazil', awayTeam: 'Haiti', date: '2026-06-20', time: '6:00 AM IST', venue: 'Lincoln Financial Field, Philadelphia', group: 'C' },
        { homeTeam: 'Scotland', awayTeam: 'Brazil', date: '2026-06-25', time: '3:30 AM IST', venue: 'Hard Rock Stadium, Miami', group: 'C' },
        { homeTeam: 'Morocco', awayTeam: 'Haiti', date: '2026-06-25', time: '3:30 AM IST', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'C' },

        // Group D - United States, Paraguay, Australia, Turkey
        { homeTeam: 'United States', awayTeam: 'Paraguay', date: '2026-06-13', time: '6:30 AM IST', venue: 'SoFi Stadium, Los Angeles', group: 'D' },
        { homeTeam: 'Australia', awayTeam: 'Turkey', date: '2026-06-14', time: '9:30 AM IST', venue: 'BC Place, Vancouver', group: 'D' },
        { homeTeam: 'United States', awayTeam: 'Australia', date: '2026-06-20', time: '12:30 AM IST', venue: 'Lumen Field, Seattle', group: 'D' },
        { homeTeam: 'Turkey', awayTeam: 'Paraguay', date: '2026-06-20', time: '8:30 AM IST', venue: 'Levi\'s Stadium, Santa Clara', group: 'D' },
        { homeTeam: 'Turkey', awayTeam: 'United States', date: '2026-06-26', time: '7:30 AM IST', venue: 'SoFi Stadium, Los Angeles', group: 'D' },
        { homeTeam: 'Paraguay', awayTeam: 'Australia', date: '2026-06-26', time: '7:30 AM IST', venue: 'Levi\'s Stadium, Santa Clara', group: 'D' },

        // Group E - Germany, Curaçao, Ivory Coast, Ecuador
        { homeTeam: 'Germany', awayTeam: 'Curaçao', date: '2026-06-14', time: '10:30 PM IST', venue: 'NRG Stadium, Houston', group: 'E' },
        { homeTeam: 'Ivory Coast', awayTeam: 'Ecuador', date: '2026-06-15', time: '4:30 AM IST', venue: 'Lincoln Financial Field, Philadelphia', group: 'E' },
        { homeTeam: 'Germany', awayTeam: 'Ivory Coast', date: '2026-06-21', time: '1:30 AM IST', venue: 'BMO Field, Toronto', group: 'E' },
        { homeTeam: 'Ecuador', awayTeam: 'Curaçao', date: '2026-06-21', time: '5:30 AM IST', venue: 'Arrowhead Stadium, Kansas City', group: 'E' },
        { homeTeam: 'Curaçao', awayTeam: 'Ivory Coast', date: '2026-06-26', time: '1:30 AM IST', venue: 'Lincoln Financial Field, Philadelphia', group: 'E' },
        { homeTeam: 'Ecuador', awayTeam: 'Germany', date: '2026-06-26', time: '1:30 AM IST', venue: 'MetLife Stadium, New Jersey', group: 'E' },

        // Group F - Netherlands, Japan, Sweden, Tunisia
        { homeTeam: 'Netherlands', awayTeam: 'Japan', date: '2026-06-15', time: '1:30 AM IST', venue: 'AT&T Stadium, Dallas', group: 'F' },
        { homeTeam: 'Sweden', awayTeam: 'Tunisia', date: '2026-06-15', time: '7:30 AM IST', venue: 'Estadio BBVA, Monterrey', group: 'F' },
        { homeTeam: 'Netherlands', awayTeam: 'Sweden', date: '2026-06-20', time: '10:30 PM IST', venue: 'NRG Stadium, Houston', group: 'F' },
        { homeTeam: 'Tunisia', awayTeam: 'Japan', date: '2026-06-21', time: '9:30 AM IST', venue: 'Estadio BBVA, Monterrey', group: 'F' },
        { homeTeam: 'Japan', awayTeam: 'Sweden', date: '2026-06-26', time: '4:30 AM IST', venue: 'AT&T Stadium, Dallas', group: 'F' },
        { homeTeam: 'Tunisia', awayTeam: 'Netherlands', date: '2026-06-26', time: '4:30 AM IST', venue: 'Arrowhead Stadium, Kansas City', group: 'F' },

        // Group G - Belgium, Egypt, Iran, New Zealand
        { homeTeam: 'Belgium', awayTeam: 'Egypt', date: '2026-06-16', time: '12:30 AM IST', venue: 'Lumen Field, Seattle', group: 'G' },
        { homeTeam: 'Iran', awayTeam: 'New Zealand', date: '2026-06-16', time: '6:30 AM IST', venue: 'SoFi Stadium, Los Angeles', group: 'G' },
        { homeTeam: 'Belgium', awayTeam: 'Iran', date: '2026-06-22', time: '12:30 AM IST', venue: 'SoFi Stadium, Los Angeles', group: 'G' },
        { homeTeam: 'New Zealand', awayTeam: 'Egypt', date: '2026-06-22', time: '6:30 AM IST', venue: 'BC Place, Vancouver', group: 'G' },
        { homeTeam: 'Egypt', awayTeam: 'Iran', date: '2026-06-27', time: '8:30 AM IST', venue: 'Lumen Field, Seattle', group: 'G' },
        { homeTeam: 'New Zealand', awayTeam: 'Belgium', date: '2026-06-27', time: '8:30 AM IST', venue: 'BC Place, Vancouver', group: 'G' },

        // Group H - Spain, Cape Verde, Saudi Arabia, Uruguay
        { homeTeam: 'Spain', awayTeam: 'Cape Verde', date: '2026-06-15', time: '9:30 PM IST', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'H' },
        { homeTeam: 'Saudi Arabia', awayTeam: 'Uruguay', date: '2026-06-16', time: '3:30 AM IST', venue: 'Hard Rock Stadium, Miami', group: 'H' },
        { homeTeam: 'Spain', awayTeam: 'Saudi Arabia', date: '2026-06-21', time: '9:30 PM IST', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'H' },
        { homeTeam: 'Uruguay', awayTeam: 'Cape Verde', date: '2026-06-22', time: '3:30 AM IST', venue: 'Hard Rock Stadium, Miami', group: 'H' },
        { homeTeam: 'Cape Verde', awayTeam: 'Saudi Arabia', date: '2026-06-27', time: '5:30 AM IST', venue: 'NRG Stadium, Houston', group: 'H' },
        { homeTeam: 'Uruguay', awayTeam: 'Spain', date: '2026-06-27', time: '5:30 AM IST', venue: 'Estadio Akron, Guadalajara', group: 'H' },

        // Group I - France, Senegal, Iraq, Norway
        { homeTeam: 'France', awayTeam: 'Senegal', date: '2026-06-17', time: '12:30 AM IST', venue: 'MetLife Stadium, New Jersey', group: 'I' },
        { homeTeam: 'Iraq', awayTeam: 'Norway', date: '2026-06-17', time: '3:30 AM IST', venue: 'Gillette Stadium, Boston', group: 'I' },
        { homeTeam: 'France', awayTeam: 'Iraq', date: '2026-06-23', time: '2:30 AM IST', venue: 'Lincoln Financial Field, Philadelphia', group: 'I' },
        { homeTeam: 'Norway', awayTeam: 'Senegal', date: '2026-06-23', time: '5:30 AM IST', venue: 'MetLife Stadium, New Jersey', group: 'I' },
        { homeTeam: 'Norway', awayTeam: 'France', date: '2026-06-27', time: '12:30 AM IST', venue: 'Gillette Stadium, Boston', group: 'I' },
        { homeTeam: 'Senegal', awayTeam: 'Iraq', date: '2026-06-27', time: '12:30 AM IST', venue: 'BMO Field, Toronto', group: 'I' },

        // Group J - Argentina, Algeria, Austria, Jordan
        { homeTeam: 'Argentina', awayTeam: 'Algeria', date: '2026-06-17', time: '6:30 AM IST', venue: 'Arrowhead Stadium, Kansas City', group: 'J' },
        { homeTeam: 'Austria', awayTeam: 'Jordan', date: '2026-06-17', time: '9:30 AM IST', venue: 'Levi\'s Stadium, Santa Clara', group: 'J' },
        { homeTeam: 'Argentina', awayTeam: 'Austria', date: '2026-06-22', time: '10:30 PM IST', venue: 'AT&T Stadium, Dallas', group: 'J' },
        { homeTeam: 'Jordan', awayTeam: 'Algeria', date: '2026-06-23', time: '8:30 AM IST', venue: 'Levi\'s Stadium, Santa Clara', group: 'J' },
        { homeTeam: 'Algeria', awayTeam: 'Austria', date: '2026-06-28', time: '7:30 AM IST', venue: 'Arrowhead Stadium, Kansas City', group: 'J' },
        { homeTeam: 'Jordan', awayTeam: 'Argentina', date: '2026-06-28', time: '7:30 AM IST', venue: 'AT&T Stadium, Dallas', group: 'J' },

        // Group K - Portugal, DR Congo, Uzbekistan, Colombia
        { homeTeam: 'Portugal', awayTeam: 'DR Congo', date: '2026-06-17', time: '10:30 PM IST', venue: 'NRG Stadium, Houston', group: 'K' },
        { homeTeam: 'Uzbekistan', awayTeam: 'Colombia', date: '2026-06-18', time: '7:30 AM IST', venue: 'Estadio Azteca, Mexico City', group: 'K' },
        { homeTeam: 'Portugal', awayTeam: 'Uzbekistan', date: '2026-06-23', time: '10:30 PM IST', venue: 'NRG Stadium, Houston', group: 'K' },
        { homeTeam: 'Colombia', awayTeam: 'DR Congo', date: '2026-06-24', time: '7:30 AM IST', venue: 'Estadio Akron, Guadalajara', group: 'K' },
        { homeTeam: 'Colombia', awayTeam: 'Portugal', date: '2026-06-28', time: '5:00 AM IST', venue: 'Hard Rock Stadium, Miami', group: 'K' },
        { homeTeam: 'DR Congo', awayTeam: 'Uzbekistan', date: '2026-06-28', time: '5:00 AM IST', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'K' },

        // Group L - England, Croatia, Ghana, Panama
        { homeTeam: 'England', awayTeam: 'Croatia', date: '2026-06-18', time: '1:30 AM IST', venue: 'AT&T Stadium, Dallas', group: 'L' },
        { homeTeam: 'Ghana', awayTeam: 'Panama', date: '2026-06-18', time: '4:30 AM IST', venue: 'BMO Field, Toronto', group: 'L' },
        { homeTeam: 'England', awayTeam: 'Ghana', date: '2026-06-24', time: '1:30 AM IST', venue: 'Gillette Stadium, Boston', group: 'L' },
        { homeTeam: 'Panama', awayTeam: 'Croatia', date: '2026-06-24', time: '4:30 AM IST', venue: 'BMO Field, Toronto', group: 'L' },
        { homeTeam: 'Panama', awayTeam: 'England', date: '2026-06-28', time: '2:30 AM IST', venue: 'MetLife Stadium, New Jersey', group: 'L' },
        { homeTeam: 'Croatia', awayTeam: 'Ghana', date: '2026-06-28', time: '2:30 AM IST', venue: 'Lincoln Financial Field, Philadelphia', group: 'L' }
    ]
};
