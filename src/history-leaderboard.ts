/**
 * History & Leaderboard Manager
 * Handles local profile persistence, match record keeping, win-rate analytics, streaks, and leaderboard tables
 */

export interface PlayerProfile {
  name: string;
  avatarIcon: string;
  avatarColor: string;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  mode: string;
  playersCount: number;
  playerRank: number;
  winnerName: string;
  playerScore: number;
  isWin: boolean;
  durationSeconds: number;
}

export interface PlayerStats {
  wins: number;
  matches: number;
  winRate: number;
  totalScore: number;
  currentStreak: number;
  bestStreak: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  wins: number;
  winRate: number;
  score: number;
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'WildMaster99', avatar: '👑', wins: 84, winRate: 78, score: 14200 },
  { rank: 2, name: 'CardNinja', avatar: '⚡', wins: 72, winRate: 69, score: 11850 },
  { rank: 3, name: 'ColorQueen', avatar: '💎', wins: 65, winRate: 64, score: 10400 },
  { rank: 4, name: 'NoMercyPro', avatar: '💥', wins: 58, winRate: 61, score: 9250 },
  { rank: 5, name: 'DrawFourKing', avatar: '🃏', wins: 49, winRate: 55, score: 7900 }
];

const STORAGE_KEYS = {
  PROFILE: 'fc_player_profile',
  HISTORY: 'fc_match_history',
  STATS: 'fc_player_stats'
};

export class HistoryLeaderboardManager {
  private static defaultProfile: PlayerProfile = {
    name: 'CardPlayer',
    avatarIcon: '🃏',
    avatarColor: '#e74c3c'
  };

  public static getProfile(): PlayerProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        return { ...this.defaultProfile, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('[HistoryLeaderboardManager] Error reading profile from storage:', e);
    }
    return { ...this.defaultProfile };
  }

  public static saveProfile(partial: Partial<PlayerProfile>): PlayerProfile {
    try {
      const current = this.getProfile();
      const updated = { ...current, ...partial };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('[HistoryLeaderboardManager] Error saving profile to storage:', e);
      return this.defaultProfile;
    }
  }

  public static getHistory(): MatchRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[HistoryLeaderboardManager] Error reading match history:', e);
    }
    return [];
  }

  public static addMatch(matchData: any): void {
    try {
      const history = this.getHistory();
      const newRecord: MatchRecord = {
        id: 'match_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        timestamp: Date.now(),
        mode: matchData.mode || 'classic',
        playersCount: matchData.playersCount || 4,
        playerRank: matchData.playerRank || (matchData.isWin ? 1 : 2),
        winnerName: matchData.winnerName || (matchData.isWin ? 'You' : 'Opponent'),
        playerScore: matchData.playerScore || 0,
        isWin: matchData.isWin === true || matchData.playerRank === 1,
        durationSeconds: matchData.durationSeconds || 120
      };

      history.unshift(newRecord);
      // Keep up to latest 50 matches
      if (history.length > 50) {
        history.length = 50;
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      this.recalculateStats(history);
    } catch (e) {
      console.warn('[HistoryLeaderboardManager] Error adding match record:', e);
    }
  }

  public static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.STATS);
    } catch (e) {
      console.warn('[HistoryLeaderboardManager] Error clearing history:', e);
    }
  }

  public static getStats(): PlayerStats {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[HistoryLeaderboardManager] Error reading stats:', e);
    }

    // Default or recalculate from history
    const history = this.getHistory();
    return this.recalculateStats(history);
  }

  private static recalculateStats(history: MatchRecord[]): PlayerStats {
    let wins = 0;
    let totalScore = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let countingCurrentStreak = true;

    for (const match of history) {
      if (match.isWin) {
        wins++;
        if (countingCurrentStreak) {
          currentStreak++;
        }
      } else {
        countingCurrentStreak = false;
      }
      totalScore += (match.playerScore || 0);
    }

    // Calculate best streak across entire history (sorted newest to oldest)
    let tempStreak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].isWin) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    const matches = history.length;
    const winRate = matches > 0 ? Math.round((wins / matches) * 100) : 0;

    const stats: PlayerStats = {
      wins,
      matches,
      winRate,
      totalScore,
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak)
    };

    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('[HistoryLeaderboardManager] Error saving stats:', e);
    }

    return stats;
  }
}
