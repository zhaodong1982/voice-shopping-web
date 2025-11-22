'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AlipayCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 从 URL 参数获取支付结果
    const urlParams = new URLSearchParams(window.location.search);
    const outTradeNo = urlParams.get('out_trade_no');
    const tradeNo = urlParams.get('trade_no');

    if (outTradeNo && tradeNo) {
      // 验证支付结果
      verifyPayment(outTradeNo);
    } else {
      setStatus('failed');
      setMessage('缺少必要的支付参数');
    }
  }, []);

  const verifyPayment = async (outTradeNo: string) => {
    try {
      const response = await fetch(`/api/alipay/pay?outTradeNo=${outTradeNo}`);
      const data = await response.json();

      if (data.success && (data.tradeStatus === 'TRADE_SUCCESS' || data.tradeStatus === 'TRADE_FINISHED')) {
        setStatus('success');
        setMessage('支付成功！');
        
        // 3秒后跳转回首页
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setStatus('failed');
        setMessage('支付未完成或失败');
      }
    } catch (error) {
      console.error('验证支付失败:', error);
      setStatus('failed');
      setMessage('验证支付状态失败');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        {status === 'checking' ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">正在验证支付...</h2>
            <p className="text-zinc-500 dark:text-zinc-400">请稍候</p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">支付成功！</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{message}</p>
            <p className="text-sm text-zinc-400">即将返回首页...</p>
          </>
        ) : (
          <>
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">支付失败</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all"
            >
              返回首页
            </button>
          </>
        )}
      </div>
    </div>
  );
}
