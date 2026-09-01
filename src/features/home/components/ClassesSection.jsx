import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@/shared/components/Button'
import classService from '@/shared/services/classService'
import inscriptionService from '@/shared/services/inscriptionService'  // ← CAMBIADO
import { useAuth } from '@/shared/contexts/AuthContext'
import { getClassInfo } from '@/features/classes/data/GetClassInfo'

export function ClassesSection() {
  const { t, i18n } = useTranslation(['home', 'classes'])
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [displayedClasses, setDisplayedClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClassesData = async () => {
      try {
        const allClasses = await classService.getClasses()
        let sortedClasses = Array.isArray(allClasses) ? [...allClasses] : []

        // Intentar obtener las inscripciones del usuario autenticado
        // Intentar obtener las inscripciones del usuario autenticado
        if (isAuthenticated && user?.id) {
          try {
            // Solo llamar si es cliente, para evitar 403
            if (user?.rol === 'Client') {
              const inscriptions = await inscriptionService.getMyInscriptions()
              if (Array.isArray(inscriptions) && inscriptions.length > 0) {
                const frequencyMap = {}
                inscriptions.forEach((ins) => {
                  const cId = ins.classId || ins.schedule?.classId
                  if (cId) {
                    frequencyMap[cId] = (frequencyMap[cId] || 0) + 1
                  }
                })

                sortedClasses.sort((a, b) => {
                  const freqA = frequencyMap[a.id] || 0
                  const freqB = frequencyMap[b.id] || 0
                  return freqB - freqA
                })
              }
            }
          } catch (e) {
            // Silenciosamente continuar con el orden por defecto si falla la llamada
          }
        }

        // Tomar exactamente las 3 primeras clases
        setDisplayedClasses(sortedClasses.slice(0, 3))
      } catch (err) {
        console.error('Error fetching classes for home section:', err)
        setDisplayedClasses([])
      } finally {
        setLoading(false)
      }
    }

    loadClassesData()
  }, [isAuthenticated, user?.id, user?.rol])
  const classExtraInfo = getClassInfo(i18n.language)

  // Fallbacks si la API no entrega suficientes clases
  const fallbackClasses = [
    {
      name: 'Yoga',
      badge: 'Respirá, estirá, equilibrá',
      description: 'Una práctica consciente que combina posturas, movilidad y respiración para conectar cuerpo y mente.',
      duration: '60 min',
      intensity: i18n.language === 'en' ? 'Low' : 'Suave',
      benefits: ['Mejora la respiración', 'Aumenta la flexibilidad', 'Reduce el estrés'],
      image: '/class-yoga.png'
    },
    {
      name: 'Entrenamiento Funcional',
      badge: 'Movimientos para la vida real',
      description: 'Circuitos con peso corporal, kettlebells y bandas que trabajan el cuerpo completo de forma dinámica.',
      duration: '45 min',
      intensity: i18n.language === 'en' ? 'High' : 'Alta',
      benefits: ['Desarrolla fuerza útil', 'Quema calorías', 'Previene lesiones'],
      image: '/class-funcional.png'
    },
    {
      name: 'Spinning',
      badge: 'Ritmo, cardio y energía',
      description: 'Clase de ciclismo indoor guiada por música, con intervalos que elevan tu pulso y tu ánimo.',
      duration: '50 min',
      intensity: i18n.language === 'en' ? 'High' : 'Alta',
      benefits: ['Fortalece el sistema cardiovascular', 'Tonifica piernas y glúteos', 'Alto gasto calórico'],
      image: '/class-spinning.png'
    }
  ]

  const itemsToRender = displayedClasses.length >= 3
    ? displayedClasses.map((item) => {
      const info = classExtraInfo[item.name] || classExtraInfo[item.name?.toLowerCase()] || {}
      return {
        id: item.id,
        name: item.name,
        badge: info.badge || 'GymTup Class',
        description: info.description || item.description || '',
        duration: info.duration || '60 min',
        intensity: info.intensity || 'Media',
        benefits: info.benefits || [],
        image: info.image || '/gym-hero.png'
      }
    })
    : fallbackClasses

  return (
    <section id="clases" className="home-section classes-section">
      <div className="section-container">
        <div className="classes-header-row">
          <div className="section-header-center" style={{ textAlign: 'left', margin: 0 }}>
            <span className="section-tag">
              {t('classesTag')}
            </span>
            <h2 className="section-title">
              {t('classesTitle')}
            </h2>
            <p className="section-description">
              {t('classesDescription')}
            </p>
          </div>
          <Button
            variant="secondary"
            className="shrink-0"
            onClick={() => navigate('/classes')}
          >
            {t('classesViewAll')}
            <span className="btn-icon-right">→</span>
          </Button>
        </div>

        <div className="classes-grid-home-3">
          {loading ? (
            <p style={{ color: '#b0c4d6' }}>Cargando clases...</p>
          ) : (
            itemsToRender.map((cls, idx) => (
              <article key={cls.id || idx} className="home-class-card">
                <div className="home-class-card-image-wrapper">
                  <img src={cls.image} alt={cls.name} className="home-class-card-image" />
                  <div className="home-class-card-overlay" />
                  {cls.badge && <span className="home-class-card-badge">{cls.badge}</span>}
                </div>
                <div className="home-class-card-body">
                  <div className="home-class-card-header">
                    <h3 className="home-class-card-title">{cls.name}</h3>
                    <div className="home-class-card-meta">
                      {cls.duration && <span>🕒 {cls.duration}</span>}
                      {cls.intensity && <span>🔥 {cls.intensity}</span>}
                    </div>
                  </div>
                  <p className="home-class-card-desc">{cls.description}</p>
                  {cls.benefits && cls.benefits.length > 0 && (
                    <ul className="home-class-card-benefits">
                      {cls.benefits.slice(0, 3).map((benefit, bIdx) => (
                        <li key={bIdx}>✓ {benefit}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
