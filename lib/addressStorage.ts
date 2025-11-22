import { saveToStorage, getFromStorage, removeFromStorage } from './storage';
import { OrderData } from '@/components/CheckoutModal';

export interface SavedAddress extends Omit<OrderData, 'paymentMethod'> {
    id: string;
    isDefault: boolean;
    label?: string; // 家、公司等
}

const ADDRESS_KEY = 'saved_addresses';
const MAX_ADDRESSES = 10;

export function saveAddress(address: Omit<SavedAddress, 'id'>): SavedAddress {
    const addresses = getSavedAddresses();

    const newAddress: SavedAddress = {
        ...address,
        id: Date.now().toString(),
    };

    // 如果是默认地址，取消其他地址的默认状态
    if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
    }

    addresses.unshift(newAddress);

    // 限制最多保存 10 个地址
    if (addresses.length > MAX_ADDRESSES) {
        addresses.splice(MAX_ADDRESSES);
    }

    saveToStorage(ADDRESS_KEY, addresses);
    return newAddress;
}

export function getSavedAddresses(): SavedAddress[] {
    return getFromStorage<SavedAddress[]>(ADDRESS_KEY) || [];
}

export function getDefaultAddress(): SavedAddress | null {
    const addresses = getSavedAddresses();
    return addresses.find(addr => addr.isDefault) || addresses[0] || null;
}

export function getAddressById(id: string): SavedAddress | null {
    const addresses = getSavedAddresses();
    return addresses.find(addr => addr.id === id) || null;
}

export function updateAddress(id: string, updates: Partial<SavedAddress>): void {
    const addresses = getSavedAddresses();
    const index = addresses.findIndex(addr => addr.id === id);

    if (index !== -1) {
        // 如果设置为默认，取消其他地址的默认状态
        if (updates.isDefault) {
            addresses.forEach(addr => addr.isDefault = false);
        }

        addresses[index] = { ...addresses[index], ...updates };
        saveToStorage(ADDRESS_KEY, addresses);
    }
}

export function deleteAddress(id: string): void {
    const addresses = getSavedAddresses();
    const filtered = addresses.filter(addr => addr.id !== id);
    saveToStorage(ADDRESS_KEY, filtered);
}

export function clearAllAddresses(): void {
    removeFromStorage(ADDRESS_KEY);
}
