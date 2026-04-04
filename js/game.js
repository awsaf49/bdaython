// ============================================
// GAME — State machine, timer, host mode
// Correct answers are encrypted — only the host
// password can decrypt them.
// ============================================

// ---- STATE ----
var state = {
  playerId: null,
  playerName: '',
  sessionId: SESSION_ID,
  currentQuestion: 0,
  answers: {},
  scores: {},
  totalScore: 0,
  questionStartTime: null,
  timerInterval: null,
  revealed: false,
  isHost: false
};

// ---- INIT ----
// ============================================================
// BIRTHDAY FIREWORKS — auto-launching canvas fireworks
// ============================================================
(function() {
  var canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var COLORS = ['#E8B800','#ff6b9d','#4ecdc4','#ff9f43','#c44dff','#ff6b6b','#a8edea','#ffeaa7','#fd79a8'];

  var rockets = [];
  var particles = [];

  function launchRocket() {
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    rockets.push({
      x:  canvas.width * (0.15 + Math.random() * 0.7),
      y:  canvas.height,
      tx: canvas.width * (0.15 + Math.random() * 0.7),
      ty: canvas.height * (0.08 + Math.random() * 0.38),
      color: color,
      speed: 9 + Math.random() * 7,
      trail: []
    });
  }

  function explode(x, y, color) {
    var n = 70 + Math.floor(Math.random() * 50);
    for (var i = 0; i < n; i++) {
      var angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
      var spd   = 1.5 + Math.random() * 5;
      var hue   = (Math.random() < 0.3) ? COLORS[Math.floor(Math.random() * COLORS.length)] : color;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: hue,
        life: 1,
        decay: 0.010 + Math.random() * 0.014,
        gravity: 0.055,
        size: 1.5 + Math.random() * 2.5
      });
    }
    // Sparkle ring
    for (var j = 0; j < 12; j++) {
      var a2 = (Math.PI * 2 * j) / 12;
      particles.push({ x:x, y:y, vx: Math.cos(a2)*7, vy: Math.sin(a2)*7,
        color:'#ffffff', life:1, decay:0.06, gravity:0.02, size:1.5 });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rockets
    for (var i = rockets.length - 1; i >= 0; i--) {
      var r = rockets[i];
      var dx = r.tx - r.x, dy = r.ty - r.y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < r.speed + 2) {
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      } else {
        r.x += (dx / dist) * r.speed;
        r.y += (dy / dist) * r.speed;
        // draw trail
        r.trail.push({x: r.x, y: r.y});
        if (r.trail.length > 14) r.trail.shift();
        for (var t = 0; t < r.trail.length; t++) {
          var alpha = (t / r.trail.length) * 0.7;
          ctx.beginPath();
          ctx.arc(r.trail[t].x, r.trail[t].y, 1.5, 0, Math.PI*2);
          ctx.fillStyle = r.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Particles
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x  += p.vx; p.y  += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.97; p.vy *= 0.97;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * p.life; // quadratic fade
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(tick);
  }

  tick();

  // Auto-launch every 2.8 seconds; stagger first few
  launchRocket();
  setTimeout(launchRocket, 800);
  setTimeout(launchRocket, 1600);
  setInterval(launchRocket, 2800);
})();

// ============================================================
// CLICK SPARKLES — burst of color particles on every tap/click
// ============================================================
(function() {
  var SPARK_COLORS = ['#E8B800','#ff6b9d','#4ecdc4','#ff9f43','#c44dff','#ff6b6b'];
  document.addEventListener('click', function(e) {
    for (var i = 0; i < 18; i++) {
      var el = document.createElement('div');
      el.className = 'click-spark';
      el.style.left = e.clientX + 'px';
      el.style.top  = e.clientY + 'px';
      el.style.background = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      var angle = Math.random() * Math.PI * 2;
      var dist  = 35 + Math.random() * 65;
      el.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
      el.style.setProperty('--ty', (Math.sin(angle) * dist) + 'px');
      document.body.appendChild(el);
      setTimeout(function(node) { node.remove(); }, 700, el);
    }
  });
})();

// ---- BIRTHDAY EMOJI RAIN ----
(function() {
  var emojis = ['🎈','🎉','🎊','🎂','✨','🍦','⭐','🌟','🎁','🥳'];
  var rain = document.getElementById('emoji-rain');
  if (!rain) return;
  for (var i = 0; i < 28; i++) {
    var el = document.createElement('span');
    el.className = 'emoji-float';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left            = (Math.random() * 100) + 'vw';
    el.style.fontSize        = (0.9 + Math.random() * 1.4) + 'rem';
    el.style.animationDuration  = (7 + Math.random() * 12) + 's';
    el.style.animationDelay     = '-' + (Math.random() * 15) + 's'; // stagger immediately
    rain.appendChild(el);
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  // Try to restore player session
  var saved = localStorage.getItem('bdaython_' + SESSION_ID);
  if (saved) {
    try {
      var data = JSON.parse(saved);
      state.playerId = data.playerId;
      state.playerName = data.playerName;
      state.answers = data.answers || {};

      db.ref('players/' + SESSION_ID + '/' + state.playerId).once('value', function(snap) {
        if (snap.exists()) {
          var fbData = snap.val();
          state.currentQuestion = fbData.currentQuestion || 0;
          state.totalScore = fbData.totalScore || 0;
          if (state.currentQuestion >= QUIZ_DATA.length) {
            showResults();
          } else {
            showQuestion(state.currentQuestion);
          }
        } else {
          clearSession();
          showScreen('screen-join');
        }
      });
    } catch (e) {
      clearSession();
      showScreen('screen-join');
    }
  } else {
    showScreen('screen-join');
  }

  // Start leaderboard listener
  initLeaderboard(SESSION_ID);

  // Watch for reveal toggle (host can turn on/off)
  db.ref('sessions/' + SESSION_ID + '/revealed').on('value', function(snap) {
    if (snap.val() === true) {
      state.revealed = true;
      onRevealed();
    } else {
      state.revealed = false;
      onHidden();
    }
  });

  // Event listeners
  document.getElementById('btn-join').addEventListener('click', joinGame);
  document.getElementById('player-name').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') joinGame();
  });
  document.getElementById('btn-submit').addEventListener('click', submitAnswer);
  document.getElementById('host-password').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') attemptHostLogin();
  });
});

