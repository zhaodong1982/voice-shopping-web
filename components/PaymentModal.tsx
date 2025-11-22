import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface PaymentModalProps {
    paymentMethod: 'wechat' | 'alipay';
    amount: number;
    onSuccess: () => void;
}

export function PaymentModal({ paymentMethod, amount, onSuccess }: PaymentModalProps) {
    const [countdown, setCountdown] = useState(3);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (!isSuccess) {
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }
    }, [countdown, isSuccess, onSuccess]);

    const paymentColor = paymentMethod === 'wechat' ? 'green' : 'blue';
    const paymentName = paymentMethod === 'wechat' ? '微信支付' : '支付宝';
    const paymentEmoji = paymentMethod === 'wechat' ? '💚' : '💙';

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in slide-in-from-bottom-4">
                {!isSuccess ? (
                    <>
                        {/* Payment Header */}
                        <div className="mb-6">
                            <div className="text-5xl mb-3">{paymentEmoji}</div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{paymentName}</h2>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">¥{amount.toFixed(2)}</p>
                        </div>

                        {/* QR Code Placeholder */}
                        <div className={`bg-${paymentColor}-50 dark:bg-${paymentColor}-900/20 rounded-2xl p-8 mb-6`}>
                            <div className="bg-white rounded-xl p-6 shadow-inner">
                                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 rounded-lg flex items-center justify-center">
                                    <div className="text-6xl">📱</div>
                                </div>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="space-y-2">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                请使用{paymentName}扫码支付
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    模拟支付中... {countdown}秒
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Success Animation */}
                        <div className="animate-in zoom-in">
                            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">支付成功！</h2>
                            <p className="text-zinc-500 dark:text-zinc-400">订单正在处理中...</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
