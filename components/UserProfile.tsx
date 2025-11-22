import React from 'react';
import { LogOut } from 'lucide-react';
import { User } from '@/lib/auth';

interface UserProfileProps {
    user: User;
    onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
    return (
        <div className="absolute top-3 right-3 z-10">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 flex items-center gap-2">
                {/* Avatar */}
                <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-lg">
                    {user.avatar}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0 pr-1">
                    <p className="font-medium text-xs text-zinc-900 dark:text-white truncate">
                        {user.nickname}
                    </p>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    title="退出登录"
                >
                    <LogOut className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                </button>
            </div>
        </div>
    );
}
