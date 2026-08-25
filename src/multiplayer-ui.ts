/**
 * Multiplayer & Lobby UI Manager
 * Simplified, intuitive UI for Local Play, Online Rooms, Matchmaking, Bots, Leaderboard & History
 */

import { HistoryLeaderboardManager, MOCK_LEADERBOARD, PlayerProfile } from './history-leaderboard';

export interface GameModeInfo {
  id: string;
  name: string;
  badge: string;
  icon: string;
  count: string;
  desc: string;
  badgeColor: string;
}

export const GAME_MODES: Record<string, GameModeInfo> = {
  classic: {
    id: 'classic',
    name: 'Classic UNO',
    badge: '108 Cards • Standard',
    icon: '🃏',
    count: '108 Cards',
    desc: 'Traditional standard rules & pure gameplay (No special cards)',
    badgeColor: '#2ecc71'
  },
  nomercy: {
    id: 'nomercy',
    name: "Show 'Em No Mercy",
    badge: '168 Cards • Brutal',
    icon: '💥',
    count: '168 Cards',
    desc: 'Draw 10, Draw 6, Skip Everyone, 25 Mercy KO & Stacking',
    badgeColor: '#e74c3c'
  },
  flip: {
    id: 'flip',
    name: 'UNO Flip!',
    badge: '112 Cards • 2-Sided',
    icon: '🌓',
    count: '112 Cards',
    desc: 'Light & Dark sides, Draw 5, Flip mechanics',
    badgeColor: '#8e44ad'
  },
  flex: {
    id: 'flex',
    name: 'UNO Flex',
    badge: '112 Cards • Flex Rules',
    icon: '⚡',
    count: '112 Cards',
    desc: 'Dual-action flex cards & power recharge',
    badgeColor: '#f39c12'
  },
  attack: {
    id: 'attack',
    name: 'UNO Attack',
    badge: '112 Cards • Launcher',
    icon: '🚀',
    count: '112 Cards',
    desc: 'Launcher card bursts, Attack! & Hit 2',
    badgeColor: '#e67e22'
  },
  allwild: {
    id: 'allwild',
    name: 'UNO All Wild',
    badge: '112 Cards • All Wild',
    icon: '🌈',
    count: '112 Cards',
    desc: '100% Wild deck, Wild Reverse, Wild Skip Everyone, Wild Swap',
    badgeColor: '#9b59b6'
  },
  special: {
    id: 'special',
    name: 'Action Wilds',
    badge: 'Special Edition',
    icon: '✨',
    count: '112 Cards',
    desc: 'Hand swap, True Sight & Targeted Draw 2',
    badgeColor: '#3498db'
  }
};

export class MultiplayerUIManager {
  private static instance: MultiplayerUIManager;
  private rootEl: HTMLElement | null = null;
  private currentRoom: any = null;
  private currentModal: string | null = null;

  public static getInstance(): MultiplayerUIManager {
    if (!MultiplayerUIManager.instance) {
      MultiplayerUIManager.instance = new MultiplayerUIManager();
    }
    return MultiplayerUIManager.instance;
  }

  public init() {
    let layer = document.getElementById('fc-ui-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'fc-ui-layer';
      document.body.appendChild(layer);
    }
    this.rootEl = layer;
    this.renderTopBar();
  }

