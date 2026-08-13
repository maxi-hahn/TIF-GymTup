// Generate 15-minute time slots (00:00 to 23:45)
export const TIME_SLOTS = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const hh = String(h).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    TIME_SLOTS.push(`${hh}:${mm}`)
  }
}

// Days ordered Monday (1) through Sunday (0)
export const DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]