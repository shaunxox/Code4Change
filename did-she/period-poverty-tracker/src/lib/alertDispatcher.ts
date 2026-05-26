// src/lib/alertDispatcher.ts
// @ts-nocheck
// src/lib/alertDispatcher.ts
import { prisma } from "@/lib/db";
import { CycleDetectionResult } from "@/types";

export async function dispatchAlert(
  result: CycleDetectionResult,
  schoolCode: string,
  zone: string,
  grade: string
) {
  // Check if there's already a PENDING alert for this student
  // to avoid duplicate alerts
  const existing = await prisma.alert.findFirst({
    where: {
      studentId: result.studentId,
      status: { in: ["PENDING", "IN_PROGRESS"] },
    },
  });

  if (existing) return existing;

  // Create anonymized alert — no name, just zone + school code
  const alert = await prisma.alert.create({
    data: {
      studentId:       result.studentId,
      schoolCode,
      zone,
      grade,
      cycleConfidence: result.confidence,
    },
  });

  return alert;
}