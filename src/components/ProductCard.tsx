"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

type ProductCardProps = {
    product: Product;
    inCart: boolean;
    onToggleCart: (product: Product) => void;
};

// สีจุดสถานะ ให้ตรงกับความหมายของแต่ละสถานะ
const STATUS_DOT_STYLES: Record<Product["availabilityStatus"], string> = {
    "In Stock": "bg-emerald-500",
    "Low Stock": "bg-amber-500",
    "Out of Stock": "bg-rose-500",
};

export default function ProductCard({
    product,
    inCart,
    onToggleCart,
}: ProductCardProps) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg">
            <div className="relative aspect-square w-full bg-stone-100">
                {product.images[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-stone-400">
                        ไม่มีรูปสินค้า
                    </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-stone-600 backdrop-blur">
                    {product.category}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="line-clamp-2 text-sm font-medium text-stone-900">
                    {product.title}
                </h3>

                <div className="flex items-baseline justify-between">
                    <span className="text-lg font-semibold text-teal-700">
                        {product.price.toFixed(2)} บาท
                    </span>
                    <span className="text-xs text-stone-500">
                        คงเหลือ {product.stock}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <span
                        className={`h-2 w-2 rounded-full ${STATUS_DOT_STYLES[product.availabilityStatus]}`}
                    />
                    {product.availabilityStatus}
                </div>

                <div className="mt-auto flex items-center gap-2 pt-2">
                    <Link
                        href={`/${product.id}`}
                        className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-center text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
                    >
                        ดูรายละเอียด
                    </Link>
                    <button
                        type="button"
                        onClick={() => onToggleCart(product)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${inCart
                            ? "bg-stone-900 text-white hover:bg-stone-800"
                            : "bg-teal-700 text-white hover:bg-teal-800"
                            }`}
                    >
                        {inCart ? "นำออกจากตะกร้า" : "เพิ่มลงตะกร้า"}
                    </button>
                </div>
            </div>
        </article>
    );
}