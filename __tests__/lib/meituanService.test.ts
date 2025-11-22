import { searchMeituan, placeOrderMeituan } from '@/lib/china_api/meituanService';

describe('Meituan Service', () => {
    describe('searchMeituan', () => {
        it('should find product by name', async () => {
            const result = await searchMeituan('生椰拿铁');

            expect(result).toBeDefined();
            expect(result?.name).toContain('生椰拿铁');
        });

        it('should find product by brand (瑞幸)', async () => {
            const result = await searchMeituan('瑞幸');

            expect(result).toBeDefined();
            expect(result?.id).toContain('luckin');
        });

        it('should find product by brand (星巴克)', async () => {
            const result = await searchMeituan('星巴克');

            expect(result).toBeDefined();
            expect(result?.id).toContain('sbux');
        });

        it('should return generic search for unknown product', async () => {
            const result = await searchMeituan('汉堡');

            expect(result).toBeDefined();
            expect(result?.id).toBe('generic-search');
            expect(result?.name).toContain('汉堡');
        });

        it('should handle empty query', async () => {
            const result = await searchMeituan('');

            expect(result).toBeDefined();
        });
    });

    describe('placeOrderMeituan', () => {
        it('should generate order with deep link', async () => {
            const product = {
                id: 'test-product',
                name: '测试商品',
                price: 25.0,
                description: '测试描述',
            };

            const result = await placeOrderMeituan(product);

            expect(result.success).toBe(true);
            expect(result.eta).toBe('30分钟');
            expect(result.deepLink).toContain(encodeURIComponent(product.name));
        });

        it('should handle special characters in product name', async () => {
            const product = {
                id: 'test',
                name: '特殊字符 & 符号',
                price: 20.0,
                description: '测试',
            };

            const result = await placeOrderMeituan(product);

            expect(result.deepLink).toContain(encodeURIComponent(product.name));
        });
    });
});
