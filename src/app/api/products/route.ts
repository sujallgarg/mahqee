import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Product } from "@/context/CartContext";

const getFilePath = () => path.join(process.cwd(), "src/data/products.json");

const defaultProducts: Product[] = [
  {
    id: "floral-comb",
    name: "Floral Comb",
    tagline: "Extra Width for Dense Hair",
    category: "Hair",
    price: 199,
    description: "Designed with a premium floral pattern, the 360 Floral Comb features wide-spaced teeth crafted to gently detangle thick, dense, and curly hair. Prevents hair breakage, distributes natural scalp oils evenly, and adds a luxury aesthetic to your vanity.",
    image: "/images/floral-comb2.png",
    images: [
      "/images/floral-comb2.png",
      "/images/floral-comb.png",
      "/images/floral-comb3.png",
      "/images/floral-comb4.png",
      "/images/floral-comb4.png"
    ],
    ingredients: ["Premium Cellulose Acetate", "Wide-teeth Detangling Layout", "Anti-static coating"],
    benefits: ["Gently detangles thick and curly hair", "Prevents breakage and hair loss", "Distributes natural oils evenly"]
  }
];

const readProducts = (): Product[] => {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(defaultProducts, null, 2), "utf-8");
    return defaultProducts;
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const writeProducts = (products: Product[]) => {
  const filePath = getFilePath();
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = readProducts();
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newProduct: Product = await req.json();
    const products = readProducts();
    
    // Check duplicate ID
    if (products.some((p: Product) => p.id === newProduct.id)) {
      return NextResponse.json({ error: "Product already exists" }, { status: 400 });
    }
    
    products.push(newProduct);
    writeProducts(products);
    return NextResponse.json(newProduct);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const updatedProduct: Product = await req.json();
    let products = readProducts();
    products = products.map((p: Product) => p.id === updatedProduct.id ? updatedProduct : p);
    writeProducts(products);
    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reset = searchParams.get("reset");
    
    if (reset === "true") {
      writeProducts(defaultProducts);
      return NextResponse.json(defaultProducts);
    }
    
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }
    
    let products = readProducts();
    products = products.filter((p: Product) => p.id !== id);
    writeProducts(products);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