// ---- SCREENS ----
function showScreen(screenId) {
  var screens = document.querySelectorAll('.screen');
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.remove('active');
  }
  document.getElementById(screenId).classList.add('active');
}

// ========================================
// HOST MODE — Password + Decryption
// ========================================

function openHostModal() {
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('host-password').focus();
  document.getElementById('host-error').classList.add('hidden');
}

function closeHostModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('host-password').value = '';
}

async function attemptHostLogin() {
  var password = document.getElementById('host-password').value;
  if (!password) return;

  var errorEl = document.getElementById('host-error');
  var btn = document.getElementById('btn-host-login');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Checking...';

  try {
    var ok = await verifyPassword(password);
    if (!ok) throw new Error('wrong');
    state.isHost = true;
    closeHostModal();
    activateHostMode();
  } catch (e) {
    errorEl.classList.remove('hidden');
    errorEl.textContent = 'Wrong password. Try again.';
    document.getElementById('host-password').value = '';
    document.getElementById('host-password').focus();
  }

  btn.disabled = false;
  btn.querySelector('span').textContent = 'Unlock';
}

// SHA-256 hash of host password "5233"
var HOST_PASSWORD_HASH = 'b912b4176482e0c602e840af42e2b57af77c33cde2630cdc1467c5a9665af986';

async function verifyPassword(password) {
  var encoded = new TextEncoder().encode(password);
  var hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  var hashArray = Array.from(new Uint8Array(hashBuffer));
  var hashHex = hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  return hashHex === HOST_PASSWORD_HASH;
}

// ---- HOST DASHBOARD ----
function activateHostMode() {
  showScreen('screen-host');
  watchAndScoreSubmissions();

  // Sync reveal state for host
  db.ref('sessions/' + SESSION_ID + '/revealed').on('value', function(snap) {
    state.revealed = snap.val() === true;
    if (state.revealed) markAsRevealed();
    else markAsHidden();
  });
}

