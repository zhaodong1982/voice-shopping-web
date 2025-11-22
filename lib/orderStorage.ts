import { saveToStorage, getFromStorage, removeFromStorage } from './storage';
import { Product } from '@/components/ProductCard';
import { OrderData } from '@/components/CheckoutModal';

export interface Order {
    orderId: string;
    product: Product;
    orderData: OrderData;
    timestamp: number;
    status: 'pending' | 'completed' | 'cancelled';
}

const ORDER_HISTORY_KEY = 'order_history';
const MAX_ORDERS = 50;

export function saveOrder(order: Order): void {
    const history = getOrderHistory();
    history.unshift(order); // 最新的在前面

    // 限制最多保存 50 条
    if (history.length > MAX_ORDERS) {
        history.splice(MAX_ORDERS);
    }

    saveToStorage(ORDER_HISTORY_KEY, history);
}

export function getOrderHistory(): Order[] {
    return getFromStorage<Order[]>(ORDER_HISTORY_KEY) || [];
}

export function getOrderById(orderId: string): Order | null {
    const history = getOrderHistory();
    return history.find(order => order.orderId === orderId) || null;
}

export function updateOrderStatus(orderId: string, status: Order['status']): void {
    const history = getOrderHistory();
    const order = history.find(o => o.orderId === orderId);

    if (order) {
        order.status = status;
        saveToStorage(ORDER_HISTORY_KEY, history);
    }
}

export function clearOrderHistory(): void {
    removeFromStorage(ORDER_HISTORY_KEY);
}

export function getOrderStats() {
    const history = getOrderHistory();
    return {
        total: history.length,
        completed: history.filter(o => o.status === 'completed').length,
        pending: history.filter(o => o.status === 'pending').length,
        cancelled: history.filter(o => o.status === 'cancelled').length,
    };
}
