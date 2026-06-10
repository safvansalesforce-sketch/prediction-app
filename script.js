// ============================================
// World Cup Prediction App - Frontend Logic
// ============================================

(function () {
    'use strict';

    // Get match ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match');

    // DOM Elements
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const matchSection = document.getElementById('match-section');
    const closedMessage = document.getElementById('closed-message');
    const leaderboardSection = document.getElementById('leaderboard-section');
    const countdownEl = document.getElementById('countdown');
    const form = document.getElementById('prediction-form');
    const successMessage = document.getElementById('success-message');

    // State
    let matchData = null;

    // Initialize
    init();

    async function init() {
        if (!matchId) {
            showError();
            return;
        }

        try {
            // Fetch match details and leaderboard
            const response = await fetch(
                `${CONFIG.APPS_SCRIPT_URL}?action=getMatch&matchId=${encodeURIComponent(matchId)}`
            );
            const data = await response.json();

            if (!data.success) {
                showError();
                return;
            }

            matchData = data.match;
            hideLoading();

            // Check if prediction window is open
            if (isPredictionClosed()) {
                closedMessage.classList.remove('hidden');
                // Still show leaderboard even if closed
                if (data.leaderboard && data.leaderboard.length > 0) {
                    renderLeaderboard(data.leaderboard);
                }
                return;
            }

            // Show match section
            renderMatch();
            startCountdown();

            // Show leaderboard if available (from match 2 onwards)
            if (data.leaderboard && data.leaderboard.length > 0) {
                renderLeaderboard(data.leaderboard);
            }
        } catch (error) {
            console.error('Error fetching match:', error);
            showError();
        }
    }

    function isPredictionClosed() {
        const now = new Date();
        // Convert to IST (UTC+5:30)
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);

        // Get match date
        const matchDate = new Date(matchData.date);
        const matchDateIST = new Date(matchDate.getTime() + (matchDate.getTimezoneOffset() * 60000) + istOffset);

        // Cutoff: 9 PM IST on match day
        const cutoff = new Date(matchDateIST);
        cutoff.setHours(CONFIG.CUTOFF_HOUR_IST, CONFIG.CUTOFF_MINUTE_IST, 0, 0);

        return istNow >= cutoff;
    }

    function getCutoffTime() {
        const matchDate = new Date(matchData.date);
        const istOffset = 5.5 * 60 * 60 * 1000;
        const matchDateIST = new Date(matchDate.getTime() + (matchDate.getTimezoneOffset() * 60000) + istOffset);

        const cutoff = new Date(matchDateIST);
        cutoff.setHours(CONFIG.CUTOFF_HOUR_IST, CONFIG.CUTOFF_MINUTE_IST, 0, 0);

        // Convert back to local time
        const localCutoff = new Date(cutoff.getTime() - (new Date().getTimezoneOffset() * 60000) - istOffset);
        return localCutoff;
    }

    function startCountdown() {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        const now = new Date();
        const cutoff = getCutoffTime();
        const diff = cutoff - now;

        if (diff <= 0) {
            countdownEl.textContent = '⏰ Predictions are now closed!';
            form.classList.add('hidden');
            closedMessage.classList.remove('hidden');
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.textContent = `⏰ Predictions close in: ${hours}h ${minutes}m ${seconds}s`;
    }

    function renderMatch() {
        matchSection.classList.remove('hidden');

        const homeCode = CONFIG.COUNTRY_CODES[matchData.homeTeam] || 'un';
        const awayCode = CONFIG.COUNTRY_CODES[matchData.awayTeam] || 'un';

        // Set flags
        document.getElementById('flag-home').src = `${CONFIG.FLAG_API}${homeCode}.png`;
        document.getElementById('flag-away').src = `${CONFIG.FLAG_API}${awayCode}.png`;

        // Set team names
        document.getElementById('team-home-name').textContent = matchData.homeTeam;
        document.getElementById('team-away-name').textContent = matchData.awayTeam;

        // Set labels
        document.getElementById('label-home').textContent = `${matchData.homeTeam} Goals`;
        document.getElementById('label-away').textContent = `${matchData.awayTeam} Goals`;

        // Set winner options with team names as values
        document.getElementById('winner-home').textContent = matchData.homeTeam;
        document.getElementById('winner-away').textContent = matchData.awayTeam;
        document.getElementById('radio-home').value = matchData.homeTeam;
        document.getElementById('radio-away').value = matchData.awayTeam;

        // Set match details
        const matchDate = new Date(matchData.date);
        document.getElementById('match-date').textContent = `📅 ${matchDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
        if (matchData.venue) {
            document.getElementById('match-venue').textContent = `📍 ${matchData.venue}`;
        }
    }

    function renderLeaderboard(leaderboard) {
        leaderboardSection.classList.remove('hidden');
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = '';

        leaderboard.forEach((entry, index) => {
            const rank = index + 1;
            const tr = document.createElement('tr');
            if (rank <= 3) tr.classList.add(`rank-${rank}`);

            const rankDisplay = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;

            tr.innerHTML = `
                <td>${rankDisplay}</td>
                <td>${escapeHtml(entry.name)}</td>
                <td>${entry.points}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Form submission
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate
        const goalsHome = parseInt(document.getElementById('goals-home').value);
        const goalsAway = parseInt(document.getElementById('goals-away').value);
        const winner = document.querySelector('input[name="winner"]:checked')?.value;
        const userName = document.getElementById('user-name').value.trim();
        const userPhone = document.getElementById('user-phone').value.trim();

        if (isNaN(goalsHome) || isNaN(goalsAway)) {
            alert('Please enter valid goal scores.');
            return;
        }

        if (!winner) {
            alert('Please select who will win.');
            return;
        }

        if (!userName) {
            alert('Please enter your name.');
            return;
        }

        if (!/^[0-9]{10}$/.test(userPhone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        // Check if predictions are still open
        if (isPredictionClosed()) {
            alert('Sorry, predictions are now closed for this match!');
            return;
        }

        // Disable button
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const payload = {
                action: 'submitPrediction',
                matchId: matchId,
                homeTeam: matchData.homeTeam,
                awayTeam: matchData.awayTeam,
                goalsHome: goalsHome,
                goalsAway: goalsAway,
                winner: winner,
                userName: userName,
                userPhone: userPhone,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                redirect: 'follow',
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
            } else {
                alert(result.message || 'Failed to submit prediction. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Prediction';
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Network error. Please check your connection and try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Prediction';
        }
    });

    // Helpers
    function hideLoading() {
        loadingEl.classList.add('hidden');
    }

    function showError() {
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
