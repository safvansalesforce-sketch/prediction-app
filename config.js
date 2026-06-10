// ============================================
// CONFIGURATION - Update these values
// ============================================
const CONFIG = {
    // Google Apps Script Web App URL (deployed URL)
    // Replace this after deploying your Google Apps Script
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxcmni4N20zpo-Ch7tIJ1Wo8QRRNegOKdye5dRJ_VX4Ze1HlEQ-vrKtYybBDMtuT-w/exec',

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
        'USA': 'us',
        'Mexico': 'mx',
        'Canada': 'ca',
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
            text: 'യൂനാസ് ഈ ആഴ്ച 5 ദിവസവും ഓഫീസിൽ വന്നു! ചരിത്രം സൃഷ്ടിച്ചു! 🎉'
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
        // Group A
        { homeTeam: 'USA', awayTeam: 'Morocco', date: '2026-06-11', venue: 'SoFi Stadium, Los Angeles', group: 'A' },
        { homeTeam: 'Mexico', awayTeam: 'Colombia', date: '2026-06-11', venue: 'Estadio Azteca, Mexico City', group: 'A' },
        { homeTeam: 'USA', awayTeam: 'Colombia', date: '2026-06-16', venue: 'MetLife Stadium, New Jersey', group: 'A' },
        { homeTeam: 'Mexico', awayTeam: 'Morocco', date: '2026-06-16', venue: 'Estadio Azteca, Mexico City', group: 'A' },
        { homeTeam: 'Morocco', awayTeam: 'Colombia', date: '2026-06-20', venue: 'Hard Rock Stadium, Miami', group: 'A' },
        { homeTeam: 'USA', awayTeam: 'Mexico', date: '2026-06-20', venue: 'AT&T Stadium, Dallas', group: 'A' },

        // Group B
        { homeTeam: 'England', awayTeam: 'Brazil', date: '2026-06-12', venue: 'Lincoln Financial Field, Philadelphia', group: 'B' },
        { homeTeam: 'Nigeria', awayTeam: 'Ecuador', date: '2026-06-12', venue: 'BMO Stadium, Toronto', group: 'B' },
        { homeTeam: 'Brazil', awayTeam: 'Nigeria', date: '2026-06-17', venue: 'Hard Rock Stadium, Miami', group: 'B' },
        { homeTeam: 'England', awayTeam: 'Ecuador', date: '2026-06-17', venue: 'MetLife Stadium, New Jersey', group: 'B' },
        { homeTeam: 'Ecuador', awayTeam: 'Brazil', date: '2026-06-21', venue: 'SoFi Stadium, Los Angeles', group: 'B' },
        { homeTeam: 'Nigeria', awayTeam: 'England', date: '2026-06-21', venue: 'Lincoln Financial Field, Philadelphia', group: 'B' },

        // Group C
        { homeTeam: 'Argentina', awayTeam: 'Peru', date: '2026-06-12', venue: 'Hard Rock Stadium, Miami', group: 'C' },
        { homeTeam: 'Canada', awayTeam: 'Chile', date: '2026-06-12', venue: 'BMO Field, Toronto', group: 'C' },
        { homeTeam: 'Argentina', awayTeam: 'Chile', date: '2026-06-17', venue: 'AT&T Stadium, Dallas', group: 'C' },
        { homeTeam: 'Canada', awayTeam: 'Peru', date: '2026-06-17', venue: 'BC Place, Vancouver', group: 'C' },
        { homeTeam: 'Chile', awayTeam: 'Peru', date: '2026-06-21', venue: 'BMO Field, Toronto', group: 'C' },
        { homeTeam: 'Argentina', awayTeam: 'Canada', date: '2026-06-21', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'C' },

        // Group D
        { homeTeam: 'France', awayTeam: 'Saudi Arabia', date: '2026-06-13', venue: 'NRG Stadium, Houston', group: 'D' },
        { homeTeam: 'Germany', awayTeam: 'Australia', date: '2026-06-13', venue: 'Lincoln Financial Field, Philadelphia', group: 'D' },
        { homeTeam: 'France', awayTeam: 'Australia', date: '2026-06-18', venue: 'SoFi Stadium, Los Angeles', group: 'D' },
        { homeTeam: 'Germany', awayTeam: 'Saudi Arabia', date: '2026-06-18', venue: 'NRG Stadium, Houston', group: 'D' },
        { homeTeam: 'Australia', awayTeam: 'Saudi Arabia', date: '2026-06-22', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'D' },
        { homeTeam: 'France', awayTeam: 'Germany', date: '2026-06-22', venue: 'MetLife Stadium, New Jersey', group: 'D' },

        // Group E
        { homeTeam: 'Spain', awayTeam: 'Japan', date: '2026-06-13', venue: 'BC Place, Vancouver', group: 'E' },
        { homeTeam: 'Croatia', awayTeam: 'Senegal', date: '2026-06-13', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'E' },
        { homeTeam: 'Japan', awayTeam: 'Croatia', date: '2026-06-18', venue: 'Lumen Field, Seattle', group: 'E' },
        { homeTeam: 'Spain', awayTeam: 'Senegal', date: '2026-06-18', venue: 'BC Place, Vancouver', group: 'E' },
        { homeTeam: 'Senegal', awayTeam: 'Japan', date: '2026-06-22', venue: 'Lumen Field, Seattle', group: 'E' },
        { homeTeam: 'Spain', awayTeam: 'Croatia', date: '2026-06-22', venue: 'Hard Rock Stadium, Miami', group: 'E' },

        // Group F
        { homeTeam: 'Portugal', awayTeam: 'South Korea', date: '2026-06-14', venue: 'Lumen Field, Seattle', group: 'F' },
        { homeTeam: 'Netherlands', awayTeam: 'Uruguay', date: '2026-06-14', venue: 'AT&T Stadium, Dallas', group: 'F' },
        { homeTeam: 'Portugal', awayTeam: 'Uruguay', date: '2026-06-19', venue: 'Hard Rock Stadium, Miami', group: 'F' },
        { homeTeam: 'Netherlands', awayTeam: 'South Korea', date: '2026-06-19', venue: 'Lumen Field, Seattle', group: 'F' },
        { homeTeam: 'South Korea', awayTeam: 'Uruguay', date: '2026-06-23', venue: 'AT&T Stadium, Dallas', group: 'F' },
        { homeTeam: 'Portugal', awayTeam: 'Netherlands', date: '2026-06-23', venue: 'MetLife Stadium, New Jersey', group: 'F' },

        // Group G
        { homeTeam: 'Belgium', awayTeam: 'Ghana', date: '2026-06-14', venue: 'NRG Stadium, Houston', group: 'G' },
        { homeTeam: 'Italy', awayTeam: 'Panama', date: '2026-06-14', venue: 'BMO Field, Toronto', group: 'G' },
        { homeTeam: 'Belgium', awayTeam: 'Panama', date: '2026-06-19', venue: 'Mercedes-Benz Stadium, Atlanta', group: 'G' },
        { homeTeam: 'Italy', awayTeam: 'Ghana', date: '2026-06-19', venue: 'NRG Stadium, Houston', group: 'G' },
        { homeTeam: 'Ghana', awayTeam: 'Panama', date: '2026-06-23', venue: 'BMO Field, Toronto', group: 'G' },
        { homeTeam: 'Belgium', awayTeam: 'Italy', date: '2026-06-23', venue: 'Lincoln Financial Field, Philadelphia', group: 'G' },

        // Group H
        { homeTeam: 'Denmark', awayTeam: 'Tunisia', date: '2026-06-15', venue: 'Levi\'s Stadium, San Francisco', group: 'H' },
        { homeTeam: 'Switzerland', awayTeam: 'Costa Rica', date: '2026-06-15', venue: 'BC Place, Vancouver', group: 'H' },
        { homeTeam: 'Denmark', awayTeam: 'Costa Rica', date: '2026-06-20', venue: 'Levi\'s Stadium, San Francisco', group: 'H' },
        { homeTeam: 'Switzerland', awayTeam: 'Tunisia', date: '2026-06-20', venue: 'NRG Stadium, Houston', group: 'H' },
        { homeTeam: 'Tunisia', awayTeam: 'Costa Rica', date: '2026-06-24', venue: 'BC Place, Vancouver', group: 'H' },
        { homeTeam: 'Denmark', awayTeam: 'Switzerland', date: '2026-06-24', venue: 'Levi\'s Stadium, San Francisco', group: 'H' }
    ]
};
