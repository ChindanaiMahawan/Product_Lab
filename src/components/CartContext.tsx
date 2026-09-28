"use client";

import {createContext,useContext,useState,type ReactNode } from "react";
import type { Product } from "@/lib/products";

type CartContextValue = {
    cartItems: Product[];
    toggleCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<Product[]>([]);

    // เดิมคือ handleToggleCart ใน ProductExplorer ย้ายมาไว้ตรงกลางที่นี่แทน
    function toggleCart(product: Product) {
        setCartItems((prevItems) =>
            prevItems.some((item) => item.id === product.id)
                ? prevItems.filter((item) => item.id !== product.id)
                : [...prevItems, product]
        );
    }

    function removeFromCart(id: number) {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }

    return (
        <CartContext.Provider value={{ cartItems, toggleCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

// เพิ่ม: hook ให้หน้าไหนก็ตามเรียก useCart() แล้วเข้าถึงตะกร้าเดียวกันได้ทันที
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart ต้องถูกเรียกภายใน <CartProvider> เท่านั้น");
    }
    return context;
}