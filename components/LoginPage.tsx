import React from 'react';

interface LoginPageProps {
    onLogin: (method: 'wechat' | 'alipay') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6">
            <div className="max-w-sm w-full space-y-8">
                {/* Logo and Title */}
                <div className="text-center space-y-3">
                    <div className="text-5xl">☕</div>
                    <h1 className="text-3xl font-light text-zinc-900 dark:text-white tracking-tight">
                        咖啡助理
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        智能语音点单
                    </p>
                </div>

                {/* Login Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => onLogin('wechat')}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium py-3.5 px-6 rounded-xl transition-colors duration-200"
                    >
                        微信登录
                    </button>

                    <button
                        onClick={() => onLogin('alipay')}
                        className="w-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white font-medium py-3.5 px-6 rounded-xl transition-colors duration-200"
                    >
                        支付宝登录
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                    登录即表示同意服务条款
                </p>
            </div>
        </div>
    );
}
