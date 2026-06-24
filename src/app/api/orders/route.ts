import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "src/data/orders.json");

const readOrders = (): any[] => {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to read orders file database, returning empty list", e);
    return [];
  }
};

const writeOrders = (orders: any[]) => {
  const filePath = getFilePath();
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), "utf-8");
};

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const adminPasscode = searchParams.get("admin_passcode");
    const numbersParam = searchParams.get("numbers");
    
    const orders = readOrders();

    // 1. Admin Request with correct passcode
    if (adminPasscode === "mahqee2026") {
      return NextResponse.json(orders, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    // 2. Specific user order status check request
    if (numbersParam) {
      const numbersList = numbersParam.split(",").map(n => n.trim().toLowerCase());
      const filteredOrders = orders.filter((o: any) => 
        o.orderNumber && numbersList.includes(o.orderNumber.trim().toLowerCase())
      );
      return NextResponse.json(filteredOrders);
    }

    // 3. Prevent unauthorized listing of all user orders
    return NextResponse.json([]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newOrder = await req.json();
    const orders = readOrders();

    // Check duplicate
    if (orders.some((o: any) => o.orderNumber === newOrder.orderNumber)) {
      return NextResponse.json({ error: "Order number already exists" }, { status: 400 });
    }

    // Strip base64 image data from items to keep database small
    const optimizedOrder = {
      ...newOrder,
      items: newOrder.items.map((it: any) => ({
        ...it,
        image: it.image && it.image.startsWith("data:image/") ? "" : it.image
      }))
    };

    orders.unshift(optimizedOrder); // Store newest orders first
    writeOrders(orders);
    return NextResponse.json(optimizedOrder);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { orderNumber, paymentStatus } = await req.json();
    if (!orderNumber || !paymentStatus) {
      return NextResponse.json({ error: "Missing orderNumber or paymentStatus" }, { status: 400 });
    }

    const orders = readOrders();
    let updatedOrder = null;

    const updatedOrders = orders.map((o: any) => {
      if (o.orderNumber === orderNumber) {
        updatedOrder = { ...o, paymentStatus };
        return updatedOrder;
      }
      return o;
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    writeOrders(updatedOrders);
    return NextResponse.json(updatedOrder);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clear = searchParams.get("clear");

    if (clear === "true") {
      writeOrders([]);
      return NextResponse.json([]);
    }

    return NextResponse.json({ error: "Specify clear=true to empty orders queue" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
