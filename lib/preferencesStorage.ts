import { saveToStorage, getFromStorage } from './storage';

export interface UserPreferences {
    selectedVoice: string;
    autoPlayVoice: boolean;
    theme: 'light' | 'dark' | 'auto';
    saveAddresses: boolean;
    saveOrderHistory: boolean;
}

const PREFERENCES_KEY = 'user_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
    selectedVoice: '',
    autoPlayVoice: true,
    theme: 'auto',
    saveAddresses: true,
    saveOrderHistory: true,
};

export function getPreferences(): UserPreferences {
    const saved = getFromStorage<UserPreferences>(PREFERENCES_KEY);
    return saved ? { ...DEFAULT_PREFERENCES, ...saved } : DEFAULT_PREFERENCES;
}

export function savePreferences(preferences: Partial<UserPreferences>): void {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    saveToStorage(PREFERENCES_KEY, updated);
}

export function updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
): void {
    const preferences = getPreferences();
    preferences[key] = value;
    saveToStorage(PREFERENCES_KEY, preferences);
}

export function resetPreferences(): void {
    saveToStorage(PREFERENCES_KEY, DEFAULT_PREFERENCES);
}
