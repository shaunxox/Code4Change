export type Role = "TEACHER" | "ASHA" | "PHC_ADMIN";
export type AlertStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";
export type SupplyStatus = "QUEUED" | "DISPATCHED" | "DELIVERED";

export interface AttendanceLog {
  id: string;
  studentId: string;
  schoolId: string;
  loggedById: string;
  weekStart: string;
  daysPresent: number;
  daysAbsent: number;
  notes?: string;
  createdAt: string;
}

export interface CycleDetectionResult {
  studentId: string;
  detected: boolean;
  confidence: number;
  estimatedCycleLength: number;
  absenceWeeks: string[];
}