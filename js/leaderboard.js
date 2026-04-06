// ============================================
// LEADERBOARD — Firebase real-time sync
// ============================================

let leaderboardRef = null;
let cachedPlayers = [];

function initLeaderboard(sessionId) {
  leaderboardRef = db.ref('players/' + sessionId);

  leaderboardRef.on('value', function(snapshot) {
    const data = snapshot.val();
    if (!data) {
      cachedPlayers = [];
      renderMiniLeaderboard([]);
      updateOnlineCount(0);
      return;
    }

    // Convert to sorted array, excluding host/organizer
    cachedPlayers = Object.entries(data).map(function(entry) {
      var id = entry[0];
      var p = entry[1];
      return {
        id: id,
        name: p.name || 'Anonymous',
        totalScore: p.totalScore || 0,
        currentQuestion: p.currentQuestion || 0,
        joinedAt: p.joinedAt || 0
      };
    }).filter(function(p) {
      return EXCLUDED_NAMES.indexOf(p.name) < 0;
    });

    // Sort: highest score first, then earliest joinedAt for ties
    cachedPlayers.sort(function(a, b) {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.joinedAt - b.joinedAt;
    });

    updateOnlineCount(cachedPlayers.length);
    renderMiniLeaderboard(cachedPlayers);

    // Also update full leaderboard if results screen is visible
    var resultsScreen = document.getElementById('screen-results');
    if (resultsScreen && resultsScreen.classList.contains('active')) {
      renderFullLeaderboard(cachedPlayers);
    }
  });
}

function updateOnlineCount(count) {
  var el = document.getElementById('online-count');
  if (el) el.textContent = count;
}

function renderMiniLeaderboard(players) {
  var container = document.getElementById('mini-leaderboard');
  if (!container) return;

  if (players.length === 0) {
    container.innerHTML = '<div class="lb-empty">Waiting for players...</div>';
    return;
  }

  var html = '';
  var limit = Math.min(players.length, 10);
  for (var i = 0; i < limit; i++) {
    var p = players[i];
    var isMe = (typeof state !== 'undefined' && p.id === state.playerId);
    html += '<div class="lb-row' + (isMe ? ' is-me' : '') + '">'
      + '<span class="lb-rank">' + (i + 1) + '</span>'
      + '<span class="lb-name">' + escapeHtml(p.name) + '</span>'
      + '<span class="lb-score">' + p.totalScore + '</span>'
      + '</div>';
  }
  container.innerHTML = html;
}

function renderFullLeaderboard(players) {
  var container = document.getElementById('full-leaderboard');
  if (!container) return;

  if (players.length === 0) {
    container.innerHTML = '<div class="lb-empty">No players yet</div>';
    return;
  }

  var html = '';
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    var isMe = (typeof state !== 'undefined' && p.id === state.playerId);
    html += '<div class="lb-row' + (isMe ? ' is-me' : '') + '">'
      + '<span class="lb-rank">' + (i + 1) + '</span>'
      + '<span class="lb-name">' + escapeHtml(p.name) + '</span>'
      + '<span class="lb-score">' + p.totalScore + '</span>'
      + '</div>';
  }
  container.innerHTML = html;
}

function renderPodium(players) {
  var container = document.getElementById('podium');
  if (!container) return;

  var top3 = players.slice(0, 3);
  var medals = ['🥇', '🥈', '🥉'];
  var labels = ['1st', '2nd', '3rd'];

  // Reorder for visual: [2nd, 1st, 3rd] so 1st is center & tallest
  var order = top3.length >= 2 ? [1, 0, 2] : [0];
  if (top3.length === 2) order = [1, 0];

  var html = '';
  for (var i = 0; i < order.length; i++) {
    var idx = order[i];
    if (idx >= top3.length) continue;
    var p = top3[idx];
    html += '<div class="podium-place">'
      + '<div class="podium-medal">' + medals[idx] + '</div>'
      + '<div class="podium-name">' + escapeHtml(p.name) + '</div>'
      + '<div class="podium-score">' + p.totalScore + ' pts</div>'
      + '<div class="podium-bar">' + labels[idx] + '</div>'
      + '</div>';
  }
  container.innerHTML = html;
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
