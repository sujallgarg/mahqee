import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Product } from "@/context/CartContext";

const getFilePath = () => path.join(process.cwd(), "src/data/products.json");

const defaultProducts: Product[] = [
  {
    "id": "floral-comb",
    "name": "Floral Comb",
    "tagline": "Extra Width for Dense Hair",
    "category": "Hair",
    "price": 199,
    "description": "Designed with a premium floral pattern, the 360 Floral Comb features wide-spaced teeth crafted to gently detangle thick, dense, and curly hair. Prevents hair breakage, distributes natural scalp oils evenly, and adds a luxury aesthetic to your vanity.",
    "image": "/images/floracombmain.png",
    "images": [
      "/images/floracombmain.png",
      "/images/floral-comb.png",
      "/images/floral-comb3.png",
      "/images/floral-comb4.png",
      "/images/floral-comb4.png"
    ],
    "ingredients": [
      "Premium Cellulose Acetate",
      "Wide-teeth Detangling Layout",
      "Anti-static coating"
    ],
    "benefits": [
      "Gently detangles thick and curly hair",
      "Prevents breakage and hair loss",
      "Distributes natural oils evenly"
    ],
    "isBestSeller": true,
    "isLovedByMahqee": false
  },
  {
    "id": "premium-eyelash-curler",
    "name": "Premium Eyelash Curler",
    "tagline": "Miracle of Beauty — Effortless Curl, Perfect Definition.",
    "category": "Makeup",
    "price": 299,
    "description": "\"Achieve beautifully lifted, high-definition curls with the MAHQUEE Premium Eyelash Curler. Designed with an ergonomic grip for steady control, it features a smooth mechanism that applies even pressure without pinching or pulling your lashes. Perfect for all eye shapes to instantly open up and brighten your look before mascara application.\"",
    "image": "/images/eyelash-curler.png",
    "images": [
      "/images/eyelash-curler.png",
      "/images/premium-eyelash-curler-gallery-1.png",
      "/images/premium-eyelash-curler-gallery-2.png"
    ],
    "ingredients": [],
    "benefits": [],
    "isBestSeller": true,
    "isLovedByMahqee": false
  },
  {
    "id": "blackhead-blemish-remover-tool",
    "name": "Blackhead & Blemish Remover Tool",
    "tagline": "Flawless Skin, Effortlessly — India's No.1 Quality Extraction Tool.",
    "category": "Makeup",
    "price": 149,
    "description": "\"Achieve a clearer, blemish-free complexion with the MAHQEE Professional Blackhead Remover. This premium 12 cm stainless steel tool features a dual-sided design tailored for precision: a small spoon end for smooth extraction and an anti-loop tip for targeting stubborn blackheads and whiteheads. Designed with an anti-slip textured handle for maximum grip and steady control, it ensures safe, hygienic skin clearing at home without damaging surrounding tissue.\"",
    "image": "/images/blackhead-blemish-remover-tool-main.png",
    "images": [
      "/images/blackhead-blemish-remover-tool-gallery-0.png",
      "/images/blackhead-blemish-remover-tool-gallery-1.png",
      "/images/blackhead-blemish-remover-tool-gallery-2.jpg",
      "/images/blackhead-blemish-remover-tool-gallery-3.png",
      "/images/blackhead-blemish-remover-tool-gallery-4.png",
      "/images/blackhead-blemish-remover-tool-gallery-5.png"
    ],
    "ingredients": [],
    "benefits": [],
    "isBestSeller": true,
    "isLovedByMahqee": false
  },
  {
    "id": "geometric-pink-dressing-comb-19-cm",
    "name": "Geometric Pink Dressing Comb (19 CM)",
    "tagline": "Precision Styling, Effortless Glide — Extra Width for Dense Hair.",
    "category": "Hair",
    "price": 199,
    "description": "\"Experience professional styling at home with the MAHQEE 19 cm Geometric Dressing Comb. Crafted with an extra width design specifically optimized to handle dense, thick, or coarse hair without snapping or snagging. This multi-purpose comb features a detailed teeth classification system, seamlessly blending rounded coarse teeth for gentle detangling alongside a fine teeth section for precise sectioning and styling. Made from high-grade material with a vibrant pink geometric pattern, it ensures maximum comfort, scalp safety, and styling control.\"",
    "image": "/images/geometric-comb.png",
    "images": [
      "/images/geometric-comb-gallery-0.png",
      "/images/geometric-comb-gallery-1.png",
      "/images/geometric-comb-gallery-2.png",
      "/images/geometric-comb-gallery-3.png"
    ],
    "ingredients": [],
    "benefits": [],
    "isBestSeller": false,
    "isLovedByMahqee": false
  },
  {
    "id": "hair-rollers",
    "name": "Hair Roller Medium",
    "tagline": "Heatless Blowout Volume",
    "category": "Hair",
    "price": 182,
    "description": "Medium-sized self-grip velcro rollers to create bouncy blowouts and root lift without thermal damage.",
    "image": "/images/hair-rollers-slider.png",
    "images": [
      "/images/hair-rollers-slider.png",
      "/images/hair-rollers-thumb.png"
    ],
    "ingredients": [
      "Premium self-grip velcro material",
      "Lightweight hollow inner core"
    ],
    "benefits": [
      "Adds dramatic root lift and volume",
      "Gentle heatless styling for daily curls"
    ],
    "isBestSeller": true,
    "isLovedByMahqee": true
  },
  {
    "id": "makeup-bag",
    "name": "Makeup Organiser Bag Brown",
    "tagline": "Luxury Vegan Leather Organizer",
    "category": "Makeup",
    "price": 697,
    "description": "Sleek, double-compartment vanity travel organizer bag crafted from premium brown textured vegan leather.",
    "image": "/images/makeup-bag-slider.png",
    "images": [
      "/images/makeup-bag-slider.png",
      "/images/makeup-bag-thumb.png"
    ],
    "ingredients": [
      "Waterproof saffiano vegan leather",
      "Premium gold metallic zip hardware"
    ],
    "benefits": [
      "Double zipper compartments for layout organization",
      "Spacious layout with compact exterior shape"
    ],
    "isBestSeller": true,
    "isLovedByMahqee": true
  },
  {
    "id": "paddle-brush",
    "name": "Tropical Bloom Paddle Hair Brush",
    "tagline": "Detangle and Style in Style",
    "category": "Hair",
    "price": 244,
    "description": "Gently detangles and styles hair, featuring high-quality flexible bristles and a premium tropical bloom pattern.",
    "image": "/images/paddle-brush-slider.png",
    "images": [
      "/images/paddle-brush-slider.png",
      "/images/paddle-brush-thumb.png"
    ],
    "ingredients": [
      "Anti-static ionic bristles",
      "Comfortable pneumatic cushion base"
    ],
    "benefits": [
      "Seamlessly detangles wet or dry hair",
      "Gentle on sensitive scalps",
      "Frizz-free finish"
    ],
    "isBestSeller": true,
    "isLovedByMahqee": true
  },
  {
    "id": "ice-globes",
    "name": "Facial Ice Globes",
    "tagline": "Calm and Cool Facial Massage",
    "category": "Makeup",
    "price": 839,
    "description": "Premium glass facial ice globes to soothe skin, reduce puffiness, stimulate blood circulation, and enhance your daily skincare routine.",
    "image": "/images/ice-globes-slider.png",
    "images": [
      "/images/ice-globes-slider.png",
      "/images/ice-globes-thumb.png"
    ],
    "ingredients": [
      "High-borosilicate glass globes",
      "Non-freezing cosmetic fluid inside"
    ],
    "benefits": [
      "Soothes redness and calms skin",
      "Reduces morning under-eye puffiness",
      "Improves serum absorption"
    ],
    "isBestSeller": true,
    "isLovedByMahqee": true
  },
  {
    "id": "vanity-pouch",
    "name": "Marshmallow Vanity Pouch",
    "tagline": "Soft and Cute Storage Pouch",
    "category": "Makeup",
    "price": 665,
    "description": "A soft, puffy marshmallow-style vanity storage pouch designed with a wide opening and travel-friendly handle.",
    "image": "/images/vanity-pouch-slider.png",
    "images": [
      "/images/vanity-pouch-slider.png",
      "/images/vanity-pouch-thumb.png"
    ],
    "ingredients": [
      "Premium soft quilted cotton outer",
      "Water-resistant interior lining"
    ],
    "benefits": [
      "Wide opening design for quick access",
      "Convenient carry handle",
      "Compact yet spacious"
    ],
    "isBestSeller": true,
    "isLovedByMahqee": true
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
