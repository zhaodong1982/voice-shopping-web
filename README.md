This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎉 Features

- 🎤 **语音交互** - 支持中文语音输入和语音播报
- 🤖 **AI 对话** - 集成 Google Gemini AI 智能理解用户意图
- 💳 **支付宝登录** - 真实支付宝授权登录
- 💰 **支付宝支付** - 真实支付宝网站支付功能
- ☕ **咖啡订购** - 支持瑞幸、星巴克等品牌
- 📦 **美团集成** - 跳转美团外卖完成订单

## Getting Started

First, copy the environment variables example file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
- Google Gemini API key
- Alipay credentials (see [ALIPAY_SETUP.md](./ALIPAY_SETUP.md) for detailed setup)

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
