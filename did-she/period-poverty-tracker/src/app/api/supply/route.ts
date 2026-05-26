import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { markDispatched, markDelivered } from "@/lib/supplyChain";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zone = searchParams.get("zone");
    const status = searchParams.get("status");

    const requests = await prisma.supplyRequest.findMany({
      where: {
        ...(zone ? { zone } : {}),
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[supply GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();

    if (!id || !action) {
      return NextResponse.json({ error: "id and action required" }, { status: 400 });
    }

    let updated;
    if (action === "dispatch") updated = await markDispatched(id);
    else if (action === "deliver") updated = await markDelivered(id);
    else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    return NextResponse.json({ supplyRequest: updated });
  } catch (error) {
    console.error("[supply PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}