function watchAndScoreSubmissions() {
  // Scoring is now instant client-side — host dashboard just watches progress
  var playersRef = db.ref('players/' + SESSION_ID);

  playersRef.on('value', function(snap) {
    var data = snap.val();
    if (!data) {
      updateHostStats(0, 0);
      renderHostLeaderboard([]);
      return;
    }

    var players = [];
    var finished = 0;

    Object.keys(data).forEach(function(id) {
      var p = data[id];
      if ((p.currentQuestion || 0) >= QUIZ_DATA.length) finished++;
      players.push({
        id: id,
        name: p.name || 'Anonymous',
        totalScore: p.totalScore || 0,
        currentQuestion: p.currentQuestion || 0,
        joinedAt: p.joinedAt || 0,
        picks: p.picks || {}
      });
    });

    players.sort(function(a, b) {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.joinedAt - b.joinedAt;
    });

    updateHostStats(players.length, finished);
    renderHostLeaderboard(players);
  });
}

function calculateScore(selected, correct, timeTaken) {
  var correctPicks = 0;
  var wrongPicks = 0;
  for (var i = 0; i < selected.length; i++) {
    if (correct.indexOf(selected[i]) >= 0) correctPicks++;
    else wrongPicks++;
  }
  var baseScore = (correctPicks * SCORING.CORRECT_PICK) + (wrongPicks * SCORING.WRONG_PICK);
  var timeBonus = Math.max(0, SCORING.TIME_BONUS_MAX - Math.floor(timeTaken * 2));
  return Math.max(0, baseScore + timeBonus);
}

function updateHostStats(total, finished) {
  document.getElementById('stat-players').textContent = total;
  document.getElementById('stat-finished').textContent = finished;
}

function renderHostLeaderboard(players) {
  var container = document.getElementById('host-leaderboard');
  if (!container) return;

  if (players.length === 0) {
    container.innerHTML = '<div class="lb-empty">Waiting for players...</div>';
    return;
  }

  var html = '';
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    var statusText = p.currentQuestion >= QUIZ_DATA.length
      ? 'Finished' : 'Q' + (p.currentQuestion + 1) + '/' + QUIZ_DATA.length;

    html += '<div class="lb-row host-lb-row" onclick="showHostPlayerDetail(\'' + p.id + '\')">'
      + '<span class="lb-rank">' + (i + 1) + '</span>'
      + '<span class="lb-name">' + escapeHtml(p.name) + '</span>'
      + '<span class="lb-status">' + statusText + '</span>'
      + '<span class="lb-score">' + p.totalScore + '</span>'
      + '</div>';
  }
  container.innerHTML = html;
}

function showHostPlayerDetail(playerId) {
  // Host can always see picks vs correct (they have the answers)
  db.ref('players/' + SESSION_ID + '/' + playerId).once('value', function(snap) {
    var p = snap.val();
    if (!p) return;

    var html = '<div class="modal-player-name">' + escapeHtml(p.name) + '</div>';

    for (var qi = 0; qi < QUIZ_DATA.length; qi++) {
      var q = QUIZ_DATA[qi];
      var qKey = 'q' + qi;
      var picks = (p.picks && p.picks[qKey]) || [];
      var correct = QUIZ_DATA[qi].correct || [];

      html += '<div class="reveal-card">'
        + '<div class="reveal-header">'
        + '<img class="reveal-img" src="' + q.image + '" alt="' + escapeHtml(q.name) + '">'
        + '<div><div class="reveal-name">' + escapeHtml(q.name) + '</div>'
        + '<div style="color:var(--text-muted);font-size:0.85rem">'
        + ((p.scores && p.scores[qKey]) || 0) + ' pts</div></div>'
        + '</div><div class="reveal-ingredients">';

      for (var j = 0; j < q.options.length; j++) {
        var opt = q.options[j];
        var isCorrect = correct.indexOf(opt) >= 0;
        var isPicked = picks.indexOf(opt) >= 0;
        var cls = isCorrect && isPicked ? 'correct-picked'
          : isCorrect && !isPicked ? 'correct-missed'
          : !isCorrect && isPicked ? 'wrong-picked'
          : 'not-picked';
        html += '<span class="reveal-chip ' + cls + '">' + escapeHtml(opt) + '</span>';
      }

      html += '</div></div>';
    }

    showDetailModal(html);
  });
}

