// 支付宝配置
export const ALIPAY_CONFIG = {
  // 应用ID - 从支付宝开放平台获取
  appId: process.env.ALIPAY_APP_ID || '',

  // 应用私钥 - 从支付宝开放平台生成
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',

  // 支付宝公钥 - 从支付宝开放平台获取
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',

  // 网关地址 - 默认为沙箱环境
  gateway: process.env.ALIPAY_GATEWAY || 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',

  // 回调地址
  returnUrl: process.env.ALIPAY_RETURN_URL || 'http://localhost:3000/alipay/callback',
  notifyUrl: process.env.ALIPAY_NOTIFY_URL || 'http://localhost:3000/api/alipay/notify',

  // 其他配置
  charset: 'utf-8' as 'utf-8',
  signType: 'RSA2' as 'RSA2',
  version: '1.0',
};

// Log current environment
console.log('Alipay Config Loaded:', {
  gateway: ALIPAY_CONFIG.gateway,
  appId: ALIPAY_CONFIG.appId ? 'Set' : 'Not Set',
  mode: ALIPAY_CONFIG.gateway.includes('sandbox') ? 'SANDBOX' : 'PRODUCTION'
});

// 验证配置是否完整
export function validateAlipayConfig(): { isValid: boolean; missing: string[] } {
  const required = ['appId', 'privateKey', 'alipayPublicKey'];
  const missing = required.filter(key => !ALIPAY_CONFIG[key as keyof typeof ALIPAY_CONFIG]);

  return {
    isValid: missing.length === 0,
    missing,
  };
}
