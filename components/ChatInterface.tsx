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

    // Purchase flow states
    const [showCheckout, setShowCheckout] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [orderNumber, setOrderNumber] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentProduct]);

    // Handle voice input end
    useEffect(() => {
        if (!isListening && transcript) {
            handleUserMessage(transcript);
        }
    }, [isListening, transcript]);

    const handleUserMessage = async (text: string) => {
        if (!text.trim()) return;

        setIsProcessing(true);

        // Add user message
        const userMsg: Message = { id: Date.now().toString(), text, isUser: true };
        setMessages(prev => [...prev, userMsg]);

        // Process intent (Gemini AI)
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            // Use the AI's reply directly
            addBotMessage(data.reply);

            if (data.intent === 'SEARCH' && data.product) {
                const product = await searchMeituan(data.product);
                if (product) {
                    setCurrentProduct(product);
                }
            } else if (data.intent === 'CONFIRM') {
                if (currentProduct) {
                    const result = await placeOrderMeituan(currentProduct);
                    addBotMessage(`好的！正在为您打开美团外卖...`);
                    window.location.href = result.deepLink;
                    setCurrentProduct(null);
                }
            }
        } catch (error) {
            console.error(error);
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
        <div className="flex flex-col h-[80vh] max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
            {/* User Profile */}
            <UserProfile user={user} onLogout={onLogout} />

            {/* Header */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-center relative">
                <h1 className="font-semibold text-zinc-900 dark:text-white">咖啡助理 (Coffee AI)</h1>
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
                            onConfirm={() => {
                                setShowCheckout(true);
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
                    ) : isListening ? '正在听...' : isProcessing ? '思考中...' : '点击说话'}
                </div>
                <VoiceOrb isListening={isListening} onClick={toggleListening} />
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
            {showSuccess && currentProduct && (
                <OrderSuccess
                    product={currentProduct}
                    orderNumber={orderNumber}
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
