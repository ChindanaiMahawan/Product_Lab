import Image from "next/image";
import Link from "next/link";
import { fetchProductById } from "@/lib/products";

// ถ้าเข้า /167 Next.js จะส่ง { id: "167" } เข้ามาใน params
type ProductDetailPageProps = {
    // params เป็น Promise ต้อง await ก่อนใช้งาน
    params: Promise<{ id: string }>;
};

export default async function ProductDetailPage(
    { params }: ProductDetailPageProps
) {
    const { id } = await params;
    const productId = Number(id);

    // ตรวจว่า id ใน URL เป็นตัวเลขที่ถูกต้องก่อนยิง API
    if (!Number.isInteger(productId) || productId <= 0) {
        return (
            <main>
                <p role="alert">รหัสสินค้าไม่ถูกต้อง: {id}</p>
                <Link href="/">กลับหน้ารายการสินค้า</Link>
            </main>
        );
    }

    let product;

    try {
        product = await fetchProductById(productId);
    } catch (error) {
        // เช่น id ไม่มีในระบบ (404) หรือเรียก API ไม่สำเร็จ
        return (
            <main>
                <p role="alert">
                    {error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"}
                </p>
                <Link href="/">กลับหน้ารายการสินค้า</Link>
            </main>
        );
    }

    return (
        <main>
            <Link href="/">กลับหน้ารายการสินค้า</Link>

            <h1>{product.title}</h1>

            {product.images.length > 0 && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {product.images.map((src, index) => (
                        <Image
                            key={src}
                            src={src}
                            alt={`${product.title} ${index + 1}`}
                            width={200}
                            height={200}
                        />
                    ))}
                </div>
            )}

            <dl>
                <dt>ราคา</dt>
                <dd>{product.price}</dd>

                <dt>คงเหลือ</dt>
                <dd>{product.stock}</dd>

                <dt>หมวดหมู่</dt>
                <dd>{product.category}</dd>

                <dt>สถานะ</dt>
                <dd>{product.availabilityStatus}</dd>

                <dt>รายละเอียด</dt>
                <dd>{product.description || "-"}</dd>
            </dl>
        </main>
    );
}
