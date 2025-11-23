import React, { useEffect } from 'react';
import { CheckCircle, Package, Clock } from 'lucide-react';
import { Product } from './ProductCard';
import { OrderData } from './CheckoutModal';
import { saveOrder } from '@/lib/orderStorage';

interface OrderSuccessProps {
    product: Product;
    orderNumber: string;
    orderData: OrderData;
    onContinue: () => void;
}

export function OrderSuccess({ product, orderNumber, orderData, onContinue }: OrderSuccessProps) {
    // 保存订单到历史
    useEffect(() => {
        saveOrder({
            orderId: orderNumber,
            product,
            orderData,
            timestamp: Date.now(),
            status: 'completed',
        });
    }, [orderNumber, product, orderData]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom-4">
                {/* Success Icon */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-in zoom-in">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">下单成功！</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">您的订单已提交</p>
                </div>

                {/* Order Details */}
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 mb-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">商品</p>
                            <p className="font-semibold text-zinc-900 dark:text-white">{product.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="text-lg">📦</div>
                        <div className="flex-1">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">订单号</p>
                            <p className="font-mono text-sm text-zinc-900 dark:text-white">{orderNumber}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">预计送达</p>
                            <p className="font-semibold text-zinc-900 dark:text-white">30分钟</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">实付金额</span>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">¥{(product.price || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Status */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">🚴</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-blue-900 dark:text-blue-100">骑手正在赶来</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">商家正在准备您的订单</p>
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={onContinue}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 active:scale-95"
                >
                    继续购物
                </button>
            </div>
        </div>
    );
}
