import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import userService from '@/shared/services/userService'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

const UserDetailsModal = ({ user, onClose, onRemovePlan, onRemoveInscription }) => {
  const { t } = useTranslation('managmentUser')
  const [userDetails, setUserDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)

  useEffect(() => {
    loadUserDetails()
  }, [user.id])

  const loadUserDetails = async () => {
    setLoadingDetails(true)
    
    const details = {
      plan: null,
      inscriptions: [],
      errors: {
        plan: null,
        inscriptions: null
      }
    }
    
    // Cargar plan
    try {
      details.plan = await userService.getUserPlan(user.id)
    } catch (error) {
      console.error('Error al cargar plan:', error)
      if (error.response?.status === 403) {
        details.errors.plan = t('noPermissionPlan')
      } else {
        details.errors.plan = t('errorLoadingPlan')
      }
    }
    
    // Cargar inscripciones
    try {
      details.inscriptions = await userService.getUserInscriptions(user.id)
    } catch (error) {
      console.error('Error al cargar inscripciones:', error)
      if (error.response?.status === 403) {
        details.errors.inscriptions = t('noPermissionInscriptions')
      } else {
        details.errors.inscriptions = t('errorLoadingInscriptions')
      }
    }
    
    setUserDetails(details)
    setLoadingDetails(false)
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SysAdmin':
        return 'um-role-badge um-role-sysadmin'
      case 'Admin':
        return 'um-role-badge um-role-admin'
      default:
        return 'um-role-badge um-role-client'
    }
  }

  const getStatusBadgeClass = (isActive) => {
    return isActive ? 'um-status-badge um-status-active' : 'um-status-badge um-status-inactive'
  }

  const getTranslatedRole = (role) => {
    switch (role) {
      case 'SysAdmin':
        return t('roleSysAdmin')
      case 'Admin':
        return t('roleAdmin')
      case 'Client':
        return t('roleClient')
      default:
        return role
    }
  }

  return (
    <div className="um-modal-overlay" onClick={onClose}>
      <div className="um-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">{t('modalTitle')}</h2>
          <button
            onClick={onClose}
            className="um-modal-close-button"
          >
            <svg className="um-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="um-modal-body">
          {/* Header del usuario */}
          <div className="um-user-details-header">
            <div className="um-user-details-avatar">
              <span className="um-user-details-avatar-letter">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="um-user-details-info">
              <h3 className="um-user-details-name">{user.name}</h3>
              <p className="um-user-details-email">{user.email}</p>
            </div>
          </div>
          
          {/* Información básica */}
          <div className="um-details-grid">
            <div className="um-detail-card">
              <p className="um-detail-label">{t('tableRole')}</p>
              <span className={getRoleBadgeClass(user.rol)}>
                {getTranslatedRole(user.rol)}
              </span>
            </div>
            <div className="um-detail-card">
              <p className="um-detail-label">{t('tableStatus')}</p>
              <span className={getStatusBadgeClass(user.isActive)}>
                <span className={`um-status-dot ${user.isActive ? 'um-dot-active' : 'um-dot-inactive'}`}></span>
                {user.isActive ? t('statusActive') : t('statusInactive')}
              </span>
            </div>
          </div>

          {/* Plan contratado */}
          <div className="um-details-section">
            <div className="um-section-header">
              <h4 className="um-section-title">{t('planSection')}</h4>
              {userDetails?.plan?.planId && (
                <button
                  onClick={onRemovePlan}
                  className="um-remove-button"
                >
                  {t('removePlan')}
                </button>
              )}
            </div>
            {loadingDetails ? (
              <div className="um-loading-container">
                <LoadingSpinner />
              </div>
            ) : userDetails?.errors?.plan ? (
              <div className="um-error-card">
                <p>{userDetails.errors.plan}</p>
              </div>
            ) : userDetails?.plan?.planId ? (
              <div className="um-plan-card">
                <div className="um-plan-info">
                  <div>
                    <p className="um-plan-name">{userDetails.plan.planName}</p>
                    <p className="um-plan-description">
                      {t('planValue')}: ${userDetails.plan.planValue}
                      {userDetails.plan.planIsUnlimited 
                        ? ` • ${t('planUnlimited')}` 
                        : ` • ${t('planMaxClasses', { count: userDetails.plan.planMaxClass })}`}
                    </p>
                  </div>
                  <span className={`um-plan-status ${userDetails.plan.isActive ? 'um-status-active' : 'um-status-inactive'}`}>
                    {userDetails.plan.isActive ? t('statusActive') : t('statusInactive')}
                  </span>
                </div>
                {userDetails.plan.subscriptionStartDate && (
                  <p className="um-plan-expiration">
                    {t('planStart')}: {new Date(userDetails.plan.subscriptionStartDate).toLocaleDateString()}
                    {' • '}
                    {t('planEnd')}: {new Date(userDetails.plan.subscriptionEndDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="um-empty-card">
                <p>{t('noPlan')}</p>
              </div>
            )}
          </div>

          {/* Clases inscritas */}
          <div className="um-details-section">
            <h4 className="um-section-title">{t('classesSection')}</h4>
            {loadingDetails ? (
              <div className="um-loading-container">
                <LoadingSpinner />
              </div>
            ) : userDetails?.errors?.inscriptions ? (
              <div className="um-error-card">
                <p>{userDetails.errors.inscriptions}</p>
              </div>
            ) : userDetails?.inscriptions?.length > 0 ? (
              <div className="um-classes-list">
                {userDetails.inscriptions.map((inscription) => (
                  <div key={inscription.inscriptionId} className="um-class-card">
                    <div className="um-class-info">
                      <div>
                        <p className="um-class-name">{inscription.className}</p>
                        <p className="um-class-schedule">
                          {inscription.schedule?.dayOfWeek || t('dayOfWeek')} •{' '}
                          {inscription.schedule?.startTime || ''} - {inscription.schedule?.endTime || ''}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveInscription(inscription.scheduleId)}
                        className="um-remove-button um-remove-button-small"
                      >
                        {t('unsubscribe')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="um-empty-card">
                <p>{t('noClasses')}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="um-modal-footer">
          <button
            onClick={onClose}
            className="um-modal-action-button"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal