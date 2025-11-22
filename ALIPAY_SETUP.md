# 支付宝集成配置指南

本项目已集成真实的支付宝登录和支付功能。以下是完整的配置步骤。

## 功能说明

✅ **已实现功能**：
- 支付宝授权登录
- 支付宝网站支付（电脑网站支付）
- 支付回调验证
- 订单查询

## 配置步骤

### 1. 注册支付宝开放平台账号

1. 访问 [支付宝开放平台](https://open.alipay.com/)
2. 注册并登录账号
3. 实名认证（企业或个人）

### 2. 创建应用

1. 在控制台创建"网页&移动应用"
2. 选择"网页应用"
3. 填写应用信息（名称、图标、简介等）
4. 提交审核（审核通过后才能使用）

### 3. 配置应用能力

在应用详情页面，添加以下能力：
- **获取会员信息** (alipay.user.info.share)
- **网站支付** (alipay.trade.page.pay)
- **用户授权** (alipay.system.oauth.token)

### 4. 生成密钥

#### 使用支付宝提供的工具生成密钥对：

1. 下载 [支付宝密钥生成器](https://opendocs.alipay.com/common/02kipl)
2. 选择 **RSA2(SHA256)密钥** （推荐）
3. 生成密钥对后：
   - **应用私钥**：保存到本地，配置到 `.env.local`
   - **应用公钥**：上传到支付宝开放平台

4. 上传应用公钥后，支付宝会生成**支付宝公钥**，复制保存

### 5. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的配置：

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# 支付宝配置
ALIPAY_APP_ID=你的应用APPID
ALIPAY_PRIVATE_KEY=你的应用私钥（完整的，包含头尾）
ALIPAY_PUBLIC_KEY=支付宝公钥（从开放平台获取）

# 开发环境使用沙箱
ALIPAY_GATEWAY=https://openapi.alipaydev.com/gateway.do

# 生产环境使用正式网关
# ALIPAY_GATEWAY=https://openapi.alipay.com/gateway.do

# 回调地址（需要是公网可访问的地址）
ALIPAY_RETURN_URL=http://localhost:3000/alipay/callback
ALIPAY_NOTIFY_URL=http://localhost:3000/api/alipay/notify
```

### 6. 密钥格式说明

**应用私钥格式**（完整的包含头尾）：
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...完整的私钥内容...
-----END PRIVATE KEY-----
```

**支付宝公钥格式**：
```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
...完整的公钥内容...
-----END PUBLIC KEY-----
```

⚠️ **注意**：
- 私钥需要包含 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`
- 可以将多行合并为一行（去除换行符）
- 或者保持多行格式，在 `.env.local` 中使用引号包裹

### 7. 使用沙箱环境测试

支付宝提供沙箱环境用于测试：

1. 访问 [沙箱环境](https://open.alipay.com/develop/sandbox/app)
2. 获取沙箱账号和 APPID
3. 使用沙箱网关：`https://openapi.alipaydev.com/gateway.do`
4. 下载"支付宝沙箱版"APP 进行扫码测试

### 8. 配置回调地址

在支付宝开放平台，配置以下地址：

- **授权回调地址**：`http://yourdomain.com/alipay/callback`
- **网关地址**：由系统配置

⚠️ **本地开发注意**：
- 回调地址需要公网可访问
- 可以使用 ngrok 等工具将本地服务映射到公网
- 或者部署到测试服务器进行测试

### 9. 运行项目

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 使用流程

### 登录流程

1. 用户点击"支付宝登录"按钮
2. 跳转到支付宝授权页面
3. 用户扫码/登录授权
4. 回调返回，获取用户信息
5. 登录成功，进入应用

### 支付流程

1. 用户选择咖啡产品
2. 确认订单信息
3. 选择"支付宝"支付方式
4. 跳转到支付宝收银台
5. 扫码支付
6. 支付完成，回调验证
7. 显示订单成功

## API 接口说明

### 登录相关

- `GET /api/alipay/auth` - 生成授权登录链接
- `POST /api/alipay/auth` - 处理授权回调，获取用户信息

### 支付相关

- `POST /api/alipay/pay` - 创建支付订单
- `GET /api/alipay/pay` - 查询订单状态
- `POST /api/alipay/notify` - 支付异步通知（支付宝服务器调用）

## 常见问题

### Q1: 授权登录失败
- 检查 APPID 是否正确
- 检查应用是否已上线或使用沙箱环境
- 检查密钥格式是否正确

### Q2: 支付跳转失败
- 检查应用是否添加"网站支付"能力
- 检查网关地址是否正确（沙箱/正式）
- 检查订单金额格式（必须是字符串，保留两位小数）

### Q3: 回调验证失败
- 检查支付宝公钥是否正确
- 检查回调地址是否可访问
- 查看服务器日志获取详细错误

### Q4: 本地测试回调问题
- 使用 ngrok: `ngrok http 3000`
- 将 ngrok 生成的地址配置到 `ALIPAY_RETURN_URL` 和 `ALIPAY_NOTIFY_URL`

## 生产环境部署

部署到生产环境时：

1. ✅ 使用正式的 APPID 和密钥（不是沙箱）
2. ✅ 修改网关为正式网关：`https://openapi.alipay.com/gateway.do`
3. ✅ 配置公网可访问的回调地址
4. ✅ 确保应用已审核通过并上线
5. ✅ 在支付宝开放平台配置正确的授权回调地址

## 安全提示

⚠️ **重要**：
- 不要将私钥提交到代码仓库
- `.env.local` 已添加到 `.gitignore`
- 生产环境使用环境变量管理密钥
- 定期更换密钥
- 验证支付回调签名，防止伪造

## 技术支持

- [支付宝开放平台文档](https://opendocs.alipay.com/)
- [SDK 文档](https://github.com/alipay/alipay-sdk-nodejs-all)
- [常见问题](https://opendocs.alipay.com/support/01rg8k)

---

配置完成后，你的应用就支持真实的支付宝登录和支付功能了！🎉
