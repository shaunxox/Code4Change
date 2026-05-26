import { AttendanceLog, CycleDetectionResult } from "@/types";

const CYCLE_WINDOW_MIN = 21;
const CYCLE_WINDOW_MAX = 35;
const MIN_ABSENCES_TO_ANALYZE = 3;
const ABSENCE_THRESHOLD = 2;

export function detectCycle(logs: AttendanceLog[]): CycleDetectionResult {
  const studentId = logs[0]?.studentId ?? "";

  const absenceWeeks = logs
    .filter((log) => log.daysAbsent >= ABSENCE_THRESHOLD)
    .map((log) => log.weekStart)
    .sort();

  if (absenceWeeks.length < MIN_ABSENCES_TO_ANALYZE) {
    return { studentId, detected: false, confidence: 0, estimatedCycleLength: 0, absenceWeeks };
  }

  const gaps: number[] = [];
  for (let i = 1; i < absenceWeeks.length; i++) {
    const gap = Math.round(
      (new Date(absenceWeeks[i]).getTime() - new Date(absenceWeeks[i - 1]).getTime())
      / (1000 * 60 * 60 * 24)
    );
    gaps.push(gap);
  }

  const cyclicGaps = gaps.filter((g) => g >= CYCLE_WINDOW_MIN && g <= CYCLE_WINDOW_MAX);
  const cycleRatio = cyclicGaps.length / gaps.length;
  const estimatedCycleLength =
    cyclicGaps.length > 0
      ? Math.round(cyclicGaps.reduce((a, b) => a + b, 0) / cyclicGaps.length)
      : 0;

  const dataPointBonus = Math.min(absenceWeeks.length / 6, 1);
  const confidence = parseFloat((cycleRatio * 0.6 + dataPointBonus * 0.4).toFixed(2));
  const detected = confidence >= 0.55 && cyclicGaps.length >= 2;

  return { studentId, detected, confidence, estimatedCycleLength, absenceWeeks };
}

export function detectCyclesForSchool(logs: AttendanceLog[]): CycleDetectionResult[] {
  const byStudent = logs.reduce<Record<string, AttendanceLog[]>>((acc, log) => {
    if (!acc[log.studentId]) acc[log.studentId] = [];
    acc[log.studentId].push(log);
    return acc;
  }, {});

  return Object.values(byStudent)
    .map((studentLogs) =>
      detectCycle(studentLogs.sort((a, b) => a.weekStart.localeCompare(b.weekStart)))
    )
    .filter((result) => result.detected);
}