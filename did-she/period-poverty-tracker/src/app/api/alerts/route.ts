import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zone = searchParams.get("zone");
    const status = searchParams.get("status");

    const alerts = await prisma.alert.findMany({
      where: {
        ...(zone ? { zone } : {}),
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { detectedAt: "desc" },
      // Never expose studentId in the response — anonymized only
      select: {
        id:              true,
        schoolCode:      true,
        zone:            true,
        grade:           true,
        cycleConfidence: true,
        detectedAt:      true,
        status:          true,
        resolvedAt:      true,
      },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("[alerts GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}