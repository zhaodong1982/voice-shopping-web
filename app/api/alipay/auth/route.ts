import * as AlipaySdk from 'alipay-sdk';
import { NextResponse } from 'next/server';
import { ALIPAY_CONFIG, validateAlipayConfig } from '@/lib/alipay/config';

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

// 生成支付宝授权登录 URL
export async function GET(req: Request) {
  try {
    const validation = validateAlipayConfig();
    if (!validation.isValid) {
      return NextResponse.json({
        error: '支付宝配置不完整',
        missing: validation.missing,
        message: '请在 .env.local 中配置 ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, ALIPAY_PUBLIC_KEY'
      }, { status: 500 });
    }

    const sdk = getAlipaySdk();
    
    // 生成授权 URL
    const authUrl = sdk.generatePageUrl('alipay.system.oauth.token', {
      scope: 'auth_user',
      redirect_uri: ALIPAY_CONFIG.returnUrl,
    });

    return NextResponse.json({
      authUrl,
      success: true,
    });
  } catch (error) {
    console.error('支付宝授权 URL 生成失败:', error);
    return NextResponse.json({
      error: '生成授权链接失败',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

// 处理授权回调，获取用户信息
export async function POST(req: Request) {
  try {
    const { authCode } = await req.json();

    if (!authCode) {
      return NextResponse.json({
        error: '缺少授权码'
      }, { status: 400 });
    }

    const sdk = getAlipaySdk();

    // 1. 使用 authCode 换取 access_token
    const tokenResult = await sdk.exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code: authCode,
    });

    if (!tokenResult.accessToken) {
      throw new Error('获取 access token 失败');
    }

    const { accessToken, userId } = tokenResult;

    // 2. 使用 access_token 获取用户信息
    const userInfoResult = await sdk.exec('alipay.user.info.share', {}, {
      authToken: accessToken,
    });

    return NextResponse.json({
      success: true,
      userId: userId,
      userInfo: {
        userId: userId,
        nickName: userInfoResult.nickName || '支付宝用户',
        avatar: userInfoResult.avatar || '💙',
        gender: userInfoResult.gender,
        city: userInfoResult.city,
        province: userInfoResult.province,
      },
      accessToken,
    });
  } catch (error) {
    console.error('支付宝授权失败:', error);
    return NextResponse.json({
      error: '授权失败',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
