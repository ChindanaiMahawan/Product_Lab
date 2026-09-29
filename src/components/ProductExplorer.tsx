"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { defaultQuery, fetchProducts } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";
import { useCart } from "./CartContext";
import ProductCard from "./ProductCard";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";

type LoadState = "loading" | "error" | "ready";

type Props = {
    isLoggedIn: boolean;
    // ปุ่ม login/logout จาก server component
    authButtons: ReactNode;
};

export default function ProductExplorer({ isLoggedIn, authButtons }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<LoadState>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const { cartItems, toggleCart } = useCart();

    function saveProduct(draft: ProductDraft) {
        setProducts([
            ...products,
            {
                ...draft,
                id: Date.now(),
                images: [],
                availabilityStatus: "In Stock",
            },
        ]);
    }

    function showResult(list: ProductList) {
        setProducts(list.products);
        setStatus("ready");
    }

    function showError(error: unknown) {
        console.error("เกิดข้อผิดพลาด:", error);
        setErrorMessage(
            error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
        );
        setStatus("error");
    }

    useEffect(() => {
        fetchProducts(defaultQuery).then(showResult).catch(showError);
    }, []);

    async function loadProducts(query: SearchQuery) {
        setStatus("loading");
        setErrorMessage("");

        try {
            showResult(await fetchProducts(query));
        } catch (error) {
            showError(error);
        }
    }

    return (
        <main className="mx-auto min-h-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-stone-900">
                        รายการสินค้า
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">
                        เลือกดูสินค้าและเพิ่มลงตะกร้าได้จากการ์ดด้านล่าง
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/cart"
                        className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
                    >
                        ตะกร้าสินค้า ({cartItems.length})
                    </Link>
                    {authButtons}
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 lg:flex-row lg:items-start">
                <div className="lg:w-80 lg:shrink-0">
                    <ProductSearchForm onSearch={loadProducts} />
                </div>
                <div className="flex-1 border-t border-stone-200 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <ProductForm
                        editing={null}
                        onSave={saveProduct}
                        onCancel={() => { }}
                    />
                </div>
            </div>

            <section aria-live="polite" className="mt-8">
                {status === "loading" && (
                    <p className="text-stone-500">กำลังโหลดข้อมูล</p>
                )}
                {status === "error" && (
                    <p role="alert" className="text-rose-600">
                        {errorMessage}
                    </p>
                )}
                {status === "ready" && products.length === 0 && (
                    <p className="text-stone-500">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                )}

                {status === "ready" && products.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((item) => (
                            <div key={item.id} data-testid="product" className="flex flex-col gap-2">
                                <ProductCard
                                    product={item}
                                    inCart={cartItems.some(
                                        (cartItem) => cartItem.id === item.id
                                    )}
                                    onToggleCart={toggleCart}
                                />
                                {isLoggedIn && (
                                    <div className="flex gap-3 text-sm">
                                        <Link
                                            href={`/products/${item.id}/edit`}
                                            className="text-teal-700 hover:underline"
                                        >
                                            แก้ไข
                                        </Link>
                                        <Link
                                            href={`/products/${item.id}/delete`}
                                            className="text-rose-600 hover:underline"
                                        >
                                            ลบ
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}