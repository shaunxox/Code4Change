import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// import { detectCyclesForSchool } from "@/lib/cycleDetector";
// import { dispatchAlert } from "@/lib/alertDispatcher";
import { startOfWeek } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentId,
      anonymousId,
      grade,
      schoolId,
      schoolCode,
      zone,
      loggedById,
      weekStart,
      daysPresent,
      daysAbsent,
      notes,
    } = body;

    if (!studentId || !anonymousId || !grade || !schoolId || !loggedById || !weekStart) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.school.upsert({
      where: { id: schoolId },
      update: {
        code: schoolCode ?? undefined,
        zone: zone ?? undefined,
      },
      create: {
        id: schoolId,
        name: `School ${schoolCode ?? schoolId}`,
        code: schoolCode ?? `SCH-${schoolId}`,
        zone: zone ?? "Zone-A",
        district: "Unknown",
        state: "Unknown",
      },
    });

    await prisma.profile.upsert({
      where: { id: loggedById },
      update: {
        schoolId,
        role: "TEACHER",
      },
      create: {
        id: loggedById,
        email: `${loggedById}@example.com`,
        role: "TEACHER",
        schoolId,
      },
    });

    await prisma.student.upsert({
      where: { id: studentId },
      update: {
        anonymousId,
        grade,
        schoolId,
      },
      create: {
        id: studentId,
        anonymousId,
        grade,
        schoolId,
      },
    });

    // Normalize weekStart to Monday
    const normalizedWeek = startOfWeek(new Date(weekStart), { weekStartsOn: 1 });

    // Save attendance log
    const log = await prisma.attendanceLog.upsert({
      where: {
        studentId_weekStart: {
          studentId,
          weekStart: normalizedWeek,
        },
      },
      update: { daysPresent, daysAbsent, notes },
      create: {
        studentId,
        schoolId,
        loggedById,
        weekStart: normalizedWeek,
        daysPresent,
        daysAbsent,
        notes,
      },
    });

    // Cycle detection disabled until cycleDetector is implemented
    // const allLogs = await prisma.attendanceLog.findMany({
    //   where: { schoolId },
    //   orderBy: { weekStart: "asc" },
    // });
    // const detectedCycles = detectCyclesForSchool(
    //   allLogs.map((l) => ({
    //     ...l,
    //     weekStart: l.weekStart.toISOString(),
    //     createdAt: l.createdAt.toISOString(),
    //     notes: l.notes ?? undefined,
    //   }))
    // );

    // const school = await prisma.school.findUnique({ where: { id: schoolId } });
    // if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    // const alerts = [];
    // for (const result of detectedCycles) {
    //   const student = await prisma.student.findUnique({
    //     where: { id: result.studentId },
    //   });
    //   if (!student) continue;
    //   const alert = await dispatchAlert(
    //     result,
    //     school.code,
    //     school.zone,
    //     student.grade
    //   );
    //   alerts.push(alert);
    // }

    return NextResponse.json({
      log,
      // cyclesDetected: detectedCycles.length,
      // alertsDispatched: alerts.length,
    });
  } catch (error) {
    console.error("[attendance POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json({ error: "schoolId required" }, { status: 400 });
    }

    const logs = await prisma.attendanceLog.findMany({
      where: { schoolId },
      orderBy: { weekStart: "desc" },
      include: { student: true },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("[attendance GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}