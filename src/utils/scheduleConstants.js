// Generate 15-minute time slots (00:00 to 23:45)
export const TIME_SLOTS = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const hh = String(h).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    TIME_SLOTS.push(`${hh}:${mm}`)
  }
}

export const DAYS_ORDER = [0, 1, 2, 3, 4, 5, 6]
// Lunes(0), Martes(1), Miercoles(2), Jueves(3), Viernes(4), Sabado(5), Domingo(6)