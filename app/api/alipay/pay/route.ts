import * as AlipaySdk from 'alipay-sdk';
import { NextResponse } from 'next/server';
import { ALIPAY_CONFIG, validateAlipayConfig } from '@/lib/alipay/config';
import type { AlipayTradePagePayParams } from '@/lib/alipay/types';

// 初始化支付宝 SDK
let alipaySdk: any | null = null;

function getAlipaySdk() {
  if (!alipaySdk) {
    const validation = validateAlipayConfig();
    if (!validation.isValid) {
      throw new Error(`支付宝配置不完整，缺少: ${validation.missing.join(', ')}`);
    }
    
    alipaySdk = new (AlipaySdk as any).default({
      appId: ALIPAY_CONFIG.appId,
      privateKey: ALIPAY_CONFIG.privateKey,
      alipayPublicKey: ALIPAY_CONFIG.alipayPublicKey,
      gateway: ALIPAY_CONFIG.gateway,
      charset: ALIPAY_CONFIG.charset,
      signType: ALIPAY_CONFIG.signType,
    });
  }
  return alipaySdk;
}

// 创建支付订单
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { outTradeNo, totalAmount, subject, body: orderBody } = body as AlipayTradePagePayParams;

    if (!outTradeNo || !totalAmount || !subject) {
      return NextResponse.json({
        error: '缺少必要参数',
        message: '需要提供 outTradeNo, totalAmount, subject'
      }, { status: 400 });
    }

    const validation = validateAlipayConfig();
    if (!validation.isValid) {
      return NextResponse.json({
        error: '支付宝配置不完整',
        missing: validation.missing,
        message: '请在 .env.local 中配置 ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, ALIPAY_PUBLIC_KEY'
      }, { status: 500 });
    }

    const sdk = getAlipaySdk();

    // 使用电脑网站支付接口
    const formData = await sdk.pageExec('alipay.trade.page.pay', {
      notifyUrl: ALIPAY_CONFIG.notifyUrl,
      returnUrl: ALIPAY_CONFIG.returnUrl,
      bizContent: {
        outTradeNo,
        productCode: 'FAST_INSTANT_TRADE_PAY',
        totalAmount,
        subject,
        body: orderBody || subject,
      },
    });

    // 返回支付表单 HTML
    return NextResponse.json({
      success: true,
      formData,
      outTradeNo,
    });
  } catch (error) {
    console.error('创建支付订单失败:', error);
    return NextResponse.json({
      error: '创建支付订单失败',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

// 查询支付订单状态
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const outTradeNo = searchParams.get('outTradeNo');

    if (!outTradeNo) {
      return NextResponse.json({
        error: '缺少订单号'
      }, { status: 400 });
    }

    const sdk = getAlipaySdk();

    // 查询订单
    const result = await sdk.exec('alipay.trade.query', {
      bizContent: {
        outTradeNo,
      },
    });

    return NextResponse.json({
      success: true,
      tradeStatus: result.tradeStatus,
      totalAmount: result.totalAmount,
      tradeNo: result.tradeNo,
      buyerLogonId: result.buyerLogonId,
    });
  } catch (error) {
    console.error('查询订单失败:', error);
    return NextResponse.json({
      error: '查询订单失败',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
