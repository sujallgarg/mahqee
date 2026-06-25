import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

// Flag to switch to /tmp storage if local directory is read-only (e.g. on Vercel)
let useTmpStorage = false;

const getLocalPath = () => path.join(process.cwd(), "src/data/orders.json");
const getTmpPath = () => path.join(os.tmpdir(), "mahqee_orders.json");

const readOrders = (): any[] => {
  const localPath = getLocalPath();
  const tmpPath = getTmpPath();

  if (useTmpStorage) {
    if (fs.existsSync(tmpPath)) {
      try {
        const data = fs.readFileSync(tmpPath, "utf-8");
        return JSON.parse(data);
      } catch (e) {
        console.error("Failed to read from tmp orders storage", e);
      }
    }
    // Seed from local if it exists
    if (fs.existsSync(localPath)) {
      try {
        const data = fs.readFileSync(localPath, "utf-8");
        fs.writeFileSync(tmpPath, data, "utf-8");
        return JSON.parse(data);
      } catch (e) {
        console.error("Failed to seed tmp orders storage from local bundle", e);
      }
    }
    return [];
  }

  try {
    if (!fs.existsSync(localPath)) {
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(localPath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(localPath, "utf-8");
    return JSON.parse(data);
  } catch (e: any) {
    // If it's a read-only filesystem or permissions error, switch to tmp storage
    if (e.code === "EROFS" || e.code === "EACCES" || e.code === "EPERM") {
      useTmpStorage = true;
      console.warn("Detected read-only filesystem for orders storage. Falling back to /tmp/mahqee_orders.json.");
      return readOrders(); // retry recursively with useTmpStorage = true
    }
    console.error("Failed to read orders file database, returning empty list", e);
    return [];
  }
};

const writeOrders = (orders: any[]) => {
  const localPath = getLocalPath();
  const tmpPath = getTmpPath();

  if (useTmpStorage) {
    try {
      fs.writeFileSync(tmpPath, JSON.stringify(orders, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write to tmp orders storage", e);
    }
    return;
  }

  try {
    fs.writeFileSync(localPath, JSON.stringify(orders, null, 2), "utf-8");
  } catch (e: any) {
    if (e.code === "EROFS" || e.code === "EACCES" || e.code === "EPERM") {
      useTmpStorage = true;
      console.warn("Detected read-only filesystem for writing orders. Falling back to /tmp/mahqee_orders.json.");
      writeOrders(orders); // retry writing to tmp storage
    } else {
      console.error("Failed to write orders file database", e);
    }
  }
};


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
    const body = await req.json();
    const { orderNumber, paymentStatus, deliveryStatus } = body;
    if (!orderNumber) {
      return NextResponse.json({ error: "Missing orderNumber" }, { status: 400 });
    }

    const orders = readOrders();
    let updatedOrder = null;

    const updatedOrders = orders.map((o: any) => {
      if (o.orderNumber === orderNumber) {
        updatedOrder = { 
          ...o, 
          paymentStatus: paymentStatus !== undefined ? paymentStatus : o.paymentStatus,
          deliveryStatus: deliveryStatus !== undefined ? deliveryStatus : o.deliveryStatus
        };
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
    const orderNumber = searchParams.get("orderNumber");

    if (clear === "true") {
      writeOrders([]);
      return NextResponse.json([]);
    }

    if (orderNumber) {
      const orders = readOrders();
      const updatedOrders = orders.filter((o: any) => o.orderNumber !== orderNumber);
      writeOrders(updatedOrders);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Specify clear=true or orderNumber=MQ-XXXX to delete" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
