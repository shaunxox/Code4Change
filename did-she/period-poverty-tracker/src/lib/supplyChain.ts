// @ts-nocheck
// src/lib/supplyChain.ts
import { prisma } from "@/lib/db";

export async function triggerSupplyRequest(alertId: string) {
  // Fetch the alert to get zone + schoolCode
  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
  });

  if (!alert) throw new Error("Alert not found");

  // Check if supply request already exists
  const existing = await prisma.supplyRequest.findUnique({
    where: { alertId },
  });

  if (existing) return existing;

  // Auto-create a supply request for the PHC
  const supplyRequest = await prisma.supplyRequest.create({
    data: {
      alertId,
      zone:       alert.zone,
      schoolCode: alert.schoolCode,
      kitsNeeded: 1,
      status:     "QUEUED",
    },
  });

  return supplyRequest;
}

export async function markDispatched(supplyRequestId: string) {
  return prisma.supplyRequest.update({
    where: { id: supplyRequestId },
    data: {
      status:       "DISPATCHED",
      dispatchedAt: new Date(),
    },
  });
}

export async function markDelivered(supplyRequestId: string) {
  return prisma.supplyRequest.update({
    where: { id: supplyRequestId },
    data: {
      status:      "DELIVERED",
      deliveredAt: new Date(),
    },
  });
}