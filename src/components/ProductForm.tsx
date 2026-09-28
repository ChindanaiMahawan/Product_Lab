"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
    editing: Product | null;
    onSave: (draft: ProductDraft) => void;
    onCancel: () => void;
};

const inputClass ="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";
const labelClass = "text-sm font-medium text-stone-700";
const errorClass = "text-xs text-rose-600";

export default function ProductForm(
    { editing, onSave, onCancel }: ProductFormProps
) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isValid },
    } = useForm<ProductDraft>({
        resolver: zodResolver(ProductDraftSchema),
        mode: "onTouched",
        defaultValues: editing
            ? {
                title: editing.title, price: editing.price,
                stock: editing.stock, category: editing.category
            }
            : { title: "", price: undefined, stock: undefined },
    });

    function saveProduct(values: ProductDraft) {
        onSave(values);
        reset();
    }

    return (
        <form
            onSubmit={handleSubmit(saveProduct)}
            noValidate
            className="flex flex-col gap-4"
        >
            <h2 className="text-sm font-semibold text-stone-900">
                {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
            </h2>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className={labelClass}>ชื่อสินค้า</label>
                <input
                    id="title"
                    required
                    {...register("title")}
                    aria-invalid={!!errors.title}
                    aria-describedby="title-error"
                    className={inputClass}
                />
                <span id="title-error" role="alert" className={errorClass}>
                    {errors.title?.message}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="price" className={labelClass}>ราคา</label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        required
                        {...register("price", { valueAsNumber: true })}
                        aria-invalid={!!errors.price}
                        aria-describedby="price-error"
                        className={inputClass}
                    />
                    <span id="price-error" role="alert" className={errorClass}>
                        {errors.price?.message}
                    </span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="stock" className={labelClass}>จำนวนคงเหลือ</label>
                    <input
                        id="stock"
                        type="number"
                        required
                        {...register("stock", { valueAsNumber: true })}
                        aria-invalid={!!errors.stock}
                        aria-describedby="stock-error"
                        className={inputClass}
                    />
                    <span id="stock-error" role="alert" className={errorClass}>
                        {errors.stock?.message}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className={labelClass}>หมวดหมู่</label>
                <select
                    id="category"
                    required
                    {...register("category")}
                    aria-invalid={!!errors.category}
                    aria-describedby="category-error"
                    className={inputClass}
                >
                    <option value="">กรุณาเลือกหมวดหมู่</option>
                    {CATEGORIES.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                {/* แก้: ย้าย span error กลับมาไว้คู่กับ select (เดิมหลุดไปอยู่นอก div) */}
                <span id="category-error" role="alert" className={errorClass}>
                    {errors.category?.message}
                </span>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className={labelClass}>รายละเอียด</label>
                <textarea
                    id="description"
                    rows={3}
                    {...register("description")}
                    aria-invalid={!!errors.description}
                    aria-describedby="description-error"
                    className={`${inputClass} resize-none`}
                />
                <span id="description-error" role="alert" className={errorClass}>
                    {errors.description?.message}
                </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
                <button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                    {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
                    >
                        ยกเลิก
                    </button>
                )}
            </div>
        </form>
    );
}