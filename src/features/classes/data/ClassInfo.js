import yoga from '../public/class-yoga.png'
import spinning from '../public/class-spinning.png'
import funcional from '../public/class-Funcional.png'
const classContent = {
  "yoga": {
    image: yoga,
    badge: "Respirá, estirá, equilibrá",
    description:
      "Una práctica consciente que combina posturas, movilidad y respiración para conectar cuerpo y mente.",
    duration: "60 min",
    intensity: 'suave',
    benefits: [
      "Mejora la respiración y la capacidad pulmonar",
      "Aumenta la flexibilidad y la movilidad articular",
      "Reduce el estrés y mejora el descanso",
    ]
  },

  "Entrenamiento Funcional": {
    image: funcional,
    badge: "Movimientos para la vida real",
    description:
      "Circuitos con peso corporal, kettlebells y bandas que trabajan el cuerpo completo de forma dinámica.",
    duration: "45 min",
    intensity: 'Alta',
    benefits: [
      "Desarrolla fuerza útil y coordinación",
      "Quema calorías y mejora la resistencia",
      "Previene lesiones fortaleciendo el core"
    ]
  },

 "spinning": {
    image: spinning,
    badge: "Ritmo, cardio y energía",
    description:
      "Clase de ciclismo indoor guiada por música, con intervalos que elevan tu pulso y tu ánimo.",
    duration: "50 min",
    intensity: 'Alta',
    benefits: [
      "Fortalece el sistema cardiovascular",
      "Tonifica piernas y glúteos",
      "Alto gasto calórico en poco tiempo",
    ]
  }
}
export default classContent