import React from 'react';
import { Package, CheckCircle } from 'lucide-react';

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
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl max-w-sm w-full border border-zinc-100 dark:border-zinc-700 transition-all animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${isGenericSearch ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    {isGenericSearch ? (
                        <span className="text-2xl">🔍</span>
                    ) : (
                        <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    )}
                </div>
                {!isGenericSearch && (
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                        ¥{product.price.toFixed(2)}
                    </span>
                )}
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{product.name}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">{product.description}</p>

            {!isGenericSearch ? (
                <>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                        <CheckCircle className="w-4 h-4" />
                        <span>库存充足 (In Stock)</span>
                    </div>
                    <button
                        onClick={onConfirm}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 active:scale-95"
                    >
                        立即购买 (Buy Now)
                    </button>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-sm font-medium bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                        <span>点击下方按钮前往美团搜索</span>
                    </div>
                    <button
                        onClick={onConfirm}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 active:scale-95"
                    >
                        前往美团搜索 (Search on Meituan)
                    </button>
                </>
            )}
        </div>
    );
}
