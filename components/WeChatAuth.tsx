import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface WeChatAuthProps {
    onSuccess: (userData: { userId: string; nickname: string; avatar: string }) => void;
}

export function WeChatAuth({ onSuccess }: WeChatAuthProps) {
    const [countdown, setCountdown] = useState(2);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (!isSuccess) {
            setIsSuccess(true);
            setTimeout(() => {
                // Simulate successful authorization
                const mockUser = {
                    userId: 'wx_' + Date.now().toString().slice(-6),
                    nickname: '咖啡爱好者',
                    avatar: '☕',
                };
                onSuccess(mockUser);
            }, 1000);
        }
    }, [countdown, isSuccess, onSuccess]);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-in slide-in-from-bottom-4">
                {!isSuccess ? (
                    <>
                        {/* WeChat Logo */}
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <span className="text-5xl">💚</span>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">微信授权登录</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">WeChat Authorization</p>
                        </div>

                        {/* App Info */}
                        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-3xl">☕</div>
                                <div>
                                    <p className="font-semibold text-zinc-900 dark:text-white">咖啡助理</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Coffee AI</p>
                                </div>
                            </div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                                <p>✓ 获取你的昵称、头像</p>
                                <p>✓ 保存订单历史</p>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    正在授权... {countdown}秒
                                </p>
                            </div>
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">
                                模拟微信授权流程
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Success Animation */}
                        <div className="text-center animate-in zoom-in">
                            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">授权成功！</h2>
                            <p className="text-zinc-500 dark:text-zinc-400">正在进入应用...</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
