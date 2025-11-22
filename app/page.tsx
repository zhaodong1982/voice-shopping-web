'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LoginPage } from '@/components/LoginPage';
import { WeChatAuth } from '@/components/WeChatAuth';
import { getUser, saveUser, logout, User } from '@/lib/auth';

const ChatInterface = dynamic(
  () => import('@/components/ChatInterface').then(mod => ({ default: mod.ChatInterface })),
  { ssr: false }
);

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const existingUser = getUser();
    setUser(existingUser);
    setIsLoading(false);
  }, []);

  const handleLoginClick = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = (userData: { userId: string; nickname: string; avatar: string }) => {
    const newUser: User = {
      ...userData,
      loginTime: Date.now(),
    };
    saveUser(newUser);
    setUser(newUser);
    setShowAuth(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-black flex items-center justify-center">
        <div className="text-4xl">☕</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLoginClick} />
        {showAuth && <WeChatAuth onSuccess={handleAuthSuccess} />}
      </>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-black p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <ChatInterface user={user} onLogout={handleLogout} />
      </div>
    </main>
  );
}
