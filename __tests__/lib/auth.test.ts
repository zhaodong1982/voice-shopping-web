import { saveUser, getUser, logout, isLoggedIn, User } from '@/lib/auth';

describe('Auth Utils', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('saveUser', () => {
        it('should save user to localStorage', () => {
            const user: User = {
                userId: 'test123',
                nickname: 'Test User',
                avatar: '👤',
                loginTime: Date.now(),
            };

            saveUser(user);

            // Verify by getting the user back
            const saved = getUser();
            expect(saved).toEqual(user);
        });
    });

    describe('getUser', () => {
        it('should return user from localStorage', () => {
            const user: User = {
                userId: 'test123',
                nickname: 'Test User',
                avatar: '👤',
                loginTime: Date.now(),
            };

            // Save first
            saveUser(user);

            // Then get
            const result = getUser();

            expect(result).toEqual(user);
        });

        it('should return null if no user in localStorage', () => {
            const result = getUser();

            expect(result).toBeNull();
        });
    });

    describe('logout', () => {
        it('should remove user from localStorage', () => {
            const user: User = {
                userId: 'test123',
                nickname: 'Test User',
                avatar: '👤',
                loginTime: Date.now(),
            };

            // Save user first
            saveUser(user);
            expect(getUser()).toEqual(user);

            // Logout
            logout();

            // Verify user is removed
            expect(getUser()).toBeNull();
        });
    });

    describe('isLoggedIn', () => {
        it('should return true if user exists', () => {
            const user: User = {
                userId: 'test123',
                nickname: 'Test User',
                avatar: '👤',
                loginTime: Date.now(),
            };

            saveUser(user);

            expect(isLoggedIn()).toBe(true);
        });

        it('should return false if no user exists', () => {
            expect(isLoggedIn()).toBe(false);
        });

        it('should return false after logout', () => {
            const user: User = {
                userId: 'test123',
                nickname: 'Test User',
                avatar: '👤',
                loginTime: Date.now(),
            };

            saveUser(user);
            expect(isLoggedIn()).toBe(true);

            logout();
            expect(isLoggedIn()).toBe(false);
        });
    });
});
