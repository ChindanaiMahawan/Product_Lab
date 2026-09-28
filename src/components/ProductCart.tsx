"use client";

import type { Product } from "@/lib/products";

type ProductCartProps = {
    items: Product[];
    onRemove: (id: number) => void;
};

export default function ProductCart({ items, onRemove }: ProductCartProps) {
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <section
            aria-label="ตะกร้าสินค้า"
            className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-6"
        >
            <h2 className="text-lg font-semibold text-stone-900">
                ตะกร้าสินค้า ({items.length})
            </h2>

            {items.length === 0 ? (
                <p className="mt-4 text-sm text-stone-500">
                    ยังไม่มีสินค้าในตะกร้า
                </p>
            ) : (
                <>
                    <ul className="mt-4 divide-y divide-stone-100">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between gap-4 py-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-stone-900">
                                        {item.title}
                                    </p>
                                    <p className="text-sm text-stone-500">
                                        {item.price.toFixed(2)} บาท
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemove(item.id)}
                                    className="shrink-0 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                                >
                                    นำออก
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
                        <span className="text-sm font-medium text-stone-700">
                            รวมทั้งหมด
                        </span>
                        <span className="text-lg font-semibold text-teal-700">
                            {total.toFixed(2)} บาท
                        </span>
                    </div>
                </>
            )}
        </section>
    );
}