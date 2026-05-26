import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { triggerSupplyRequest } from "@/lib/supplyChain";

export async function POST(req: NextRequest) {
  try {
    const { alertId, resolvedBy } = await req.json();

    if (!alertId || !resolvedBy) {
      return NextResponse.json({ error: "alertId and resolvedBy required" }, { status: 400 });
    }

    // Mark alert as resolved
    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status:     "RESOLVED",
        resolvedAt: new Date(),
        resolvedBy,
      },
    });

    // Auto-trigger PHC supply request
    const supplyRequest = await triggerSupplyRequest(alertId);

    return NextResponse.json({ alert, supplyRequest });
  } catch (error) {
    console.error("[resolve POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}