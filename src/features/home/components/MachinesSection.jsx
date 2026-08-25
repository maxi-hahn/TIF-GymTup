import { useTranslation } from 'react-i18next'

export function MachinesSection() {
  const { t } = useTranslation('home')

  const machines = [
    {
      icon: '🏋️',
      name: t('machineFreeWeightsTitle'),
      description: t('machineFreeWeightsDesc')
    },
    {
      icon: '⚙️',
      name: t('machineGuidedTitle'),
      description: t('machineGuidedDesc')
    },
    {
      icon: '💓',
      name: t('machineCardioTitle'),
      description: t('machineCardioDesc')
    },
    {
      icon: '🚴',
      name: t('machineSpinningTitle'),
      description: t('machineSpinningDesc')
    }
  ]

  return (
    <section id="maquinas" className="home-section machines-section">
      <div className="section-container">
        <div className="machines-grid-wrapper">
          <div className="machines-image-container">
            <img
              src="/gym-weights.png"
              alt="Máquinas y equipamiento del gimnasio"
              className="machines-image"
            />
            <div className="machines-image-overlay" />
          </div>

          <div>
            <span className="section-tag">
              {t('machinesTag')}
            </span>
            <h2 className="section-title">
              {t('machinesTitle')}
            </h2>
            <p className="section-description">
              {t('machinesDescription')}
            </p>

            <div className="machines-cards-grid">
              {machines.map((machine) => (
                <div key={machine.name} className="machine-item-card">
                  <span className="machine-icon-wrapper">
                    {machine.icon}
                  </span>
                  <h3 className="machine-title">{machine.name}</h3>
                  <p className="machine-desc">{machine.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