function showDetailModal(contentHtml) {
  // Reuse the modal overlay
  var overlay = document.getElementById('modal-overlay');
  var modal = overlay.querySelector('.modal');
  var prevContent = modal.innerHTML;

  modal.innerHTML = '<button class="modal-close" onclick="closeDetailModal()">&times;</button>'
    + '<div class="modal-detail-content">' + contentHtml + '</div>';
  overlay.classList.remove('hidden');

  // Store previous content to restore later
  modal.setAttribute('data-prev', prevContent);
}

function closeDetailModal() {
  var overlay = document.getElementById('modal-overlay');
  var modal = overlay.querySelector('.modal');
  overlay.classList.add('hidden');

  // Restore original modal content
  var prev = modal.getAttribute('data-prev');
  if (prev) {
    modal.innerHTML = prev;
    modal.removeAttribute('data-prev');
  }
}

// ---- REVEAL TOGGLE ----
function revealIngredients() {
  if (state.revealed) {
    // Hide ingredients
    db.ref('sessions/' + SESSION_ID).update({ revealed: false });
    state.revealed = false;
    markAsHidden();
  } else {
    // Reveal ingredients
    if (!confirm('Reveal all correct ingredients to participants?')) return;
    db.ref('sessions/' + SESSION_ID).update({ revealed: true });
    state.revealed = true;
    markAsRevealed();
  }
}

function markAsRevealed() {
  var btn = document.getElementById('btn-reveal');
  if (btn) {
    btn.textContent = '🙈 Hide Ingredients';
    btn.classList.add('revealed');
  }
  var stat = document.getElementById('stat-revealed');
  if (stat) stat.textContent = 'Yes';
}

function markAsHidden() {
  var btn = document.getElementById('btn-reveal');
  if (btn) {
    btn.textContent = '🍦 Reveal Ingredients';
    btn.classList.remove('revealed');
  }
  var stat = document.getElementById('stat-revealed');
  if (stat) stat.textContent = 'No';
}

function confirmReset() {
  if (!confirm('Delete ALL player data and reset the game?')) return;
  if (!confirm('This cannot be undone. Are you sure?')) return;

  db.ref('players/' + SESSION_ID).remove();
  db.ref('sessions/' + SESSION_ID).remove();
}

// ========================================
// PARTICIPANT FLOW
// ========================================

function joinGame() {
  var nameInput = document.getElementById('player-name');
  var name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    nameInput.style.borderColor = 'var(--wrong)';
    setTimeout(function() { nameInput.style.borderColor = ''; }, 1000);
    return;
  }

  state.playerName = name;
  state.playerId = generateId();
  state.currentQuestion = 0;
  state.answers = {};
  state.totalScore = 0;

  db.ref('players/' + SESSION_ID + '/' + state.playerId).set({
    name: state.playerName,
    picks: {},
    times: {},
    scores: {},
    totalScore: 0,
    currentQuestion: 0,
    joinedAt: firebase.database.ServerValue.TIMESTAMP
  });

  saveSession();
  showQuestion(0);
}

function showQuestion(index) {
  if (index >= QUIZ_DATA.length) {
    showResults();
    return;
  }

  state.currentQuestion = index;
  var q = QUIZ_DATA[index];

  document.getElementById('q-num').textContent = index + 1;
  document.getElementById('ice-cream-img').src = q.image;
  document.getElementById('ice-cream-img').alt = q.name;
  document.getElementById('ice-cream-name').textContent = q.name;
  document.getElementById('ice-cream-tagline').textContent = q.tagline;

  renderOptions(q.options);

  var submitBtn = document.getElementById('btn-submit');
  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Submit Answer';

  startTimer();
  showScreen('screen-game');
}

