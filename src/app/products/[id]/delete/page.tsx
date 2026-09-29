import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
    params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
    params,
}: DeleteProductPageProps) {
    const session = await auth();
    if (!session?.user) {
        // พาผู้ที่ยังไม่ล็อกอินกลับหน้าแรก
        redirect("/");
    }

    const { id } = await params;
    const productId = Number(id);

    // กัน URL แปลก ๆ เช่น /products/abc/delete (Number("abc") = NaN)
    if (!Number.isInteger(productId)) {
        notFound();
    }

    const product = await getProduct(productId);
    if (!product) {
        notFound();
    }

    const deleteAction = deleteProductAction.bind(null, product.id);

    return (
        <main>
            <h1>ยืนยันการลบ</h1>
            <p>ต้องการลบสินค้า “{product.title}” หรือไม่?</p>
            <div>
                <form action={deleteAction}>
                    <button type="submit">ยืนยันการลบ</button>
                </form>
                <Link href="/">ยกเลิก</Link>
            </div>
        </main>
    );
}