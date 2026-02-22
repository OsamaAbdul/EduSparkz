import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, recordAttempts, clearRateLimit } from './rateLimit';

// FAKE LOCALSTORAGE FOR THE TEST
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; }
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Rate Limiter Utility', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        vi.useFakeTimers(); // Allow us to control time
    });

    it('should allow initial attempts', () => {
        const status = checkRateLimit('login');
        expect(status.blocked).toBe(false);
    });

    it('should block after 5 failed attempts', () => {
        const key = 'login';
        for (let i = 0; i < 5; i++) {
            recordAttempts(key);
        }

        const status = checkRateLimit(key);
        expect(status.blocked).toBe(true);
        expect(status.remainingTime).toBeGreaterThan(0);
    });

    it('should clear limits on success', () => {
        const key = 'login';
        recordAttempts(key);
        recordAttempts(key);

        clearRateLimit(key);

        const status = checkRateLimit(key);
        expect(status.blocked).toBe(false);
    });

    it('should unblock after cooldown period', () => {
        const key = 'login';
        for (let i = 0; i < 5; i++) {
            recordAttempts(key);
        }

        // Mock time forward by 16 minutes
        const sixteenMinutes = 16 * 60 * 1000;
        vi.advanceTimersByTime(sixteenMinutes);

        const status = checkRateLimit(key);
        expect(status.blocked).toBe(false);
    });
});