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
    const leaderboardTeaser = document.getElementById('leaderboard-teaser');
    const countdownEl = document.getElementById('countdown');
    const form = document.getElementById('prediction-form');
    const successMessage = document.getElementById('success-message');
    const formError = document.getElementById('form-error');

    // State
    let matchData = null;
    let countdownInterval = null;

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

            // Check if match result already published
            if (matchData.status === 'completed') {
                closedMessage.classList.remove('hidden');
                document.querySelector('#closed-message h2').textContent = '🏁 Match Over';
                document.querySelector('#closed-message p').textContent = 'The result for this match has been published. Predictions are closed.';
                if (data.leaderboard && data.leaderboard.length > 0) {
                    renderLeaderboard(data.leaderboard);
                }
                return;
            }

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
                leaderboardTeaser.classList.remove('hidden');
            }

            // Set up stepper buttons
            initSteppers();
            initAutoWinner();
            prefillUserInfo();
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

        // Cutoff: match kickoff time (from date field) minus 30 minutes
        // date field may be 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM'
        const cutoff = new Date(matchDateIST);
        const rawDate = String(matchData.date);
        if (rawDate.includes('T') && rawDate.length > 10) {
            // Has time component — use kickoff - 30 min
            const kickoff = new Date(matchDateIST);
            return istNow >= new Date(kickoff.getTime() - 30 * 60 * 1000);
        }
        // Fallback: fixed config time
        cutoff.setHours(CONFIG.CUTOFF_HOUR_IST, CONFIG.CUTOFF_MINUTE_IST, 0, 0);
        return istNow >= cutoff;
    }

    function getCutoffTime() {
        const matchDate = new Date(matchData.date);
        const istOffset = 5.5 * 60 * 60 * 1000;
        const matchDateIST = new Date(matchDate.getTime() + (matchDate.getTimezoneOffset() * 60000) + istOffset);

        let cutoffIST;
        const rawDate = String(matchData.date);
        if (rawDate.includes('T') && rawDate.length > 10) {
            // Use kickoff time - 30 minutes
            cutoffIST = new Date(matchDateIST.getTime() - 30 * 60 * 1000);
        } else {
            // Fallback: fixed config time
            cutoffIST = new Date(matchDateIST);
            cutoffIST.setHours(CONFIG.CUTOFF_HOUR_IST, CONFIG.CUTOFF_MINUTE_IST, 0, 0);
        }

        // Convert back to local time
        const localCutoff = new Date(cutoffIST.getTime() - (new Date().getTimezoneOffset() * 60000) - istOffset);
        return localCutoff;
    }

    function startCountdown() {
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        const now = new Date();
        const cutoff = getCutoffTime();
        const diff = cutoff - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            countdownEl.textContent = '⏰ Predictions are now closed!';
            countdownEl.className = 'countdown urgent';
            form.classList.add('hidden');
            closedMessage.classList.remove('hidden');
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.textContent = `⏰ Predictions close in: ${hours}h ${minutes}m ${seconds}s`;

        if (diff < 10 * 60 * 1000) {
            countdownEl.className = 'countdown critical';
        } else if (diff < 60 * 60 * 1000) {
            countdownEl.className = 'countdown urgent';
        } else {
            countdownEl.className = 'countdown';
        }
    }

    function stepOnce(btn) {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        const display = document.getElementById(targetId + '-display');
        let val = parseInt(input.value) || 0;
        if (btn.classList.contains('stepper-plus')) {
            val = Math.min(val + 1, 20);
        } else {
            val = Math.max(val - 1, 0);
        }
        input.value = val;
        display.textContent = val;
        syncWinnerFromScores();
    }

    function initSteppers() {
        document.querySelectorAll('.stepper-btn').forEach(btn => {
            let holdTimer = null;
            let holdInterval = null;
            let suppressNextClick = false;

            // Regular click (also handles keyboard Enter/Space)
            btn.addEventListener('click', () => {
                if (suppressNextClick) { suppressNextClick = false; return; }
                stepOnce(btn);
            });

            // Long-press: fast-increment after 500ms hold
            btn.addEventListener('pointerdown', function () {
                holdTimer = setTimeout(() => {
                    holdInterval = setInterval(() => {
                        stepOnce(btn);
                        suppressNextClick = true;
                    }, 80);
                }, 500);
            });

            const cancelHold = () => {
                clearTimeout(holdTimer);
                clearInterval(holdInterval);
                holdTimer = null;
                holdInterval = null;
            };
            btn.addEventListener('pointerup', cancelHold);
            btn.addEventListener('pointerleave', cancelHold);
            btn.addEventListener('pointercancel', cancelHold);
        });
    }

    function initAutoWinner() {
        syncWinnerFromScores();
    }

    function syncWinnerFromScores() {
        const homeVal = parseInt(document.getElementById('goals-home').value) || 0;
        const awayVal = parseInt(document.getElementById('goals-away').value) || 0;
        const hint = document.getElementById('winner-hint');
        const drawRadio = document.querySelector('input[name="winner"][value="draw"]');
        const drawLabel = drawRadio ? drawRadio.closest('label') : null;

        let derivedValue;
        if (homeVal > awayVal) {
            derivedValue = document.getElementById('radio-home').value;
        } else if (awayVal > homeVal) {
            derivedValue = document.getElementById('radio-away').value;
        } else {
            derivedValue = 'draw';
        }

        // Disable/enable Draw option based on whether scores are equal
        const isUnequal = homeVal !== awayVal;
        if (drawRadio) {
            drawRadio.disabled = isUnequal;
            if (drawLabel) {
                drawLabel.style.opacity = isUnequal ? '0.35' : '';
                drawLabel.style.cursor = isUnequal ? 'not-allowed' : '';
                drawLabel.title = isUnequal ? 'Draw is only possible when scores are equal' : '';
            }
        }

        const radio = document.querySelector(`input[name="winner"][value="${derivedValue}"]`);
        if (radio) {
            radio.checked = true;
            if (hint) hint.classList.remove('hidden');
        }
    }

    function showFormError(msg) {
        if (!formError) return;
        formError.textContent = msg;
        formError.classList.remove('hidden');
        formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearFormError() {
        if (!formError) return;
        formError.textContent = '';
        formError.classList.add('hidden');
    }

    function renderMatch() {
        matchSection.classList.remove('hidden');

        const homeCode = CONFIG.COUNTRY_CODES[matchData.homeTeam] || 'un';
        const awayCode = CONFIG.COUNTRY_CODES[matchData.awayTeam] || 'un';

        // Set flags with onerror fallback
        const flagHome = document.getElementById('flag-home');
        const flagAway = document.getElementById('flag-away');
        flagHome.onerror = function () { this.style.visibility = 'hidden'; };
        flagAway.onerror = function () { this.style.visibility = 'hidden'; };
        flagHome.src = `${CONFIG.FLAG_API}${homeCode}.png`;
        flagAway.src = `${CONFIG.FLAG_API}${awayCode}.png`;

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

        clearFormError();

        if (isNaN(goalsHome) || isNaN(goalsAway)) {
            showFormError('Please enter valid goal scores.');
            return;
        }

        if (!winner) {
            showFormError('Please select who will win.');
            return;
        }

        if (!userName) {
            showFormError('Please enter your name.');
            document.getElementById('user-name').focus();
            return;
        }

        if (!/^[0-9]{10}$/.test(userPhone)) {
            showFormError('Please enter a valid 10-digit phone number.');
            document.getElementById('user-phone').focus();
            return;
        }

        // Check if already submitted (localStorage check)
        const submissionKey = `prediction_${matchId}_${userPhone}`;
        if (localStorage.getItem(submissionKey)) {
            showFormError('You have already submitted a prediction for this match.');
            return;
        }

        // Check if predictions are still open
        if (isPredictionClosed()) {
            showFormError('Sorry, predictions are now closed for this match!');
            return;
        }

        // Disable button and show spinner
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-spinner"></span><span>Submitting…</span>';

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
                // Mark as submitted and save user info for future prefill
                localStorage.setItem(submissionKey, 'true');
                localStorage.setItem('wc_user_name', userName);
                localStorage.setItem('wc_user_phone', userPhone);
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                showPredictionSummary({ goalsHome, goalsAway, winner });
                showConfetti();
                showFunMessage();
            } else {
                showFormError(result.message || 'Failed to submit prediction. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>⚡ Submit Prediction</span>';
            }
        } catch (error) {
            console.error('Submission error:', error);
            showFormError('Network error. Please check your connection and try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>⚡ Submit Prediction</span>';
        }
    });

    // Helpers
    function prefillUserInfo() {
        const savedName = localStorage.getItem('wc_user_name');
        const savedPhone = localStorage.getItem('wc_user_phone');
        if (savedName) document.getElementById('user-name').value = savedName;
        if (savedPhone) document.getElementById('user-phone').value = savedPhone;
    }

    function renderAnnouncements(items) {
        const panel = document.getElementById('announcements-list');
        if (!panel) return;

        const typeColors = {
            announce: '#60a5fa',
            fun:      '#f59e0b',
            tip:      '#34d399',
            hot:      '#f87171',
        };

        const buildItems = (list) => list.map((item) => {
            const color = typeColors[item.type] || typeColors.announce;
            return `<span class="ann-item" style="--ann-color:${color}">` +
                `<span class="ann-body">` +
                `<span class="ann-title">${escapeHtml(item.title)}</span>` +
                `<span class="ann-text">${escapeHtml(item.text)}</span>` +
                `</span>` +
                `</span>` +
                `<span class="ann-sep">◆</span>`;
        }).join('');

        // Duplicate for seamless loop
        panel.innerHTML = buildItems(items) + buildItems(items);
    }

    // ── Live news from public RSS (BBC Sport football) via CORS proxy ──────────
    async function fetchLiveNews() {
        const WC_RE = /world\s*cup|fifa|wc\s*2026|worldcup|group\s+[a-h]\b|knockout|quarter.final|semi.final/i;
        const feeds = [
            'https://feeds.bbci.co.uk/sport/football/rss.xml',
            'https://www.espn.com/espn/rss/soccer/news'
        ];
        for (const rssUrl of feeds) {
            try {
                const ctrl = new AbortController();
                const tid  = setTimeout(() => ctrl.abort(), 7000);
                const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(rssUrl);
                const res  = await fetch(proxyUrl, { signal: ctrl.signal });
                clearTimeout(tid);
                if (!res.ok) continue;
                const json = await res.json();
                const xml  = new DOMParser().parseFromString(json.contents || '', 'text/xml');
                const allItems = Array.from(xml.querySelectorAll('item'));
                const matched  = allItems.filter(el => {
                    const t = el.querySelector('title')?.textContent       || '';
                    const d = el.querySelector('description')?.textContent || '';
                    return WC_RE.test(t) || WC_RE.test(d);
                });
                // If fewer than 2 WC-specific hits, use any top football headlines
                const pool = matched.length >= 2 ? matched : allItems;
                const items = pool.slice(0, 8).map(el => ({
                    type:  'hot',
                    title: '📰 Live',
                    text:  (el.querySelector('title')?.textContent || '').replace(/<[^>]*>/g, '').trim()
                })).filter(it => it.text.length > 0);
                if (items.length) return items;
            } catch (_) { /* try next feed */ }
        }
        return null;
    }

    // Pinned item always shown first regardless of source
    const PINNED_ANNOUNCEMENT = {
        type: 'announce',
        title: '📢 Advertise Here!',
        text: 'Want your brand on this ticker? For sponsorship & ads, contact Siva or Safvan! 🤝'
    };

    // Fetch announcements from backend; fall back to live news, then CONFIG
    async function loadAndRenderAnnouncements() {
        try {
            const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=getAnnouncements`);
            const data = await res.json();
            if (data.success && data.announcements && data.announcements.length) {
                renderAnnouncements([PINNED_ANNOUNCEMENT, ...data.announcements]);
                return;
            }
        } catch (e) {
            // network error or backend not reachable — fall through
        }

        // No backend announcements → try live public news
        const liveItems = await fetchLiveNews();
        if (liveItems && liveItems.length) {
            renderAnnouncements([PINNED_ANNOUNCEMENT, ...liveItems]);
            return;
        }

        // Final fallback: static config items
        if (CONFIG.ANNOUNCEMENTS && CONFIG.ANNOUNCEMENTS.length) {
            renderAnnouncements(CONFIG.ANNOUNCEMENTS);
        }
    }

    loadAndRenderAnnouncements();

    function showPredictionSummary({ goalsHome, goalsAway, winner }) {
        const summaryEl = document.getElementById('prediction-summary');
        if (!summaryEl || !matchData) return;
        const winnerLabel = winner === 'draw' ? 'Draw 🤝'
            : winner === matchData.homeTeam ? matchData.homeTeam
            : matchData.awayTeam;
        summaryEl.innerHTML = `
            <div class="summary-score">
                ${escapeHtml(matchData.homeTeam)}
                <span>${goalsHome} – ${goalsAway}</span>
                ${escapeHtml(matchData.awayTeam)}
            </div>
            <div class="summary-winner">🏆 Your pick: <strong>${escapeHtml(winnerLabel)}</strong></div>
        `;
        summaryEl.classList.remove('hidden');
    }

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

    // Fun messages after submission
    function showFunMessage() {
        const messages = [
            "🔮 The Oracle has spoken!",
            "⚽ Bold prediction! Let's see if you're right!",
            "🧠 Big brain energy! Good luck!",
            "🎲 The football gods are watching...",
            "🦁 Brave pick! Fortune favors the bold!",
            "🚀 Prediction locked in! To the moon!",
            "🏟️ The crowd goes wild for your prediction!",
            "🎯 Aim true! Let's see how this plays out!",
            "🌟 A star predictor is born!",
            "🔥 That's a spicy prediction!"
        ];
        const funEl = document.getElementById('fun-message');
        if (funEl) {
            funEl.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
    }

    // Confetti effect
    function showConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#ffd200', '#f7971e', '#2ed573', '#ff6b6b', '#7bed9f', '#70a1ff', '#ffffff'];

        for (let i = 0; i < 150; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.2
            });
        }

        let frame = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                p.y += p.speed;
                p.x += Math.sin(p.angle) * 0.5;
                p.angle += p.spin;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            frame++;
            if (frame < 180) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        animate();
    }
})();

// ============================================
// SIDEBAR WIDGETS — Leaderboard + Upcoming
// ============================================
(async function initWidgets() {
    const tournamentId = 'worldcup-2026';
    const baseUrl = CONFIG.APPS_SCRIPT_URL;

    // Fetch leaderboard only (upcoming matches come from local CONFIG)
    const [lbRes] = await Promise.allSettled([
        fetch(`${baseUrl}?action=getLeaderboard&tournamentId=${encodeURIComponent(tournamentId)}`)
    ]);

    // ── Leaderboard widget ──
    const lbEl = document.getElementById('sidebar-lb-body');
    if (lbEl) {
        try {
            const lbData = await lbRes.value.json();
            if (lbData.success && lbData.leaderboard.length > 0) {
                lbEl.innerHTML = lbData.leaderboard.slice(0, 10).map((entry, i) => {
                    const rank = i + 1;
                    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
                    return `<div class="widget-lb-row">
                        <span class="widget-lb-rank">${medal}</span>
                        <span class="widget-lb-name">${entry.name}</span>
                        <span class="widget-lb-pts">${entry.points}pt</span>
                    </div>`;
                }).join('');
            } else {
                lbEl.innerHTML = '<p class="widget-loading">No data yet.</p>';
            }
        } catch {
            lbEl.innerHTML = '<p class="widget-loading">—</p>';
        }
    }

    // ── Upcoming matches widget — read from local CONFIG, no API call needed ──
    const upEl = document.getElementById('sidebar-upcoming-body');
    if (upEl) {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const upcoming = (CONFIG.WORLDCUP_2026_MATCHES || [])
                .filter(m => m.date >= today)
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 1);

            if (upcoming.length === 0) {
                upEl.innerHTML = '<p class="widget-loading">No upcoming matches.</p>';
            } else {
                upEl.innerHTML = upcoming.map(m => {
                    const homeCode = (CONFIG.COUNTRY_CODES[m.homeTeam] || 'un');
                    const awayCode = (CONFIG.COUNTRY_CODES[m.awayTeam] || 'un');
                    const flagUrl = code => `https://flagcdn.com/w40/${code}.png`;
                    const dateStr = new Date(m.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                    return `<div class="widget-match-item">
                        ${m.group ? `<div class="widget-match-group">Group ${m.group}</div>` : ''}
                        <div class="widget-match-teams">
                            <div class="widget-match-team">
                                <img class="widget-match-flag" src="${flagUrl(homeCode)}" alt="${m.homeTeam}" onerror="this.style.display='none'">
                                <span>${m.homeTeam}</span>
                            </div>
                            <span class="widget-match-vs">VS</span>
                            <div class="widget-match-team">
                                <img class="widget-match-flag" src="${flagUrl(awayCode)}" alt="${m.awayTeam}" onerror="this.style.display='none'">
                                <span>${m.awayTeam}</span>
                            </div>
                        </div>
                        <div class="widget-match-meta">📅 ${dateStr}${m.venue ? `<br>📍 ${m.venue.split(',')[0]}` : ''}${m.time ? `<br>🕐 ${m.time}` : ''}</div>
                    </div>`;
                }).join('');
            }
        } catch {
            upEl.innerHTML = '<p class="widget-loading">—</p>';
        }
    }
})();
