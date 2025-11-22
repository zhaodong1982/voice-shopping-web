import { Product } from '@/components/ProductCard';

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Organic Whole Milk',
        price: 5.99,
        description: 'Fresh organic whole milk, 1 gallon. Sourced from local farms.',
    },
    {
        id: '2',
        name: 'Large Brown Eggs',
        price: 4.49,
        description: 'Free-range large brown eggs, one dozen.',
    },
    {
        id: '3',
        name: 'Honeycrisp Apples',
        price: 3.99,
        description: 'Sweet and crisp Honeycrisp apples, 1lb bag.',
    },
    {
        id: '4',
        name: 'Sourdough Bread',
        price: 6.50,
        description: 'Artisan sourdough loaf, freshly baked this morning.',
    },
    {
        id: '5',
        name: 'Sparkling Water',
        price: 8.99,
        description: 'Lemon flavored sparkling water, 12-pack cans.',
    }
];

export function searchProducts(query: string): Product | null {
    const lowerQuery = query.toLowerCase();
    return MOCK_PRODUCTS.find(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    ) || null;
}
