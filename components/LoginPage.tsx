import React from 'react';

interface LoginPageProps {
    onLogin: (method: 'wechat' | 'alipay') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo and Title */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-6xl mb-4">☕</div>
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                        咖啡助理
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Coffee AI - 您的智能咖啡管家
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 delay-100">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 text-center">
                        欢迎使用
                    </h2>

                    {/* WeChat Login Button */}
                    <button
                        onClick={() => onLogin('wechat')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-green-600/30 mb-3"
                    >
                        <span className="text-2xl">💚</span>
                        <span>微信登录</span>
                    </button>

                    {/* Alipay Login Button */}
                    <button
                        onClick={() => onLogin('alipay')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30"
                    >
                        <span className="text-2xl">💙</span>
                        <span>支付宝登录</span>
                    </button>

                    {/* Features */}
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <span>🎤</span>
                            </div>
                            <span>语音点单，解放双手</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <span>🚀</span>
                            </div>
                            <span>快速下单，30分钟送达</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                <span>💰</span>
                            </div>
                            <span>微信/支付宝，安全便捷</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-zinc-400 dark:text-zinc-600 mt-6">
                    登录即表示同意服务条款和隐私政策
                </p>
            </div>
        </div>
    );
}
