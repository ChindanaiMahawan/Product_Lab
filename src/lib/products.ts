import { z } from "zod";

// ---------- ค่าคงที่ ----------

// รายชื่อหมวดหมู่ คัดลอกจาก
// https://dummyjson.com/products/category-list
export const CATEGORIES = [
    "beauty", "fragrances", "furniture", "groceries",
    "home-decoration", "kitchen-accessories", "laptops",
    "mens-shirts", "mens-shoes", "mens-watches",
    "mobile-accessories", "motorcycle", "skin-care",
    "smartphones", "sports-accessories", "sunglasses",
    "tablets", "tops", "vehicle", "womens-bags",
    "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches",
] as const;

export const SORT_FIELDS = ["title", "price", "stock"] as const;

const API_BASE = "https://dummyjson.com";
const PRODUCT_FIELDS =
    "id,images,title,price,stock,category,description,availabilityStatus";

// ---------- Schema & Type ----------

export const ProductSchema = z.object({
    id: z.number(),
    title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
    price: z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
    stock: z
        .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
        .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
        .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
    category: z.enum(CATEGORIES, { error: "กรุณาเลือกหมวดหมู่" }),
    description: z.string().trim().optional(),
    availabilityStatus: z.enum(["In Stock", "Low Stock", "Out of Stock"], {
        error: "กรุณาระบุสถานะสินค้า",
    }),
    images: z.array(z.string().url()),
});

export const ProductListSchema = z.object({
    products: z.array(ProductSchema),
    total: z.number(),
    skip: z.number(),
    limit: z.number(),
});

export const SearchQuerySchema = z.object({
    q: z.string().trim(),
    limit: z
        .number({ error: "กรุณากรอกจำนวนรายการ" })
        .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
        .min(1, "อย่างน้อย 1 รายการ")
        .max(30, "ไม่เกิน 30 รายการ"),
    sortBy: z.enum(SORT_FIELDS),
});

// ใช้กับฟอร์มเพิ่ม/แก้ไขสินค้า
export const ProductDraftSchema = ProductSchema.omit({
    id: true,
    images: true,
    availabilityStatus: true,
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type ProductDraft = z.infer<typeof ProductDraftSchema>;

export const defaultQuery: SearchQuery = {
    q: "",
    limit: 10,
    sortBy: "title",
};

// ---------- ส่วนที่ 1: เรียก API ตรง (ค้นหา / ดูรายละเอียด) ----------

export function buildProductUrl(query: SearchQuery): string {
    const params = new URLSearchParams();
    params.set("q", query.q);
    params.set("limit", String(query.limit));
    params.set("sortBy", query.sortBy);
    params.set("order", "asc");
    params.set("select", PRODUCT_FIELDS);
    return `${API_BASE}/products/search?${params.toString()}`;
}

export function buildProductByIdUrl(id: number): string {
    const params = new URLSearchParams();
    params.set("select", PRODUCT_FIELDS);
    return `${API_BASE}/products/${id}?${params.toString()}`;
}

export async function fetchProducts(query: SearchQuery): Promise<ProductList> {
    const response = await fetch(buildProductUrl(query));

    if (!response.ok) {
        throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
    }

    const result = ProductListSchema.safeParse(await response.json());
    if (!result.success) {
        console.error("Zod ตรวจไม่ผ่าน:", result.error.issues);
        throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
    }
    return result.data;
}

export async function fetchProductById(id: number): Promise<Product> {
    const response = await fetch(buildProductByIdUrl(id));

    if (response.status === 404) {
        throw new Error("ไม่พบสินค้าที่ต้องการ");
    }
    if (!response.ok) {
        throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
    }

    const result = ProductSchema.safeParse(await response.json());
    if (!result.success) {
        console.error("Zod ตรวจไม่ผ่าน:", result.error.issues);
        throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
    }
    return result.data;
}

// ---------- ส่วนที่ 2: in-memory store (แก้ไข / ลบ) ----------
// dummyjson ไม่บันทึกการแก้ไข/ลบจริง จึงดึงมาครั้งเดียวแล้วแก้ใน memory เอง

declare global {
    var demoProducts: Promise<Product[]> | undefined;
}

async function loadProducts(): Promise<Product[]> {
    const params = new URLSearchParams({ limit: "0", select: PRODUCT_FIELDS });
    // limit=0 = ดึงทั้งหมด (ถ้าอยากได้แค่ 10 รายการเหมือนเดิม เปลี่ยนเป็น "10")
    const response = await fetch(`${API_BASE}/products?${params}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
    }

    const result = ProductListSchema.safeParse(await response.json());
    if (!result.success) {
        console.error("Zod ตรวจไม่ผ่าน:", result.error.issues);
        throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
    }
    return result.data.products;
}

function getStore(): Promise<Product[]> {
    if (!globalThis.demoProducts) {
        globalThis.demoProducts = loadProducts().catch((error) => {
            // ถ้าโหลดพลาด ให้ลองใหม่ในครั้งถัดไป
            globalThis.demoProducts = undefined;
            throw error;
        });
    }
    return globalThis.demoProducts;
}

export async function getProducts() {
    return getStore();
}

export async function getProduct(id: number) {
    const products = await getStore();
    return products.find((product) => product.id === id);
}

export async function updateProduct(
    id: number,
    values: Pick<Product, "title" | "price" | "description">,
) {
    const product = await getProduct(id);
    if (!product) {
        throw new Error("Product not found");
    }

    product.title = values.title;
    product.price = values.price;
    product.description = values.description;
}

export async function deleteProduct(id: number) {
    const products = await getStore();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
        throw new Error("Product not found");
    }

    products.splice(index, 1);
}