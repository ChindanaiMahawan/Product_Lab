"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
    onSearch: (query: SearchQuery) => Promise<void>;
};

const inputClass =
    "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";
const labelClass = "text-sm font-medium text-stone-700";
const errorClass = "text-xs text-rose-600";

export default function ProductSearchForm(
    { onSearch }: ProductSearchFormProps
) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchQuery>({
        // ตัวเชื่อมที่ทำให้ React Hook Form ตรวจข้อมูลด้วย Zod Schema
        resolver: zodResolver(SearchQuerySchema),
        mode: "onTouched",
        defaultValues: defaultQuery,
    });

    return (
        <form
            onSubmit={handleSubmit(onSearch)}
            noValidate
            className="flex flex-col gap-4"
        >
            <h2 className="text-sm font-semibold text-stone-900">ค้นหาสินค้า</h2>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="q" className={labelClass}>คำค้น</label>
                <input
                    id="q"
                    {...register("q")}
                    placeholder="phone"
                    className={inputClass}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="limit" className={labelClass}>จำนวนรายการ</label>
                <input
                    id="limit"
                    type="number"
                    required
                    // ชื่อฟิลด์ที่ต้องการผูกเข้ากับฟอร์ม
                    {...register("limit", { valueAsNumber: true })}
                    aria-invalid={!!errors.limit}
                    aria-describedby="limit-error"
                    className={inputClass}
                />
                <span id="limit-error" role="alert" className={errorClass}>
                    {errors.limit?.message}
                </span>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="sortBy" className={labelClass}>เรียงตาม</label>
                <select
                    id="sortBy"
                    {...register("sortBy")}
                    className={inputClass}
                >
                    {SORT_FIELDS.map((field) => (
                        <option key={field} value={field}>{field}</option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
                {isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
            </button>
        </form>
    );
}