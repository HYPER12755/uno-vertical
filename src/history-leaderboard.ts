/**
 * History & Leaderboard Manager
 * Stores and manages local match history, player statistics, and leaderboard data.
 */

export interface MatchRecord {
  id: string;
  timestamp: number;
  mode: 'classic' | 'special';
  playersCount: number;
  playerRank: number;
  winnerName: string;
  playerScore: number;
  isWin: boolean;
  durationSeconds: number;
}

export interface PlayerProfile {
  name: string;
  avatarColor: string;
  avatarIcon: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  totalScore: number;
  currentStreak: number;
  bestStreak: number;
  winRate: number;
}

const STORAGE_KEYS = {
  PROFILE: 'fourcolors_profile',
  HISTORY: 'fourcolors_match_history',
  STATS: 'fourcolors_player_stats',
};

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Player 1',
  avatarColor: '#e74c3c',
  avatarIcon: '🃏'
};

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  totalScore: 0,
  currentStreak: 0,
  bestStreak: 0,
  winRate: 0
};

// Seed sample competitive players for global leaderboard
export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'CardMaster_99', wins: 142, games: 178, winRate: 80, score: 38400, avatar: '👑', color: '#f1c40f' },
  { rank: 2, name: 'WildDrawKing', wins: 118, games: 160, winRate: 74, score: 31200, avatar: '🔥', color: '#e74c3c' },
  { rank: 3, name: 'UnoNinja', wins: 95, games: 135, winRate: 70, score: 26800, avatar: '⚡', color: '#3498db' },
  { rank: 4, name: 'ColorQueen', wins: 84, games: 124, winRate: 68, score: 23100, avatar: '💎', color: '#9b59b6' },
  { rank: 5, name: 'ReverseReverse', wins: 76, games: 119, winRate: 64, score: 19800, avatar: '🚀', color: '#2ecc71' },
];

export class HistoryLeaderboardManager {
  static getProfile(): PlayerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load profile from localStorage', e);
    }
    return { ...DEFAULT_PROFILE, name: `Player_${Math.floor(1000 + Math.random() * 9000)}` };
  }

  static saveProfile(profile: Partial<PlayerProfile>): PlayerProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save profile', e);
    }
    return updated;
  }

  static getStats(): PlayerStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
    return { ...DEFAULT_STATS };
  }

  static getHistory(): MatchRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load match history', e);
    }
    return [];
  }

  static addMatch(record: Omit<MatchRecord, 'id' | 'timestamp'>): MatchRecord {
    const fullRecord: MatchRecord = {
      ...record,
      id: 'match_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now()
    };

    // Update history
    const history = this.getHistory();
    history.unshift(fullRecord);
    // Keep last 50 matches
    if (history.length > 50) history.pop();

    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save match history', e);
    }

    // Update stats
    const stats = this.getStats();
    stats.gamesPlayed++;
    stats.totalScore += record.playerScore;

    if (record.isWin) {
      stats.wins++;
      stats.currentStreak++;
      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak;
      }
    } else {
      stats.losses++;
      stats.currentStreak = 0;
    }

    stats.winRate = Math.round((stats.wins / stats.gamesPlayed) * 100);

    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats', e);
    }

    return fullRecord;
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {}
  }
}
