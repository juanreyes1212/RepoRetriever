export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  autoDeleteRepos: boolean;
  showAdvancedOptions: boolean;
}

export interface AchievementRecord {
  id: string;
  achievementType: 'pull_shark' | 'quickdraw' | 'yolo';
  status: 'success' | 'failed' | 'partial';
  repositoryUrl?: string;
  issueUrl?: string;
  pullRequestUrls?: string[];
  durationSeconds: number;
  errorMessage?: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  achievementId?: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

const STORAGE_KEYS = {
  TOKEN: 'github_token',
  PREFERENCES: 'user_preferences',
  ACHIEVEMENT_HISTORY: 'achievement_history',
  LOGS: 'activity_logs',
} as const;

export const storageUtils = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  clearToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getPreferences(): UserPreferences {
    if (typeof window === 'undefined') {
      return {
        theme: 'system',
        autoDeleteRepos: false,
        showAdvancedOptions: false,
      };
    }

    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!stored) {
      return {
        theme: 'system',
        autoDeleteRepos: false,
        showAdvancedOptions: false,
      };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return {
        theme: 'system',
        autoDeleteRepos: false,
        showAdvancedOptions: false,
      };
    }
  },

  setPreferences(preferences: UserPreferences): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  },

  getAchievementHistory(): AchievementRecord[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENT_HISTORY);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  addAchievementRecord(record: AchievementRecord): void {
    if (typeof window === 'undefined') return;

    const history = this.getAchievementHistory();
    history.unshift(record);

    if (history.length > 100) {
      history.splice(100);
    }

    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENT_HISTORY, JSON.stringify(history));
  },

  clearAchievementHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENT_HISTORY);
  },

  getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  addLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    const logs = this.getLogs();
    const newEntry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    logs.unshift(newEntry);

    if (logs.length > 200) {
      logs.splice(200);
    }

    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  clearLogs(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  },

  clearAllData(): void {
    if (typeof window === 'undefined') return;
    this.clearToken();
    this.clearAchievementHistory();
    this.clearLogs();
  },

  exportData(): string {
    return JSON.stringify({
      preferences: this.getPreferences(),
      achievementHistory: this.getAchievementHistory(),
      logs: this.getLogs(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  },
};
