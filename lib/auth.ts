export interface User {
    userId: string;
    nickname: string;
    avatar: string;
    loginTime: number;
    loginMethod?: 'wechat' | 'alipay'; // 登录方式
}

const USER_KEY = 'app_user'; // 修改为通用的 key

// Simulated WeChat user data
const MOCK_USERS = [
    {
        userId: 'wx_001',
        nickname: '咖啡爱好者',
        avatar: '☕',
    },
    {
        userId: 'wx_002',
        nickname: '小明',
        avatar: '👨',
    },
    {
        userId: 'wx_003',
        nickname: '小红',
        avatar: '👩',
    },
];

export function getRandomMockUser(): Omit<User, 'loginTime'> {
    return MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
}

export function saveUser(user: User): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}

export function getUser(): User | null {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(USER_KEY);
        if (data) {
            try {
                return JSON.parse(data);
            } catch {
                return null;
            }
        }
    }
    return null;
}

export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY);
    }
}

export function isLoggedIn(): boolean {
    return getUser() !== null;
}
