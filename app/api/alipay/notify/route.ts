import * as AlipaySdk from 'alipay-sdk';
import { NextResponse } from 'next/server';
import { ALIPAY_CONFIG } from '@/lib/alipay/config';

// 支付宝异步通知处理
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    
    // 将 FormData 转换为对象
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log('支付宝回调参数:', params);

    // 验证签名
    const sdk = new (AlipaySdk as any).default({
      appId: ALIPAY_CONFIG.appId,
      alipayPublicKey: ALIPAY_CONFIG.alipayPublicKey,
    });

    const isValid = sdk.checkNotifySign(params);

    if (!isValid) {
      console.error('支付宝回调签名验证失败');
      return new Response('fail', { status: 200 });
    }

    // 签名验证成功，处理业务逻辑
    const {
      trade_status,
      out_trade_no,
      trade_no,
      total_amount,
      buyer_id,
    } = params;

    console.log('支付宝回调验证成功:', {
      trade_status,
      out_trade_no,
      trade_no,
      total_amount,
    });

    // 根据交易状态处理业务逻辑
    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      // TODO: 更新订单状态为已支付
      // 例如：await updateOrderStatus(out_trade_no, 'paid', trade_no);
      console.log(`订单 ${out_trade_no} 支付成功`);
    }

    // 返回成功响应给支付宝
    return new Response('success', { status: 200 });
  } catch (error) {
    console.error('处理支付宝回调失败:', error);
    return new Response('fail', { status: 200 });
  }
}
