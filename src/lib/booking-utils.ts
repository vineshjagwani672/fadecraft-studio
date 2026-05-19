const START_H = 10;
const END_H = 20;

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = START_H; h <= END_H; h++) {
    for (const m of [0, 30]) {
      if (h === END_H && m > 0) break;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

export function bookingSlotKey(date: string, time: string) {
  return `${date}T${time}`;
}

/** Demo-only: some slots appear booked until user books them */
export const INITIAL_MOCK_BOOKED_KEYS = [
  "2026-05-16T10:00",
  "2026-05-16T11:30",
  "2026-05-17T14:00",
  "2026-05-18T16:00",
  "2026-05-19T12:00",
];
