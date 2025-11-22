import React from 'react';
import { LogOut } from 'lucide-react';
import { User } from '@/lib/auth';

interface UserProfileProps {
    user: User;
    onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
    return (
        <div className="absolute top-4 left-4 z-10">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 p-3 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center text-2xl">
                    {user.avatar}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                        {user.nickname}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        ID: {user.userId}
                    </p>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    title="退出登录"
                >
                    <LogOut className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </button>
            </div>
        </div>
    );
}
