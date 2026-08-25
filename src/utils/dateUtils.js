/**
 * Utilidad para calcular la fecha del próximo día de la semana correspondiente.
 * Convención de entrada: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0=Domingo
 * (En JavaScript Date getDay(): 0=Domingo, 1=Lunes, ..., 6=Sábado).
 */
export function calculateNextClassDate(targetDayOfWeek, startTimeStr) {
  if (targetDayOfWeek === undefined || targetDayOfWeek === null) return null

  const now = new Date()
  const currentJsDay = now.getDay() // 0=Dom, 1=Lun, ..., 6=Sab
  
  let targetJsDay = Number(targetDayOfWeek)
  // Backend / App day convention: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0 o 7=Domingo
  if (targetJsDay === 7) targetJsDay = 0

  let daysUntil = targetJsDay - currentJsDay

  // Parsear la hora de inicio si existe (ej. "09:00:00" o "09:00")
  let startHour = 0
  let startMin = 0
  if (startTimeStr) {
    const parts = startTimeStr.split(':')
    startHour = parseInt(parts[0], 10) || 0
    startMin = parseInt(parts[1], 10) || 0
  }

  // Si es el mismo día de la semana
  if (daysUntil === 0) {
    const classTimeThisDay = new Date(now)
    classTimeThisDay.setHours(startHour, startMin, 0, 0)

    // Si la hora de la clase ya pasó hoy, la próxima ocurrencia es dentro de 7 días
    if (now >= classTimeThisDay) {
      daysUntil = 7
    }
  } else if (daysUntil < 0) {
    // Si el día de la semana ya pasó en la semana actual (ej. hoy es martes(2) y la clase era lunes(1))
    daysUntil += 7
  }

  const resultDate = new Date(now)
  resultDate.setDate(now.getDate() + daysUntil)
  resultDate.setHours(startHour, startMin, 0, 0)

  return resultDate
}

/**
 * Calcula la diferencia amigable de tiempo hasta la fecha especificada en la zona horaria local.
 * Ejemplos: "¡Es hoy!", "Mañana", "En X días"
 */
export function getTimeUntilText(targetDate) {
  if (!targetDate) return ''

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const classObj = targetDate instanceof Date ? targetDate : new Date(targetDate)
  if (isNaN(classObj.getTime())) return ''

  const classDay = new Date(classObj.getFullYear(), classObj.getMonth(), classObj.getDate())

  const diffMs = classDay.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '¡Es hoy!'
  if (diffDays === 1) return 'Mañana'
  if (diffDays > 1) return `En ${diffDays} días`
  return ''
}