  public showToast(message: string, icon: string = '✨') {
    const existing = document.querySelector('.fc-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'fc-toast show';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  public renderTopBar() {
    if (!this.rootEl) return;
    const profile = HistoryLeaderboardManager.getProfile();
    const stats = HistoryLeaderboardManager.getStats();

    let topBar = document.getElementById('fc-topbar');
    if (!topBar) {
      topBar = document.createElement('div');
      topBar.id = 'fc-topbar';
      topBar.className = 'fc-topbar';
      this.rootEl.appendChild(topBar);
    }

    topBar.innerHTML = `
      <div class="fc-profile-btn" id="fc-open-profile" title="Player Profile">
        <div class="fc-avatar-badge" style="background: ${profile.avatarColor}">
          ${profile.avatarIcon}
        </div>
        <div class="fc-profile-info">
          <span class="fc-profile-name">${profile.name}</span>
          <span class="fc-profile-stats">🏆 ${stats.wins} W • 🔥 ${stats.currentStreak} Streak</span>
        </div>
      </div>

      <div class="fc-top-actions">
        <div id="fc-latency-indicator" style="display: none; align-items: center; justify-content: center; margin-right: 15px; font-size: 14px; font-weight: 500; padding: 5px 10px; background: rgba(0,0,0,0.5); border-radius: 8px; color: #2ecc71;">
          <span style="margin-right: 5px;">📶</span> <span id="fc-latency-text">-- ms</span>
        </div>
        <button class="fc-nav-btn fc-nav-btn-local" id="fc-btn-local" title="Play vs AI Bots">
          <span class="fc-nav-icon">🎮</span>
          <span class="fc-nav-label">Play Local</span>
        </button>
        <button class="fc-nav-btn fc-nav-btn-online" id="fc-btn-online" title="Online Multiplayer Rooms">
          <span class="fc-nav-icon">🌐</span>
          <span class="fc-nav-label">Online Play</span>
        </button>
        <button class="fc-nav-btn" id="fc-btn-leaderboard" title="Leaderboard & Ranks">
          <span class="fc-nav-icon">🏆</span>
          <span class="fc-nav-label">Ranks</span>
        </button>
        <button class="fc-nav-btn" id="fc-btn-history" title="Match History">
          <span class="fc-nav-icon">📜</span>
          <span class="fc-nav-label">History</span>
        </button>
      </div>
    `;

    // Attach listeners
    document.getElementById('fc-open-profile')?.addEventListener('click', () => this.openProfileModal());
    document.getElementById('fc-btn-local')?.addEventListener('click', () => this.openLocalPlayModal());
    document.getElementById('fc-btn-online')?.addEventListener('click', () => this.openOnlineHubModal());
    document.getElementById('fc-btn-leaderboard')?.addEventListener('click', () => this.openLeaderboardModal());
    document.getElementById('fc-btn-history')?.addEventListener('click', () => this.openHistoryModal());
  }

  public setTopBarVisible(visible: boolean) {
    const topBar = document.getElementById('fc-topbar');
    if (topBar) {
      topBar.style.display = visible ? 'flex' : 'none';
    }
  }

  public updateLatency(latency: number) {
    const indicator = document.getElementById('fc-latency-indicator');
    const textEl = document.getElementById('fc-latency-text');
    if (!indicator || !textEl) return;
    
    indicator.style.display = 'flex';
    textEl.innerText = `${latency} ms`;
    
    if (latency < 100) {
      indicator.style.color = '#2ecc71'; // Green
    } else if (latency < 250) {
      indicator.style.color = '#f1c40f'; // Yellow
    } else {
      indicator.style.color = '#e74c3c'; // Red
    }
  }

  public hideLatency() {
    const indicator = document.getElementById('fc-latency-indicator');
    if (indicator) indicator.style.display = 'none';
  }

  public async copyToClipboard(text: string, successMsg?: string, icon?: string): Promise<boolean> {
    let copied = false;
    try {
      if (typeof window !== 'undefined' && !document.hasFocus()) {
        window.focus();
      }
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (err) {
      console.warn('[Clipboard] Async writeText failed, attempting execCommand fallback:', err);
    }

    if (!copied) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);
        copied = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        console.warn('[Clipboard] execCommand copy failed:', fallbackErr);
      }
    }

