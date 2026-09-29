"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteProduct, updateProduct } from "@/lib/products";

export async function updateProductAction(id: number, formData: FormData) {
    // เช็กสิทธิ์ซ้ำที่นี่ด้วย เพราะ server action ถูกเรียกตรงได้โดยไม่ผ่านหน้า page
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    await updateProduct(id, {
        title: String(formData.get("title") ?? "").trim(),
        price: Number(formData.get("price")),
        description: String(formData.get("description") ?? "").trim(),
    });

    revalidatePath("/");
    redirect("/");
}

export async function deleteProductAction(id: number) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    await deleteProduct(id);
    revalidatePath("/");
    redirect("/");
}