import { Product } from '@/components/ProductCard';
import { COFFEE_MENU } from './coffeeMenu';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成美团搜索链接 - 同时返回APP和Web链接
function generateMeituanUrls(keyword: string): { appLink: string; webLink: string; mobileWebLink: string } {
    const encodedKeyword = encodeURIComponent(keyword);

    return {
        // APP Deep Link - 移动端优先
        appLink: `imeituan://www.meituan.com/search?keyword=${keyword}`,
        // Web Link - 桌面端
        webLink: `https://waimai.meituan.com/?keyword=${encodedKeyword}#/search`,
        // Mobile Web Link - 移动端网页兜底 (只能去首页)
        mobileWebLink: `https://h5.waimai.meituan.com/waimai/mindex/home`
    };
}

export async function searchMeituan(query: string): Promise<Product> {
    await delay(500); // Network delay
    console.log('searchMeituan called with:', query);
    await delay(1000); // Simulate API call

    // Check for specific keywords
    const match = COFFEE_MENU.find(p =>
        p.name.includes(query) || query.includes(p.name)
    );

    if (match) {
        console.log('Found specific match:', match);
        return match;
    }

    // Fallback: Generic Search Result with both URLs
    console.log('Generating generic search result for:', query);
    const { appLink, webLink, mobileWebLink } = generateMeituanUrls(query);

    // Store all URLs in the image field as JSON
    const urlData = JSON.stringify({ appLink, webLink, mobileWebLink, keyword: query });

    const result = {
        id: 'generic-search',
        name: `在美团搜索 "${query}"`,
        price: 0,
        description: '点击下方按钮打开美团APP搜索 (未安装将跳转首页)',
        image: urlData // Store URL data as JSON
    };
    console.log('Returning generic result:', result);
    return result;
}

export async function placeOrderMeituan(product: Product): Promise<{ success: boolean, eta: string, deepLink: string, webLink?: string, mobileWebLink?: string }> {
    await delay(800); // Processing

    // For generic search products, parse the stored URL data
    if (product.id === 'generic-search' && product.image) {
        try {
            const urlData = JSON.parse(product.image);
            return {
                success: true,
                eta: '30分钟',
                deepLink: urlData.appLink,
                webLink: urlData.webLink,
                mobileWebLink: urlData.mobileWebLink
            };
        } catch {
            // Fallback if parsing fails
            const { appLink, webLink, mobileWebLink } = generateMeituanUrls(product.name);
            return {
                success: true,
                eta: '30分钟',
                deepLink: appLink,
                webLink: webLink,
                mobileWebLink: mobileWebLink
            };
        }
    }

    // For regular products, generate URLs
    const { appLink, webLink, mobileWebLink } = generateMeituanUrls(product.name);

    return {
        success: true,
        eta: '30分钟',
        deepLink: appLink,
        webLink: webLink,
        mobileWebLink: mobileWebLink
    };
}
