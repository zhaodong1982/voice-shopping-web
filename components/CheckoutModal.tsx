import React, { useState } from 'react';
import { X, MapPin, Phone, User } from 'lucide-react';
import { Product } from './ProductCard';

interface CheckoutModalProps {
    product: Product;
    onClose: () => void;
    onConfirm: (orderData: OrderData) => void;
}

export interface OrderData {
    name: string;
    phone: string;
    address: string;
    paymentMethod: 'wechat' | 'alipay';
}

export function CheckoutModal({ product, onClose, onConfirm }: CheckoutModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && phone && address) {
            onConfirm({ name, phone, address, paymentMethod });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">确认订单</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Product Summary */}
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4">
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{product.name}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">价格</span>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">¥{product.price.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            配送信息
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    <User className="w-4 h-4 inline mr-1" />
                                    收货人
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="请输入姓名"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    手机号
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="请输入手机号"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    配送地址
                                </label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="请输入详细地址"
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-zinc-900 dark:text-white">支付方式</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('wechat')}
                                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'wechat'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                                    }`}
                            >
                                <div className="text-2xl mb-2">💚</div>
                                <div className="text-sm font-medium text-zinc-900 dark:text-white">微信支付</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('alipay')}
                                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'alipay'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                                    }`}
                            >
                                <div className="text-2xl mb-2">💙</div>
                                <div className="text-sm font-medium text-zinc-900 dark:text-white">支付宝</div>
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!name || !phone || !address}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 active:scale-95 disabled:cursor-not-allowed"
                    >
                        确认支付 ¥{product.price.toFixed(2)}
                    </button>
                </form>
            </div>
        </div>
    );
}