function renderOptions(options) {
  var grid = document.getElementById('options-grid');
  grid.innerHTML = '';

  for (var i = 0; i < options.length; i++) {
    var chip = document.createElement('div');
    chip.className = 'option-chip';
    chip.setAttribute('data-option', options[i]);
    chip.innerHTML = '<span class="check-box"></span>'
      + '<span class="option-text">' + escapeHtml(options[i]) + '</span>';
    chip.addEventListener('click', function() {
      this.classList.toggle('selected');
      updateSubmitButton();
    });
    grid.appendChild(chip);
  }
}

function updateSubmitButton() {
  var selected = document.querySelectorAll('.option-chip.selected');
  document.getElementById('btn-submit').disabled = (selected.length === 0);
}

// ---- TIMER ----
function startTimer() {
  stopTimer();
  state.questionStartTime = Date.now();
  updateTimerDisplay(0);
  state.timerInterval = setInterval(function() {
    var elapsed = Math.floor((Date.now() - state.questionStartTime) / 1000);
    updateTimerDisplay(elapsed);
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerDisplay(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  document.getElementById('timer-display').textContent =
    mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// ---- SUBMIT — score calculated instantly client-side ----
function submitAnswer() {
  stopTimer();

  var q = QUIZ_DATA[state.currentQuestion];
  var selectedEls = document.querySelectorAll('.option-chip.selected');
  var selected = [];
  for (var i = 0; i < selectedEls.length; i++) {
    selected.push(selectedEls[i].getAttribute('data-option'));
  }

  var timeTaken = (Date.now() - state.questionStartTime) / 1000;
  var qKey = 'q' + state.currentQuestion;

  // Score immediately — no host needed
  var score = calculateScore(selected, q.correct, timeTaken);
  state.answers[qKey] = selected;
  state.scores = state.scores || {};
  state.scores[qKey] = score;
  state.totalScore = Object.keys(state.scores).reduce(function(sum, k) {
    return sum + state.scores[k];
  }, 0);

  var updates = {};
  updates['picks/' + qKey]   = selected;
  updates['times/' + qKey]   = Math.round(timeTaken * 10) / 10;
  updates['scores/' + qKey]  = score;
  updates['totalScore']      = state.totalScore;
  updates['currentQuestion'] = state.currentQuestion + 1;
  db.ref('players/' + SESSION_ID + '/' + state.playerId).update(updates);

  saveSession();
  showTransition();
}

// ---- TRANSITION ----
function showTransition() {
  var nextQ = state.currentQuestion + 1;
  var isLast = (nextQ >= QUIZ_DATA.length);

  document.getElementById('transition-text').textContent =
    isLast ? 'All done!' : 'Submitted!';
  document.getElementById('transition-sub').textContent =
    isLast ? 'Waiting for final results...' : 'Next scoop coming up...';

  showScreen('screen-transition');

  setTimeout(function() {
    if (isLast) {
      showFavoriteVote();
    } else {
      showQuestion(nextQ);
    }
  }, 1800);
}

// ---- FAVOURITE VOTE ----
var favoriteSelected = null;

function showFavoriteVote() {
  favoriteSelected = null;
  var grid = document.getElementById('fav-grid');
  var html = '';
  for (var i = 0; i < QUIZ_DATA.length; i++) {
    var q = QUIZ_DATA[i];
    html += '<div class="fav-card" data-index="' + i + '" onclick="selectFavorite(this,' + i + ')">'
      + '<div class="fav-img-wrap"><img src="' + q.image + '" alt="' + escapeHtml(q.name) + '" class="fav-img"></div>'
      + '<div class="fav-name">' + escapeHtml(q.name) + '</div>'
      + '</div>';
  }
  grid.innerHTML = html;
  document.getElementById('btn-vote').disabled = true;
  document.getElementById('btn-vote').querySelector('span').textContent = 'Cast My Vote!';

  showScreen('screen-favorite');
}

function selectFavorite(el, index) {
  favoriteSelected = index;
  var cards = document.querySelectorAll('.fav-card');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('selected');
  el.classList.add('selected');
  document.getElementById('btn-vote').disabled = false;
}

function submitFavorite() {
  if (favoriteSelected === null) return;
  db.ref('sessions/' + SESSION_ID + '/votes/' + state.playerId).set(favoriteSelected);
  db.ref('players/' + SESSION_ID + '/' + state.playerId + '/favorite').set(favoriteSelected);

  showResults();
}

function renderVoteTally(votes) {
  var container = document.getElementById('vote-tally');
  if (!container) return;

  var counts = [];
  for (var i = 0; i < QUIZ_DATA.length; i++) counts[i] = 0;
  var playerIds = Object.keys(votes);
  for (var j = 0; j < playerIds.length; j++) {
    var v = votes[playerIds[j]];
    if (typeof v === 'number' && counts[v] !== undefined) counts[v]++;
  }

  // Sort by votes descending
  var items = QUIZ_DATA.map(function(q, i) { return { q: q, count: counts[i] }; });
  items.sort(function(a, b) { return b.count - a.count; });

  var maxCount = items[0].count || 0;
  var maxBarPx = 150;

  // Compute actual ranks accounting for ties
  // e.g. [3,3,1] → ranks [1,1,3]  |  [3,3,3] → [1,1,1]  |  [3,2,1] → [1,2,3]
  var itemRanks = [1];
  for (var r = 1; r < items.length; r++) {
    itemRanks[r] = items[r].count === items[r - 1].count ? itemRanks[r - 1] : r + 1;
  }

  var MEDALS   = { 1: '🥇', 2: '🥈', 3: '🥉' };
  var ORDINALS  = { 1: '1st', 2: '2nd', 3: '3rd' };
  var BAR_COLORS = {
    1: 'linear-gradient(180deg, rgba(255,215,0,0.7),   rgba(255,215,0,0.25))',
    2: 'linear-gradient(180deg, rgba(192,192,192,0.65),rgba(192,192,192,0.2))',
    3: 'linear-gradient(180deg, rgba(205,127,50,0.65), rgba(205,127,50,0.2))'
  };

  // Podium order: [2nd-slot, 1st-slot, 3rd-slot] → center is tallest
  // For a 3-way tie all bars are equal height so order doesn't matter visually
  var order = [1, 0, 2];

  var html = '<div class="vote-podium">';
  for (var k = 0; k < order.length; k++) {
    var idx  = order[k];
    if (idx >= items.length) continue;
    var item = items[idx];
    var rank = itemRanks[idx];

    // Tied items share the same bar height (proportional to their equal count)
    var barPx = maxCount > 0 ? Math.max(40, Math.round((item.count / maxCount) * maxBarPx)) : 40;

    // Is this item tied with any other?
    var tied = items.some(function(other, j) { return j !== idx && other.count === item.count && item.count > 0; });

    var medal     = MEDALS[rank]   || '🏅';
    var rankLabel = tied ? 'TIE' : (ORDINALS[rank] || '-');
    var barColor  = BAR_COLORS[rank] || BAR_COLORS[3];
    var voteLabel = item.count === 1 ? '1 vote' : item.count + ' votes';

    html += '<div class="vote-pod-place">'
      + '<div class="vote-pod-medal">' + medal + '</div>'
      + '<div class="vote-pod-img-wrap"><img src="' + item.q.image + '" alt="' + escapeHtml(item.q.name) + '" class="vote-pod-img"></div>'
      + '<div class="vote-pod-name">' + escapeHtml(item.q.name) + '</div>'
      + '<div class="vote-pod-count">' + voteLabel + '</div>'
      + '<div class="vote-pod-bar' + (tied ? ' tie-bar' : '') + '" style="height:' + barPx + 'px;background:' + barColor + '">' + rankLabel + '</div>'
      + '</div>';
  }
  html += '</div>';

  container.innerHTML = html;
}

// ---- RESULTS ----
function showResults() {
  showScreen('screen-results');
  renderPodium(cachedPlayers);
  renderFullLeaderboard(cachedPlayers);

  // Live vote tally
  db.ref('sessions/' + SESSION_ID + '/votes').on('value', function(snap) {
    renderVoteTally(snap.val() || {});
  });

  if (state.revealed) {
    onRevealed();
  } else {
    document.getElementById('reveals-title').style.display = 'none';
    document.getElementById('reveals').innerHTML =
      '<div class="reveal-waiting">'
      + '<div class="reveal-waiting-icon">🔒</div>'
      + '<p>The host will reveal the secret ingredients soon...</p>'
      + '</div>';
  }

  setTimeout(launchConfetti, 600);
}

// ---- REVEAL / HIDE (for participants) ----
function onRevealed() {
  if (!document.getElementById('screen-results').classList.contains('active')) return;
  document.getElementById('reveals-title').style.display = '';
  // Build answers map from QUIZ_DATA (source of truth)
  var answers = {};
  for (var i = 0; i < QUIZ_DATA.length; i++) {
    answers['q' + i] = QUIZ_DATA[i].correct;
  }
  renderReveals(answers);
}

function onHidden() {
  if (!document.getElementById('screen-results').classList.contains('active')) return;
  document.getElementById('reveals-title').style.display = 'none';
  document.getElementById('reveals').innerHTML =
    '<div class="reveal-waiting">'
    + '<div class="reveal-waiting-icon">🔒</div>'
    + '<p>The host will reveal the secret ingredients soon...</p>'
    + '</div>';
}

function renderReveals(answers) {
  var container = document.getElementById('reveals');
  var html = '';

  for (var i = 0; i < QUIZ_DATA.length; i++) {
    var q = QUIZ_DATA[i];
    var qKey = 'q' + i;

    // Safety: ensure arrays (Firebase can return array-like objects)
    var rawCorrect = answers[qKey] || [];
    var correct = Array.isArray(rawCorrect) ? rawCorrect : Object.values(rawCorrect);

    var rawPicks = state.answers[qKey] || [];
    var myPicks = Array.isArray(rawPicks) ? rawPicks : Object.values(rawPicks);

    html += '<div class="reveal-card">'
      + '<div class="reveal-header">'
      + '<img class="reveal-img" src="' + q.image + '" alt="' + escapeHtml(q.name) + '">'
      + '<div><div class="reveal-name">' + escapeHtml(q.name) + '</div></div>'
      + '</div>'
      + '<div class="reveal-ingredients">';

    // Only show relevant chips: correct ones + wrong picks (skip wrong-and-not-picked noise)
    for (var j = 0; j < q.options.length; j++) {
      var opt = q.options[j];
      var isCorrect = correct.indexOf(opt) >= 0;
      var isPicked = myPicks.indexOf(opt) >= 0;

      if (!isCorrect && !isPicked) continue; // skip irrelevant options

      var cls = isCorrect && isPicked ? 'correct-picked'
        : isCorrect && !isPicked     ? 'correct-missed'
        : 'wrong-picked';            // !isCorrect && isPicked

      html += '<span class="reveal-chip ' + cls + '">' + escapeHtml(opt) + '</span>';
    }

    html += '</div>'
      + '<div class="reveal-legend">'
      + '<span class="legend-item">✅ Got it</span>'
      + '<span class="legend-item">🔶 Missed</span>'
      + '<span class="legend-item">❌ Wrong pick</span>'
      + '</div></div>';
  }

  container.innerHTML = html;
}

// ---- CONFETTI ----
function launchConfetti() {
  var canvas = document.getElementById('confetti-canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var pieces = [];
  var colors = ['#ff6b9d', '#4ecdc4', '#ffeaa7', '#ffd700', '#c44dff', '#ff6b6b'];

  for (var i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  var startTime = Date.now();
  var duration = 4000;

  function animate() {
    var elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var fadeStart = duration * 0.7;
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.vy += 0.05;
      if (elapsed > fadeStart) {
        p.opacity = Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart));
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ---- HELPERS ----
function generateId() {
  return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function saveSession() {
  localStorage.setItem('bdaython_' + SESSION_ID, JSON.stringify({
    playerId: state.playerId,
    playerName: state.playerName,
    answers: state.answers
  }));
}

function clearSession() {
  localStorage.removeItem('bdaython_' + SESSION_ID);
  state.playerId = null;
  state.playerName = '';
  state.currentQuestion = 0;
  state.answers = {};
  state.scores = {};
  state.totalScore = 0;
}
