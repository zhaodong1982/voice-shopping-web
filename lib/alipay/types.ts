// 支付宝用户信息
export interface AlipayUserInfo {
  userId: string;
  avatar?: string;
  nickName?: string;
  gender?: string;
  city?: string;
  province?: string;
}

// 支付宝授权响应
export interface AlipayAuthResponse {
  authCode: string;
  userId: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

// 支付宝支付订单参数
export interface AlipayTradePagePayParams {
  outTradeNo: string;      // 商户订单号
  totalAmount: string;     // 订单金额（元）
  subject: string;         // 订单标题
  body?: string;           // 订单描述
  productCode: string;     // 产品码，固定值 FAST_INSTANT_TRADE_PAY
}

// 支付宝支付响应
export interface AlipayTradePayResponse {
  code: string;
  msg: string;
  outTradeNo: string;
  tradeNo: string;
  totalAmount: string;
}

// 支付宝回调参数
export interface AlipayNotifyParams {
  notify_time: string;
  notify_type: string;
  notify_id: string;
  app_id: string;
  charset: string;
  version: string;
  sign_type: string;
  sign: string;
  trade_no: string;
  out_trade_no: string;
  out_biz_no?: string;
  buyer_id: string;
  seller_id: string;
  trade_status: string;
  total_amount: string;
  receipt_amount?: string;
  invoice_amount?: string;
  buyer_pay_amount?: string;
  point_amount?: string;
  refund_fee?: string;
  subject: string;
  body?: string;
  gmt_create: string;
  gmt_payment: string;
  gmt_refund?: string;
  gmt_close?: string;
  fund_bill_list?: string;
  passback_params?: string;
  voucher_detail_list?: string;
}
