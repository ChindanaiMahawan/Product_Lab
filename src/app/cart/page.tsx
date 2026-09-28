"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import ProductCart from "@/components/ProductCart";

export default function CartPage() {
    const { cartItems, removeFromCart } = useCart();

    return (
        <main>
            <Link href="/">กลับหน้ารายการสินค้า</Link>
            <ProductCart items={cartItems} onRemove={removeFromCart} />
        </main>
    );
}