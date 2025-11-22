import { Product } from '@/components/ProductCard';
import { COFFEE_MENU } from './coffeeMenu';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchMeituan(query: string): Promise<Product | null> {
    await delay(500); // Network delay

    // Keyword matching for Chinese
    const match = COFFEE_MENU.find(p =>
        p.name.includes(query) ||
        p.description.includes(query) ||
        (query.includes('拿铁') && p.name.includes('拿铁')) ||
        (query.includes('美式') && p.name.includes('美式')) ||
        (query.includes('瑞幸') && p.id.startsWith('luckin')) ||
        (query.includes('星巴克') && p.id.startsWith('sbux'))
    );

    if (match) return match;

    // Fallback: Generic Search Result
    return {
        id: 'generic-search',
        name: `在美团搜索 "${query}"`,
        price: 0,
        description: '点击下方按钮前往美团外卖APP搜索此商品',
        image: 'meituan-logo' // We'll need to handle this in ProductCard
    };
}

export async function placeOrderMeituan(product: Product): Promise<{ success: boolean, eta: string, deepLink: string }> {
    await delay(800); // Processing

    // Generate Deep Link
    // Use HTTPS link that works everywhere
    // Format: https://waimai.meituan.com/search/{query}

    const encodedQuery = encodeURIComponent(product.name);

    // Try to use app deep link first, with HTTPS fallback
    // On mobile, this will open the app if installed, otherwise opens in browser
    const deepLink = `https://waimai.meituan.com/search/${encodedQuery}`;

    return {
        success: true,
        eta: '30分钟',
        deepLink: deepLink
    };
}
