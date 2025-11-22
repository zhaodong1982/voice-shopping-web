import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AlipayAuthProps {
  onSuccess: (userData: { userId: string; nickname: string; avatar: string }) => void;
  onCancel?: () => void;
}

export function AlipayAuth({ onSuccess, onCancel }: AlipayAuthProps) {
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 检查是否从支付宝回调返回
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('auth_code');

    if (authCode) {
      // 已经获得授权码，调用后端获取用户信息
      handleAuthCallback(authCode);
    } else {
      // 生成支付宝授权登录 URL
      initiateAlipayAuth();
    }
  }, []);

  const initiateAlipayAuth = async () => {
    try {
      const response = await fetch('/api/alipay/auth', {
        method: 'GET',
      });

      const data = await response.json();

      if (data.error) {
        setStatus('error');
        setErrorMessage(data.message || '获取授权链接失败');
        return;
      }

      // 跳转到支付宝授权页面
      setStatus('redirecting');
      setTimeout(() => {
        window.location.href = data.authUrl;
      }, 1500);
    } catch (error) {
      console.error('支付宝授权失败:', error);
      setStatus('error');
      setErrorMessage('网络错误，请稍后重试');
    }
  };

  const handleAuthCallback = async (authCode: string) => {
    try {
      const response = await fetch('/api/alipay/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authCode }),
      });

      const data = await response.json();

      if (data.error) {
        setStatus('error');
        setErrorMessage(data.message || '授权失败');
        return;
      }

      // 授权成功
      setStatus('success');
      setTimeout(() => {
        onSuccess({
          userId: data.userInfo.userId,
          nickname: data.userInfo.nickName,
          avatar: data.userInfo.avatar,
        });
      }, 1000);
    } catch (error) {
      console.error('处理支付宝授权回调失败:', error);
      setStatus('error');
      setErrorMessage('处理授权失败');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-in slide-in-from-bottom-4">
        {status === 'loading' || status === 'redirecting' ? (
          <>
            {/* Alipay Logo */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-5xl">💙</span>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">支付宝授权登录</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Alipay Authorization</p>
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

            {/* Status */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {status === 'loading' ? '正在准备...' : '正在跳转到支付宝...'}
                </p>
              </div>
            </div>
          </>
        ) : status === 'success' ? (
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
        ) : (
          <>
            {/* Error */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">授权失败</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{errorMessage}</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all"
                >
                  重试
                </button>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="flex-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white font-medium py-3 px-4 rounded-xl transition-all"
                  >
                    取消
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
