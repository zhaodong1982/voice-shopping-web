import React from 'react';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string;
}

interface ProductCardProps {
    product: Product;
    onConfirm?: () => void;
}

export function ProductCard({ product, onConfirm }: ProductCardProps) {
    const isGenericSearch = product.id === 'generic-search';

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full border border-zinc-200 dark:border-zinc-800">
            {/* Product Info */}
            <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-medium text-zinc-900 dark:text-white">
                        {product.name}
                    </h3>
                    {!isGenericSearch && (
                        <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                            ¥{product.price.toFixed(2)}
                        </span>
                    )}
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {product.description}
                </p>
            </div>

            {/* Action Button */}
            <button
                onClick={onConfirm}
                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
            >
                {isGenericSearch ? '前往搜索' : '立即购买'}
            </button>
        </div>
    );
}