    if (copied) {
      if (successMsg) {
        this.showToast(successMsg, icon || '📋');
      }
    } else {
      this.showToast(`Code: ${text}`, icon || '📋');
    }
    return copied;
  }

  // --- MODAL SYSTEM ---
  public openModal(htmlContent: string, modalId: string) {
    this.currentModal = modalId;
    const existing = document.getElementById('fc-modal-backdrop');
    if (existing) {
      const modal = existing.querySelector('.fc-modal');
      if (modal) {
        modal.innerHTML = htmlContent;
        existing.querySelector('.fc-modal-close')?.addEventListener('click', () => this.closeModal());
        return; // Don't recreate backdrop
      }
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'fc-modal-backdrop';
    backdrop.className = 'fc-modal-backdrop active';
    backdrop.innerHTML = `
      <div class="fc-modal">
        ${htmlContent}
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.querySelector('.fc-modal-close')?.addEventListener('click', () => this.closeModal());
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeModal();
    });
  }

  public closeModal() {
    const backdrop = document.getElementById('fc-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      setTimeout(() => {
        if (backdrop.parentElement) {
          backdrop.remove();
        }
      }, 200);
    }
    this.currentModal = null;
  }

  // --- 1. LOCAL PLAY MODAL ---
  public openLocalPlayModal(showBack: boolean = true) {
    const modesHtml = Object.values(GAME_MODES).map((m, idx) => `
      <div class="fc-mode-card ${idx === 0 ? 'active' : ''}" data-mode="${m.id}">
        <div class="fc-mode-icon" style="background: ${m.badgeColor}33; color: #fff;">
          ${m.icon}
        </div>
        <div class="fc-mode-info">
          <div class="fc-mode-title">${m.name}</div>
          <span class="fc-mode-badge-tag" style="background: ${m.badgeColor}; color: #fff;">${m.badge}</span>
          <div class="fc-mode-desc">${m.desc}</div>
        </div>
      </div>
    `).join('');

    const html = `
      <div class="fc-modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${showBack ? '<button class="fc-modal-back-btn" id="fc-local-back-btn">← Back</button>' : ''}
          <div class="fc-modal-title">🎮 Play Local / vs AI Bots</div>
        </div>
        <button class="fc-modal-close">&times;</button>
      </div>
      <div class="fc-modal-body">
        <div class="fc-form-group">
          <label class="fc-label">Number of Players</label>
          <div class="fc-segmented" id="fc-local-players">
            <button class="fc-seg-btn active" data-val="2">2 Players (1v1)</button>
            <button class="fc-seg-btn" data-val="3">3 Players</button>
            <button class="fc-seg-btn" data-val="4">4 Players</button>
          </div>
        </div>

        <div class="fc-form-group">
          <label class="fc-label">Select Game Mode</label>
          <div class="fc-mode-grid" id="fc-local-modes">
            ${modesHtml}
          </div>
        </div>

        <div class="fc-form-group">
          <label class="fc-label">Target Points</label>
          <div class="fc-segmented" id="fc-local-points">
            <button class="fc-seg-btn active" data-val="0">500 Pts (Standard)</button>
            <button class="fc-seg-btn" data-val="1">250 Pts (Medium)</button>
            <button class="fc-seg-btn" data-val="2">1 Round (Quick)</button>
          </div>
        </div>

        <div class="fc-form-group">
          <label class="fc-label">House Rules</label>
          <div class="fc-rules-grid">
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-local-rule-jumpin" checked /> Jump-In Rule</label>
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-local-rule-drawuntil" /> Draw Until Playable</label>
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-local-rule-stacking" checked /> Stacking (+2/+4)</label>
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-local-rule-swap70" checked /> 7-Swap / 0-Pass</label>
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-local-rule-mercyko" checked /> Mercy KO (25+)</label>
          </div>
        </div>

        <button class="fc-btn fc-btn-green fc-btn-full" id="fc-start-local-btn" style="margin-top: 6px;">
          🚀 Start Match Now
        </button>
      </div>
    `;

    this.openModal(html, 'local');

    if (showBack) {
      document.getElementById('fc-local-back-btn')?.addEventListener('click', () => {
        this.openPlayMenuModal();
      });
    }

    this.setupSegmented('fc-local-players');
    this.setupSegmented('fc-local-points');
    this.setupModeCards('fc-local-modes');

    document.getElementById('fc-start-local-btn')?.addEventListener('click', () => {
      const players = parseInt(document.querySelector('#fc-local-players .active')?.getAttribute('data-val') || '2');
      const selectedMode = document.querySelector('#fc-local-modes .fc-mode-card.active')?.getAttribute('data-mode') || 'classic';
      const pointIndex = parseInt(document.querySelector('#fc-local-points .active')?.getAttribute('data-val') || '0');

      const houseRules = {
        jumpIn: (document.getElementById('fc-local-rule-jumpin') as HTMLInputElement)?.checked ?? true,
        drawUntilPlayable: (document.getElementById('fc-local-rule-drawuntil') as HTMLInputElement)?.checked ?? false,
        stacking: (document.getElementById('fc-local-rule-stacking') as HTMLInputElement)?.checked ?? true,
        swap70: (document.getElementById('fc-local-rule-swap70') as HTMLInputElement)?.checked ?? true,
        mercyKO: (document.getElementById('fc-local-rule-mercyko') as HTMLInputElement)?.checked ?? true,
        challenge4: true
      };

      this.closeModal();
      this.setTopBarVisible(false);

      // Start local match
      window.socketData.online = false;
      window.socketData.host = false;
      const gData = (window as any).gameData;
      const gSettings = (window as any).gameSettings;
      const pointsList = gSettings?.points || [500, 250, 1];
      const targetPoint = pointsList[pointIndex] !== undefined ? pointsList[pointIndex] : 500;
      if (gSettings) {
        gSettings.houseRules = houseRules;
      }
      if (gData) {
        gData.players = players;
        if (!gData.fourcolors) gData.fourcolors = {};
        gData.mode = selectedMode;
        gData.fourcolors.mode = selectedMode;
        gData.fourcolors.special = selectedMode === 'special';
        gData.pointIndex = pointIndex;
        gData.fourcolors.point = targetPoint;
        gData.themeIndex = 0;
        gData.ai = true;
      }
      if (typeof (window as any).goPage === 'function') {
        (window as any).goPage('game');
      }
    });
  }

  // Helper to handle interactive mode card selection
  private setupModeCards(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cards = container.querySelectorAll('.fc-mode-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  // --- 2. PLAY MENU / ONLINE MULTIPLAYER HUB MODAL ---
  public openPlayMenuModal() {
    this.openOnlineHubModal();
  }

  public openOnlineHubModal() {
    const html = `
      <div class="fc-modal-header">
        <div class="fc-modal-title">🎮 Play Four Colors</div>
        <button class="fc-modal-close">&times;</button>
      </div>
      <div class="fc-modal-body">
        <div class="fc-hub-grid">
          <div class="fc-hub-card fc-hub-card-local" id="fc-hub-local">
            <div class="fc-hub-icon">🎮</div>
            <div class="fc-hub-info">
              <div class="fc-hub-title">Play Local (vs AI Bots)</div>
              <div class="fc-hub-desc">Instant offline match • 2-4 Players, No Mercy & Flip modes</div>
            </div>
            <button class="fc-btn fc-btn-small fc-btn-gold">Play Local</button>
          </div>

          <div class="fc-hub-card fc-hub-card-quick" id="fc-hub-quick">
            <div class="fc-hub-icon">⚡</div>
            <div class="fc-hub-info">
              <div class="fc-hub-title">Quick Online Match</div>
              <div class="fc-hub-desc">Instantly jump into an active online match</div>
            </div>
            <button class="fc-btn fc-btn-small fc-btn-green">Quick Play</button>
          </div>

          <div class="fc-hub-card" id="fc-hub-create">
            <div class="fc-hub-icon">➕</div>
            <div class="fc-hub-info">
              <div class="fc-hub-title">Create Private Room</div>
              <div class="fc-hub-desc">Choose mode (No Mercy, Flip, Flex, Attack) & get room code</div>
            </div>
            <button class="fc-btn fc-btn-small">Create Room</button>
          </div>

          <div class="fc-hub-card" id="fc-hub-join">
            <div class="fc-hub-icon">🔑</div>
            <div class="fc-hub-info">
              <div class="fc-hub-title">Join with Room Code</div>
              <div class="fc-hub-desc">Enter 6-digit room code or join waiting public lobbies</div>
            </div>
            <button class="fc-btn fc-btn-small fc-btn-blue">Join Room</button>
          </div>
        </div>
      </div>
    `;

    this.openModal(html, 'online_hub');

    document.getElementById('fc-hub-local')?.addEventListener('click', () => {
      this.openLocalPlayModal(true);
    });
    document.getElementById('fc-hub-quick')?.addEventListener('click', () => {
      this.triggerQuickMatch();
    });
    document.getElementById('fc-hub-create')?.addEventListener('click', () => {
      this.openCreateRoomModal();
    });
    document.getElementById('fc-hub-join')?.addEventListener('click', () => {
      this.openJoinRoomModal();
    });
  }

  // --- 3. CREATE ROOM MODAL ---
  public openCreateRoomModal() {
    const profile = HistoryLeaderboardManager.getProfile();
    const modesHtml = Object.values(GAME_MODES).map((m, idx) => `
      <div class="fc-mode-card ${idx === 0 ? 'active' : ''}" data-mode="${m.id}">
        <div class="fc-mode-icon" style="background: ${m.badgeColor}33; color: #fff;">
          ${m.icon}
        </div>
        <div class="fc-mode-info">
          <div class="fc-mode-title">${m.name}</div>
          <span class="fc-mode-badge-tag" style="background: ${m.badgeColor}; color: #fff;">${m.badge}</span>
          <div class="fc-mode-desc">${m.desc}</div>
        </div>
      </div>
    `).join('');

    const html = `
      <div class="fc-modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="fc-modal-back-btn" id="fc-create-back-btn">← Back</button>
          <div class="fc-modal-title">➕ Create Online Room</div>
        </div>
        <button class="fc-modal-close">&times;</button>
      </div>
      <div class="fc-modal-body">
        <div class="fc-form-group">
          <label class="fc-label">Max Players</label>
          <div class="fc-segmented" id="fc-create-players">
            <button class="fc-seg-btn" data-val="2">2 Players</button>
            <button class="fc-seg-btn" data-val="3">3 Players</button>
            <button class="fc-seg-btn active" data-val="4">4 Players</button>
          </div>
        </div>

        <div class="fc-form-group">
          <label class="fc-label">Select Game Mode</label>
          <div class="fc-mode-grid" id="fc-create-modes">
            ${modesHtml}
          </div>
        </div>

        <div class="fc-form-group">
          <label class="fc-label">Target Score</label>
          <div class="fc-segmented" id="fc-create-points">
            <button class="fc-seg-btn active" data-val="0">500 Pts</button>
            <button class="fc-seg-btn" data-val="1">250 Pts</button>
            <button class="fc-seg-btn" data-val="2">1 Round</button>
          </div>
        </div>

        <div class="fc-form-group">
          <label class="fc-label">House Rules</label>
          <div class="fc-rules-grid">
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-rule-jumpin" checked /> Jump-In Rule</label>
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-rule-drawuntil" /> Draw Until Playable</label>
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-rule-stacking" checked /> Stacking (+2/+4)</label>
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-rule-swap70" checked /> 7-Swap / 0-Pass</label>
            <label class="fc-checkbox-label"><input type="checkbox" id="fc-rule-mercyko" checked /> Mercy KO (25+)</label>
          </div>
        </div>

        <button class="fc-btn fc-btn-green fc-btn-full" id="fc-do-create-room" style="margin-top: 6px;">
          👑 Create Room & Open Lobby
        </button>
      </div>
    `;

    this.openModal(html, 'create');

    document.getElementById('fc-create-back-btn')?.addEventListener('click', () => {
      this.openPlayMenuModal();
    });

    this.setupSegmented('fc-create-players');
    this.setupSegmented('fc-create-points');
    this.setupModeCards('fc-create-modes');

    document.getElementById('fc-do-create-room')?.addEventListener('click', () => {
      const maxPlayers = parseInt(document.querySelector('#fc-create-players .active')?.getAttribute('data-val') || '4');
      const selectedMode = document.querySelector('#fc-create-modes .fc-mode-card.active')?.getAttribute('data-mode') || 'classic';
      const pointIndex = parseInt(document.querySelector('#fc-create-points .active')?.getAttribute('data-val') || '0');

      const houseRules = {
        jumpIn: (document.getElementById('fc-rule-jumpin') as HTMLInputElement)?.checked ?? true,
        drawUntilPlayable: (document.getElementById('fc-rule-drawuntil') as HTMLInputElement)?.checked ?? false,
        stacking: (document.getElementById('fc-rule-stacking') as HTMLInputElement)?.checked ?? true,
        swap70: (document.getElementById('fc-rule-swap70') as HTMLInputElement)?.checked ?? true,
        mercyKO: (document.getElementById('fc-rule-mercyko') as HTMLInputElement)?.checked ?? true,
        challenge4: true
      };

      if (window.createCustomSocketRoom) {
        window.createCustomSocketRoom({
          name: profile.name,
          maxPlayers,
          mode: selectedMode,
          special: selectedMode !== 'classic',
          pointIndex,
          houseRules
        });
      }
    });
  }

  // --- 4. JOIN ROOM MODAL ---
  public openJoinRoomModal(defaultCode: string = '') {
    const profile = HistoryLeaderboardManager.getProfile();
    const html = `
      <div class="fc-modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="fc-modal-back-btn" id="fc-join-back-btn">← Back</button>
          <div class="fc-modal-title">🔑 Join Room</div>
        </div>
        <button class="fc-modal-close">&times;</button>
      </div>
      <div class="fc-modal-body">
        <div class="fc-form-group">
          <label class="fc-label">Enter 6-Digit Room Code</label>
          <input type="text" id="fc-join-code-input" class="fc-input fc-code-input" placeholder="ABCDEF" maxlength="6" value="${defaultCode}" />
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="fc-btn fc-btn-secondary" style="flex: 1;" id="fc-paste-btn">
            📋 Paste
          </button>
          <button class="fc-btn fc-btn-green" style="flex: 2;" id="fc-do-join-room">
            🚀 Join Room
          </button>
        </div>

        <div class="fc-form-group" style="margin-top: 14px;">
          <label class="fc-label">Waiting Public Rooms</label>
          <div id="fc-public-rooms-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 160px; overflow-y: auto;">
            <div style="text-align: center; color: var(--fc-text-dim); padding: 12px; font-size: 13px;">Searching for open rooms...</div>
          </div>
        </div>
      </div>
    `;

    this.openModal(html, 'join');

    document.getElementById('fc-join-back-btn')?.addEventListener('click', () => {
      this.openPlayMenuModal();
    });

    const input = document.getElementById('fc-join-code-input') as HTMLInputElement;
    if (input) {
      input.focus();
      input.addEventListener('input', () => {
        input.value = input.value.toUpperCase();
      });
    }

    document.getElementById('fc-paste-btn')?.addEventListener('click', async () => {
      try {
        if (typeof window !== 'undefined' && !document.hasFocus()) {
          window.focus();
        }
        if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
          const text = await navigator.clipboard.readText();
          if (text && input) {
            const match = text.match(/room=([A-Za-z0-9]{6})/i) || text.match(/[A-Za-z0-9]{6}/);
            input.value = (match ? match[1] || match[0] : text).toUpperCase().substring(0, 6);
            return;
          }
        }
      } catch (e) {
        // clipboard read failed or permission denied
      }
      this.showToast('Please type or paste the code into the box', '⌨️');
    });

    document.getElementById('fc-do-join-room')?.addEventListener('click', () => {
      const code = input?.value.trim().toUpperCase();
      if (!code || code.length < 4) {
        this.showToast('Please enter a valid room code', '⚠️');
        return;
      }
      if (window.joinCustomSocketRoom) {
        window.joinCustomSocketRoom(code, profile.name);
      }
    });

    if (window.requestPublicRooms) {
      window.requestPublicRooms();
    }
  }

  public updatePublicRoomsList(rooms: any[]) {
    const container = document.getElementById('fc-public-rooms-list');
    if (!container) return;

    if (!rooms || rooms.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--fc-text-dim); padding: 12px; font-size: 13px;">No public rooms currently waiting. Create one!</div>`;
      return;
    }

    container.innerHTML = rooms.map(r => {
      const modeKey = r.mode || (r.special ? 'special' : 'classic');
      const modeInfo = GAME_MODES[modeKey] || GAME_MODES.classic;
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.35); padding: 8px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);">
          <div>
            <div style="font-weight: bold; font-size: 14px;">${r.name || 'Room ' + r.id}</div>
            <div style="font-size: 11px; color: var(--fc-text-dim); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <span>Host: ${r.hostName}</span>
              <span>•</span>
              <span class="fc-mode-badge-tag" style="background: ${modeInfo.badgeColor}; color: #fff; font-size: 9px; padding: 1px 5px;">
                ${modeInfo.icon} ${modeInfo.name}
              </span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 12px; font-weight: bold; color: #f1c40f;">${r.currentPlayers}/${r.maxPlayers}</span>
            <button class="fc-btn fc-btn-green fc-btn-small" onclick="window.joinCustomSocketRoom('${r.id}')">
              Join
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 5. LOBBY MODAL ---
  public openLobbyModal(room: any) {
    this.currentRoom = room;
    this.renderLobbyContent();
  }

  private renderLobbyContent() {
    if (!this.currentRoom) return;

    const players = this.currentRoom.players || [];
    const myIdx = (window as any).socketData?.gameIndex;
    const myPlayer = typeof myIdx === 'number' && players[myIdx] ? players[myIdx] : players.find((p: any) => p.id === (window as any).socket?.id);
    const isMeHost = myPlayer?.isHost === true;

    const isHost = isMeHost || (players[0] === myPlayer) || !players.some((p: any) => !p.isBot && p !== myPlayer);
    const roomId = this.currentRoom.id;
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    const maxPlayers = this.currentRoom.maxPlayers || 4;
    const hasEnoughPlayers = players.length >= 2;
    const hasBot = players.some((p: any) => p.isBot);
    const canAddBot = players.length < maxPlayers;
    const modeKey = this.currentRoom.mode || (this.currentRoom.special ? 'special' : 'classic');
    const modeInfo = GAME_MODES[modeKey] || GAME_MODES.classic;

    let chatHtml = `<div class="fc-chat-msg"><span class="fc-chat-sender">System:</span> Welcome to Room ${roomId}! Tap reaction buttons to chat.</div>`;
    const existingChat = document.getElementById('fc-chat-box');
    if (existingChat) {
      chatHtml = existingChat.innerHTML;
    }

    const html = `
      <div class="fc-modal-header">
        <div class="fc-modal-title">🏆 Room Lobby (${roomId})</div>
        <button class="fc-modal-close" id="fc-leave-room-btn" title="Leave Room">🚪</button>
      </div>
      <div class="fc-modal-body">
        <!-- Room Mode Banner -->
        <div class="fc-room-mode-banner">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">${modeInfo.icon}</span>
            <div>
              <div style="font-size: 13px; font-weight: bold; color: #fff;">${modeInfo.name}</div>
              <div style="font-size: 10px; color: var(--fc-text-dim);">${modeInfo.desc}</div>
            </div>
          </div>
          <span class="fc-mode-badge-tag" style="background: ${modeInfo.badgeColor}; color: #fff;">${modeInfo.badge}</span>
        </div>

        <!-- Room Code & Quick Copy Bar -->
        <div class="fc-invite-card">
          <div style="font-size: 11px; color: var(--fc-text-dim); text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
            Room Code
          </div>
          <div class="fc-room-code-display">${roomId}</div>
          <div class="fc-invite-actions">
            <button class="fc-btn fc-btn-secondary fc-btn-small" id="fc-copy-code-btn">
              📋 Copy Code
            </button>
            <button class="fc-btn fc-btn-blue fc-btn-small" id="fc-copy-link-btn">
              🔗 Copy Invite Link
            </button>
            <button class="fc-btn fc-btn-green fc-btn-small" id="fc-share-btn">
              📲 Share
            </button>
          </div>
        </div>

        <!-- Player Slots -->
        <div class="fc-form-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label class="fc-label">Players (${players.length}/${maxPlayers})</label>
            <div style="display: flex; gap: 6px;">
              ${canAddBot ? `
                <button class="fc-btn-mini fc-btn-mini-green" id="fc-add-bot-btn" title="Add AI Bot Player">🤖 + Add AI Bot</button>
              ` : ''}
              ${hasBot ? `
                <button class="fc-btn-mini fc-btn-mini-red" id="fc-remove-bot-btn" title="Remove last AI Bot">- Remove Bot</button>
              ` : ''}
            </div>
          </div>
          <div class="fc-slots-grid" id="fc-lobby-slots">
            ${this.renderLobbySlots(this.currentRoom)}
          </div>
        </div>

        <!-- In-Lobby Chat & Reactions -->
        <div class="fc-form-group">
          <label class="fc-label">Quick Chat & Reactions</label>
          <div class="fc-chat-box" id="fc-chat-box">
            ${chatHtml}
          </div>
          <div class="fc-quick-reactions">
            <button class="fc-reaction-btn" onclick="window.sendSocketChat('👋 Hello everyone!')">👋 Hello</button>
            <button class="fc-reaction-btn" onclick="window.sendSocketChat('🃏 Ready to win!')">🃏 Ready</button>
            <button class="fc-reaction-btn" onclick="window.sendSocketChat('🔥 Let\\'s Go!')">🔥 Let's Go</button>
            <button class="fc-reaction-btn" onclick="window.sendSocketChat('🎉 Good Luck!')">🎉 Good Luck</button>
            <button class="fc-reaction-btn" onclick="window.sendSocketChat('😱 Watch out!')">😱 Watch out</button>
          </div>
        </div>

        <!-- Start / Ready Action Bar -->
        <div id="fc-lobby-action-bar">
          ${isHost ? `
            <button class="fc-btn ${hasEnoughPlayers ? 'fc-btn-green' : 'fc-btn-secondary'} fc-btn-full" id="fc-lobby-start-btn" ${!hasEnoughPlayers ? 'disabled' : ''}>
              ${!hasEnoughPlayers ? '⏳ Need at least 2 players to start (Add AI Bot or Invite)' : '🚀 START GAME NOW'}
            </button>
          ` : `
            <button class="fc-btn fc-btn-secondary fc-btn-full" disabled>
              ⏳ Waiting for Host to Start Game...
            </button>
          `}
        </div>
      </div>
    `;

    this.openModal(html, 'lobby');

    // Attach listeners
    document.getElementById('fc-copy-code-btn')?.addEventListener('click', () => {
      this.copyToClipboard(roomId, `Room code ${roomId} copied!`, '📋');
    });

    document.getElementById('fc-copy-link-btn')?.addEventListener('click', () => {
      this.copyToClipboard(inviteUrl, '1-Click Invite Link copied!', '🔗');
    });

    document.getElementById('fc-share-btn')?.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join my Four Colors Match!',
            text: `Join my Four Colors card game room with code ${roomId}!`,
            url: inviteUrl
          });
        } catch (e: any) {
          if (e && e.name !== 'AbortError') {
            this.copyToClipboard(inviteUrl, 'Invite link copied!', '🔗');
          }
        }
      } else {
        this.copyToClipboard(inviteUrl, 'Invite link copied!', '🔗');
      }
    });

    document.getElementById('fc-add-bot-btn')?.addEventListener('click', () => {
      if (window.addSocketBot) {
        window.addSocketBot();
      }
    });

    document.getElementById('fc-remove-bot-btn')?.addEventListener('click', () => {
      if (window.removeSocketBot) {
        window.removeSocketBot();
      }
    });

    document.getElementById('fc-lobby-start-btn')?.addEventListener('click', () => {
      console.log("[UI] Start button clicked"); if (window.startSocketMatch) {
        window.startSocketMatch();
      }
    });

    document.getElementById('fc-leave-room-btn')?.addEventListener('click', () => {
      if (window.exitSocketRoom) {
        window.exitSocketRoom();
      }
      this.closeModal();
    });
  }

  public renderLobbySlots(room: any): string {
    let slotsHtml = '';
    const maxPlayers = room.maxPlayers || 4;
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f'];
    const emojis = ['🃏', '🔥', '⚡', '👑'];

    for (let i = 0; i < maxPlayers; i++) {
      const p = room.players[i];
      if (p) {
        const isMe = p.id === (window as any).socket?.id;
        slotsHtml += `
          <div class="fc-player-slot filled">
            <div class="fc-slot-avatar" style="background: ${colors[i % colors.length]};">
              ${p.isBot ? '🤖' : emojis[i % emojis.length]}
            </div>
            <div class="fc-slot-details">
              <div class="fc-slot-name">${p.name} ${isMe ? '(You)' : ''}</div>
              <span class="fc-slot-badge ${p.isHost ? 'fc-badge-host' : (p.isBot ? 'fc-badge-bot' : 'fc-badge-ready')}">
                ${p.isHost ? '👑 Host' : (p.isBot ? '🤖 AI Bot' : '✅ Joined')}
              </span>
            </div>
          </div>
        `;
      } else {
        slotsHtml += `
          <div class="fc-player-slot empty" style="cursor: pointer;" onclick="if(window.addSocketBot) window.addSocketBot();" title="Click to Add AI Bot">
            <span style="font-size: 15px; opacity: 0.85;">🤖 + Add AI Bot</span>
            <span style="font-size: 11px; opacity: 0.65;">Click to add bot to slot ${i + 1}</span>
          </div>
        `;
      }
    }
    return slotsHtml;
  }

  public updateLobbyPlayers(players: any[]) {
    if (!this.currentRoom) return;
    this.currentRoom.players = players;
    if (this.currentModal === 'lobby') {
      this.renderLobbyContent();
    }
  }

  public addChatMessage(sender: string, message: string, emoji?: string) {
    const box = document.getElementById('fc-chat-box');
    if (!box) return;
    const msgEl = document.createElement('div');
    msgEl.className = 'fc-chat-msg';
    msgEl.innerHTML = `<span class="fc-chat-sender">${sender}:</span> <span>${emoji ? emoji + ' ' : ''}${message}</span>`;
    box.appendChild(msgEl);
    box.scrollTop = box.scrollHeight;
  }

  // --- QUICK MATCH ---
  public triggerQuickMatch() {
    this.showToast('Finding fast online match...', '⚡');
    if (window.addSocketRandomUser) {
      window.addSocketRandomUser();
    }
  }

  // --- LEADERBOARD MODAL ---
  public openLeaderboardModal() {
    const profile = HistoryLeaderboardManager.getProfile();
    const stats = HistoryLeaderboardManager.getStats();

    const html = `
      <div class="fc-modal-header">
        <div class="fc-modal-title">🏆 Leaderboard & Player Stats</div>
        <button class="fc-modal-close">&times;</button>
      </div>
      <div class="fc-modal-body">
        <div class="fc-stats-banner">
          <div>
            <div class="fc-stat-val" style="color: #f1c40f;">${stats.wins}</div>
            <div class="fc-stat-lbl">Wins</div>
          </div>
          <div>
            <div class="fc-stat-val" style="color: #2ecc71;">${stats.winRate}%</div>
            <div class="fc-stat-lbl">Win %</div>
          </div>
          <div>
            <div class="fc-stat-val" style="color: #3498db;">${stats.totalScore}</div>
            <div class="fc-stat-lbl">Points</div>
          </div>
          <div>
            <div class="fc-stat-val" style="color: #e74c3c;">🔥 ${stats.bestStreak}</div>
            <div class="fc-stat-lbl">Best Streak</div>
          </div>
        </div>

        <table class="fc-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Wins</th>
              <th>Win %</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            ${MOCK_LEADERBOARD.map(p => `
              <tr>
                <td class="fc-rank-badge">${p.rank === 1 ? '🥇' : (p.rank === 2 ? '🥈' : (p.rank === 3 ? '🥉' : '#' + p.rank))}</td>
                <td><span style="margin-right: 6px;">${p.avatar}</span> <strong>${p.name}</strong></td>
                <td>${p.wins}</td>
                <td>${p.winRate}%</td>
                <td style="color: #f1c40f; font-weight: bold;">${p.score}</td>
              </tr>
            `).join('')}
            <tr class="highlight-user">
              <td class="fc-rank-badge">⭐️</td>
              <td><span style="margin-right: 6px;">${profile.avatarIcon}</span> <strong>${profile.name} (You)</strong></td>
              <td>${stats.wins}</td>
              <td>${stats.winRate}%</td>
              <td style="color: #f1c40f; font-weight: bold;">${stats.totalScore}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    this.openModal(html, 'leaderboard');
  }

  // --- MATCH HISTORY MODAL ---
  public openHistoryModal() {
    const history = HistoryLeaderboardManager.getHistory();

    const html = `
      <div class="fc-modal-header">
        <div class="fc-modal-title">📜 Match History</div>
        <button class="fc-modal-close">&times;</button>
      </div>
      <div class="fc-modal-body">
        ${history.length === 0 ? `
          <div style="text-align: center; color: var(--fc-text-dim); padding: 30px;">
            <div style="font-size: 40px; margin-bottom: 10px;">🃏</div>
            <div>No matches played yet! Play a match to record history.</div>
          </div>
        ` : `
          <table class="fc-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mode</th>
                <th>Players</th>
                <th>Result</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(m => {
                const dateStr = new Date(m.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `
                  <tr>
                    <td style="font-size: 12px; color: var(--fc-text-dim);">${dateStr}</td>
                    <td>${GAME_MODES[m.mode]?.name || m.mode || 'Classic UNO'}</td>
                    <td>${m.playersCount} Players</td>
                    <td>
                      <span class="${m.isWin ? 'fc-win-tag' : 'fc-loss-tag'}">
                        ${m.isWin ? '🏆 Victory' : '❌ Rank #' + m.playerRank}
                      </span>
                    </td>
                    <td style="color: #f1c40f; font-weight: bold;">+${m.playerScore}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <button class="fc-btn fc-btn-secondary fc-btn-small" style="margin-top: 10px;" id="fc-clear-history-btn">
            🗑 Clear History
          </button>
        `}
      </div>
    `;

    this.openModal(html, 'history');

    document.getElementById('fc-clear-history-btn')?.addEventListener('click', () => {
      HistoryLeaderboardManager.clearHistory();
      this.showToast('Match history cleared', '🗑');
      this.openHistoryModal();
    });
  }

  // --- PROFILE MODAL ---
  public openProfileModal() {
    const profile = HistoryLeaderboardManager.getProfile();
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];
    const emojis = ['🃏', '🔥', '⚡', '👑', '💎', '🚀', '🐱', '🤖'];

    const html = `
      <div class="fc-modal-header">
        <div class="fc-modal-title">👤 Edit Player Profile</div>
        <button class="fc-modal-close">&times;</button>
      </div>
      <div class="fc-modal-body">
        <div class="fc-form-group">
          <label class="fc-label">Display Name</label>
          <input type="text" id="fc-profile-name-input" class="fc-input" value="${profile.name}" maxlength="16" />
        </div>

        <div class="fc-form-group">
          <label class="fc-label">Avatar Emoji</label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${emojis.map(e => `
              <button class="fc-avatar-badge ${profile.avatarIcon === e ? 'active' : ''}" style="cursor: pointer; background: ${profile.avatarColor};" onclick="window.setProfileEmoji('${e}')">
                ${e}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="fc-form-group">
          <label class="fc-label">Avatar Color Theme</label>
          <div style="display: flex; gap: 10px;">
            ${colors.map(c => `
              <div style="width: 36px; height: 36px; border-radius: 50%; background: ${c}; cursor: pointer; border: 2px solid ${profile.avatarColor === c ? '#fff' : 'transparent'};" onclick="window.setProfileColor('${c}')"></div>
            `).join('')}
          </div>
        </div>

        <button class="fc-btn fc-btn-green fc-btn-full" id="fc-save-profile-btn" style="margin-top: 6px;">
          💾 Save Profile
        </button>
      </div>
    `;

    this.openModal(html, 'profile');

    document.getElementById('fc-save-profile-btn')?.addEventListener('click', () => {
      const nameInput = (document.getElementById('fc-profile-name-input') as HTMLInputElement)?.value.trim();
      if (nameInput) {
        HistoryLeaderboardManager.saveProfile({ name: nameInput });
        this.renderTopBar();
        this.showToast('Profile saved!', '✅');
        this.closeModal();
      }
    });
  }

  // --- URL INVITE CHECK ---
  public checkUrlForRoomInvite() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roomCode = urlParams.get('room');
      if (roomCode) {
        const cleanCode = roomCode.trim().toUpperCase();
        setTimeout(() => {
          this.openJoinRoomModal(cleanCode);
          this.showToast(`Found invite for room ${cleanCode}!`, '🎉');
        }, 500);
      }
    } catch (e) {}
  }

  private setupSegmented(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.fc-seg-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
}

// Global window helpers
declare global {
  interface Window {
    setProfileEmoji: (e: string) => void;
    setProfileColor: (c: string) => void;
    recordMatchResult: (record: any) => void;
  }
}

window.setProfileEmoji = (e: string) => {
  HistoryLeaderboardManager.saveProfile({ avatarIcon: e });
  MultiplayerUIManager.getInstance().openProfileModal();
};

window.setProfileColor = (c: string) => {
  HistoryLeaderboardManager.saveProfile({ avatarColor: c });
  MultiplayerUIManager.getInstance().openProfileModal();
};

window.recordMatchResult = (record: any) => {
  if (record) {
    HistoryLeaderboardManager.addMatch(record);
    MultiplayerUIManager.getInstance().renderTopBar();
  }
};

(window as any).MultiplayerUIManager = MultiplayerUIManager;
(window as any).HistoryLeaderboardManager = HistoryLeaderboardManager;

