import React, { useState, useEffect, useRef } from 'react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { VoiceOrb } from './VoiceOrb';
import { ProductCard, Product } from './ProductCard';
import { VoiceSelector } from './VoiceSelector';
import { UserProfile } from './UserProfile';
import { CheckoutModal, OrderData } from './CheckoutModal';
import { PaymentModal } from './PaymentModal';
import { OrderSuccess } from './OrderSuccess';
import { searchMeituan, placeOrderMeituan } from '@/lib/china_api/meituanService';
import { User } from '@/lib/auth';
import { getPreferences, updatePreference } from '@/lib/preferencesStorage';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
}

interface ChatInterfaceProps {
    user: User;
    onLogout: () => void;
}

export function ChatInterface({ user, onLogout }: ChatInterfaceProps) {
    const { isListening, transcript, startListening, stopListening, error: voiceError } = useVoiceInput();
    const { speak, voices, selectedVoice, setSelectedVoice } = useVoiceOutput();

    const [messages, setMessages] = useState<Message[]>([
        { id: '0', text: "你好！我是你的咖啡助理。想喝点什么？(瑞幸/星巴克)", isUser: false }
    ]);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [textInput, setTextInput] = useState('');

    // Purchase flow states
    const [showCheckout, setShowCheckout] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [orderNumber, setOrderNumber] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 加载用户偏好
    useEffect(() => {
        const prefs = getPreferences();
        if (prefs.selectedVoice && voices.length > 0) {
            const voice = voices.find(v => v.name === prefs.selectedVoice);
            if (voice) {
                setSelectedVoice(voice);
            }
        }
    }, [voices]);

    // 保存语音选择偏好
    useEffect(() => {
        if (selectedVoice) {
            updatePreference('selectedVoice', selectedVoice.name);
        }
    }, [selectedVoice]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle voice input end
    useEffect(() => {
        if (!isListening && transcript) {
            handleUserMessage(transcript);
        }
    }, [isListening, transcript]);

    const handleVoiceSuccess = async (text: string) => {
        stopListening();
        // Add user message immediately
        setMessages(prev => [...prev, { id: Date.now().toString(), text, isUser: true }]);
        setIsProcessing(true);

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    history: messages.map(m => ({
                        role: m.isUser ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    }))
                }),
            });

            const data = await response.json();

            if (data.product) {
                setCurrentProduct(data.product);
                addBotMessage(`I found this for you: ${data.product.name}`);
            } else {
                addBotMessage(data.reply || "Sorry, I couldn't find anything.");
            }
        } catch (error) {
            console.error('Error:', error);
            addBotMessage("Sorry, I encountered an error. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!textInput.trim()) return;
        handleUserMessage(textInput);
        setTextInput('');
    };

    const handleUserMessage = async (text: string) => {
        if (!text.trim()) return;

        setIsProcessing(true);
        console.log('Processing user message:', text);

        // Add user message
        const userMsg: Message = { id: Date.now().toString(), text, isUser: true };
        setMessages(prev => [...prev, userMsg]);

        // Process intent (Gemini AI)
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    history: messages.map(m => ({
                        role: m.isUser ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    }))
                }),
            });

            const data = await response.json();
            console.log('Gemini API response:', data);

            // 1. Search intent with product name (from 'product' field)
            if (data.intent === 'SEARCH' && data.product) {
                console.log('Search intent detected with product:', data.product);
                const product = await searchMeituan(data.product);
                if (product) {
                    setCurrentProduct(product);
                    addBotMessage(data.reply || `I found this for you: ${product.name}`);
                } else {
                    addBotMessage(data.reply || "Sorry, I couldn't find anything.");
                }
            }
            // 2. Fallback: Treat as generic search if no specific intent but text implies search
            else {
                console.log('No specific intent, trying generic search for:', text);
                // Try to search with the raw text
                const product = await searchMeituan(text);
                if (product) {
                    setCurrentProduct(product);
                    addBotMessage(data.reply || `I found this for you: ${product.name}`);
                } else {
                    addBotMessage(data.reply || "Sorry, I couldn't find anything.");
                }
            }
        } catch (error) {
            console.error('Error in handleUserMessage:', error);
            addBotMessage("抱歉，连接大脑失败了。");
        }

        setIsProcessing(false);
    };

    const addBotMessage = (text: string) => {
        const botMsg: Message = { id: (Date.now() + 1).toString(), text, isUser: false };
        setMessages(prev => [...prev, botMsg]);
        speak(text);
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="flex flex-col h-[85vh] max-w-lg mx-auto bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
            {/* User Profile */}
            <UserProfile user={user} onLogout={onLogout} />

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-lg font-medium text-zinc-900 dark:text-white text-center">
                    咖啡助理
                </h1>
                <VoiceSelector
                    voices={voices}
                    selectedVoice={selectedVoice}
                    onVoiceChange={setSelectedVoice}
                />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl ${msg.isUser
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Product Card Injection */}
                {currentProduct && (
                    <div className="flex justify-center py-4">
                        <ProductCard
                            product={currentProduct}
                            onConfirm={async () => {
                                // For generic search, open Meituan directly
                                if (currentProduct.id === 'generic-search') {
                                    // Open window immediately to avoid popup blocker
                                    const newWindow = window.open('about:blank', '_blank');

                                    try {
                                        const result = await placeOrderMeituan(currentProduct);
                                        addBotMessage(`正在为您打开美团外卖搜索...`);

                                        if (newWindow) {
                                            // 检测设备类型
                                            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                                            if (isMobile && result.deepLink) {
                                                // 移动端：尝试打开APP Deep Link
                                                newWindow.location.href = result.deepLink;

                                                // 2秒后如果还在空白页，说明APP未安装，使用网页版首页兜底
                                                setTimeout(() => {
                                                    // 优先使用 mobileWebLink (首页)，如果没有则用 webLink
                                                    const fallbackUrl = result.mobileWebLink || result.webLink;
                                                    if (fallbackUrl && newWindow.location.href === 'about:blank') {
                                                        newWindow.location.href = fallbackUrl;
                                                    }
                                                }, 2000);
                                            } else {
                                                // 桌面端：直接使用网页版
                                                newWindow.location.href = result.webLink || result.deepLink;
                                            }
                                        }
                                        setCurrentProduct(null);
                                    } catch (error) {
                                        // Close the window if there's an error
                                        if (newWindow) {
                                            newWindow.close();
                                        }
                                        addBotMessage('抱歉，打开美团失败了');
                                    }
                                } else {
                                    // For regular products, show checkout
                                    setShowCheckout(true);
                                }
                            }}
                        />
                    </div>
                )}

                {/* Live Transcript */}
                {isListening && transcript && (
                    <div className="flex justify-end opacity-50">
                        <div className="max-w-[80%] p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 italic">
                            {transcript}...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-4">
                <div className="h-8 text-sm text-zinc-500 font-medium text-center">
                    {voiceError ? (
                        <span className="text-red-500">⚠️ {voiceError}</span>
                    ) : isListening ? '正在听...' : isProcessing ? '思考中...' : '点击说话或输入文字'}
                </div>

                <div className="flex flex-col items-center gap-6 w-full max-w-md">
                    <VoiceOrb isListening={isListening} onClick={toggleListening} />

                    {/* Text Input Area */}
                    <form onSubmit={handleTextSubmit} className="w-full flex gap-2">
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="输入您的需求..."
                            className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            disabled={isListening || isProcessing}
                        />
                        <button
                            type="submit"
                            disabled={!textInput.trim() || isListening || isProcessing}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                        >
                            发送
                        </button>
                    </form>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckout && currentProduct && (
                <CheckoutModal
                    product={currentProduct}
                    onClose={() => setShowCheckout(false)}
                    onConfirm={(data) => {
                        setOrderData(data);
                        setShowCheckout(false);
                        setShowPayment(true);
                        addBotMessage(`正在为您处理订单...`);
                    }}
                />
            )}

            {/* Payment Modal */}
            {showPayment && currentProduct && orderData && (
                <PaymentModal
                    paymentMethod={orderData.paymentMethod}
                    amount={currentProduct.price}
                    productName={currentProduct.name}
                    onSuccess={() => {
                        setShowPayment(false);
                        const orderId = 'MT' + Date.now().toString().slice(-8);
                        setOrderNumber(orderId);
                        setShowSuccess(true);
                        addBotMessage(`支付成功！您的订单号是 ${orderId}`);
                    }}
                />
            )}

            {/* Order Success Modal */}
            {showSuccess && currentProduct && orderData && (
                <OrderSuccess
                    product={currentProduct}
                    orderNumber={orderNumber}
                    orderData={orderData}
                    onContinue={() => {
                        setShowSuccess(false);
                        setCurrentProduct(null);
                        setOrderData(null);
                        addBotMessage('还想喝点什么吗？');
                    }}
                />
            )}
        </div>
    );
}
