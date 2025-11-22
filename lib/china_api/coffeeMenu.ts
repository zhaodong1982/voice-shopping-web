import { Product } from '@/components/ProductCard';

export const COFFEE_MENU: Product[] = [
    // Luckin Coffee (瑞幸咖啡)
    {
        id: 'luckin-1',
        name: '生椰拿铁 (Raw Coconut Latte)',
        price: 18.00,
        description: '瑞幸爆款，鲜萃浓缩咖啡搭配优质生椰乳。',
        image: 'luckin'
    },
    {
        id: 'luckin-2',
        name: '酱香拿铁 (Sauce Flavored Latte)',
        price: 19.00,
        description: '茅台联名，酱香浓郁，回味悠长。',
        image: 'luckin'
    },
    {
        id: 'luckin-3',
        name: '标准美式 (Americano)',
        price: 13.00,
        description: '经典黑咖，提神醒脑。',
        image: 'luckin'
    },

    // Starbucks (星巴克)
    {
        id: 'sbux-1',
        name: '拿铁 (Caffè Latte)',
        price: 30.00,
        description: '星巴克经典，浓缩咖啡与蒸奶的完美融合。',
        image: 'starbucks'
    },
    {
        id: 'sbux-2',
        name: '焦糖玛奇朵 (Caramel Macchiato)',
        price: 34.00,
        description: '香草糖浆、蒸奶、浓缩咖啡与焦糖酱的层层叠加。',
        image: 'starbucks'
    },
    {
        id: 'sbux-3',
        name: '星冰乐 (Frappuccino)',
        price: 36.00,
        description: '夏日必选，冰爽口感。',
        image: 'starbucks'
    }
];
