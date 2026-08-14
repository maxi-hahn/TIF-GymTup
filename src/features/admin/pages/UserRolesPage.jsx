import { useState, useEffect, useMemo, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import userService from '@/shared/services/userService'
import { useAuth } from '@/shared/contexts/AuthContext'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'
import UserDetailsModal from '@/features/admin/components/UserDetailsModal'
import ConfirmationModal from '@/shared/components/modals/ConfirmationModal'
import './UserRolesPage.css'
const UserRolesPage = () => {
  const { t } = useTranslation('managmentUser')
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [savingId, setSavingId] = useState(null)

  // Estados para buscador y filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Estados para modales
  const [selectedUser, setSelectedUser] = useState(null)
  const [userToToggle, setUserToToggle] = useState(null)
  const [userToRemovePlan, setUserToRemovePlan] = useState(null)
  const [inscriptionToRemove, setInscriptionToRemove] = useState(null)

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch {
      toast.error(t('loadUsersError'))
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Ordenar usuarios: Admins primero, luego Clients, ambos A-Z
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      // Primero por rol (Admin/SysAdmin primero, luego Client)
      const roleOrder = { 'SysAdmin': 0, 'Admin': 1, 'Client': 2 }
      const roleDiff = (roleOrder[a.rol] ?? 3) - (roleOrder[b.rol] ?? 3)

      if (roleDiff !== 0) return roleDiff

      // Luego por nombre A-Z
      return a.name.localeCompare(b.name)
    })
  }, [users])

  // Filtrado y búsqueda
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === 'all' || user.rol === roleFilter
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [sortedUsers, searchTerm, roleFilter, statusFilter])

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, roleFilter, statusFilter])

  const handleRoleChange = async (email, newRole) => {
    setSavingId(email)
    try {
      await userService.changeRole(email, newRole)
      toast.success(t('roleChangeSuccess', { email, role: newRole }))
      await fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message ?? t('roleChangeError'))
    } finally {
      setSavingId(null)
    }
  }

  const handleToggleStatus = async () => {
    if (!userToToggle) return
    
    const u = userToToggle
    setSavingId(u.id)
    try {
        await userService.toggleUserStatus(u.id)
        
        if (u.isActive) {
            toast.success(t('userDeactivated', { email: u.email }))
        } else {
            toast.success(t('userActivated', { email: u.email }))
        }
        
        await fetchUsers()
        setUserToToggle(null)
    } catch (err) {
        toast.error(err.response?.data?.message ?? t('statusChangeError'))
    } finally {
        setSavingId(null)
    }
}

  const handleRemovePlan = async () => {
    if (!userToRemovePlan) return

    try {
      await userService.removeUserPlan(userToRemovePlan.id)
      toast.success(t('planRemovedSuccess'))
      await fetchUsers()
      setUserToRemovePlan(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? t('errorRemovingPlan'))
    }
  }

  const handleRemoveInscription = async () => {
    if (!inscriptionToRemove) return

    try {
      await userService.removeUserInscription(
        inscriptionToRemove.userId,
        inscriptionToRemove.scheduleId
      )
      toast.success(t('unsubscribeSuccess'))
      setInscriptionToRemove(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? t('errorUnsubscribing'))
    }
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

  // Función para verificar si hay una separación entre roles
  const isRoleBreak = (index, currentUser) => {
    if (index === 0) return false
    const previousUser = currentUsers[index - 1]
    const currentIsAdmin = currentUser.rol === 'Admin' || currentUser.rol === 'SysAdmin'
    const previousIsAdmin = previousUser.rol === 'Admin' || previousUser.rol === 'SysAdmin'

    return currentIsAdmin !== previousIsAdmin
  }

  if (loading) return <LoadingSpinner />
  if (loadError) return <EmptyState message={`${t('loadUsersError')} ${t('reloadPage')}`} />

  return (
    <div className="um-container">
      <div className="um-wrapper">
        {/* Header */}
        <div className="um-page-header">
          <h1 className="um-page-title">{t('title')}</h1>
          <p className="um-page-subtitle">{t('subtitle')}</p>
        </div>

        {/* Buscador y Filtros */}
        <div className="um-filters-section">
          <div className="um-filters-grid">
            <div className="um-filter-group um-search-group">
              <label htmlFor="search" className="um-filter-label">
                {t('searchLabel')}
              </label>
              <div className="um-search-input-wrapper">
                <svg className="um-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="search"
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="um-search-input"
                />
              </div>
            </div>

            <div className="um-filter-group">
              <label htmlFor="roleFilter" className="um-filter-label">
                {t('roleFilterLabel')}
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="um-filter-select"
              >
                <option value="all">{t('filterAll')}</option>
                <option value="Client">{t('roleClient')}</option>
                <option value="Admin">{t('roleAdmin')}</option>
                <option value="SysAdmin">{t('roleSysAdmin')}</option>
              </select>
            </div>

            <div className="um-filter-group">
              <label htmlFor="statusFilter" className="um-filter-label">
                {t('statusFilterLabel')}
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="um-filter-select"
              >
                <option value="all">{t('filterAll')}</option>
                <option value="active">{t('filterActive')}</option>
                <option value="inactive">{t('filterInactive')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        {filteredUsers.length === 0 ? (
          <EmptyState
            message={searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
              ? t('noUsersFound')
              : t('noUsers')}
          />
        ) : (
          <>
            <div className="um-table-container">
              <table className="um-users-table">
                <thead>
                  <tr>
                    <th className="um-avatar-column">{t('tableInitial')}</th>
                    <th>{t('tableName')}</th>
                    <th>{t('tableEmail')}</th>
                    <th>{t('tableRole')}</th>
                    <th>{t('tableChangeRole')}</th>
                    <th>{t('tableStatus')}</th>
                    <th>{t('tableActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((u, index) => {
                    const isSelf = u.email === currentUser?.email
                    const isBusy = savingId === u.email || savingId === u.id
                    const showRoleBreak = isRoleBreak(index, u)

                    return (
                      <Fragment key={u.email}>
                        {showRoleBreak && (
                          <tr className="um-role-separator">
                            <td colSpan="7">
                              <div className="um-role-separator-line">
                                <span>
                                  {u.rol === 'Client' ? t('clientsSection') : t('adminsSection')}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                        <tr className="um-user-row">
                          <td className="um-avatar-cell">
                            <div className="um-avatar">
                              <span className="um-avatar-letter">
                                {u.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="um-user-name">
                              {u.name}
                              {isSelf && (
                                <span className="um-self-badge">
                                  {t('selfBadge')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="um-user-email">
                            {u.email}
                          </td>
                          <td>
                            <span className={getRoleBadgeClass(u.rol)}>
                              {getTranslatedRole(u.rol)}
                            </span>
                          </td>
                          <td>
                            {u.rol === 'SysAdmin' ? (
                              <span className="um-not-editable">{t('notEditable')}</span>
                            ) : (
                              <select
                                defaultValue={u.rol}
                                disabled={isSelf || isBusy}
                                title={isSelf ? t('cantChangeOwnRole') : undefined}
                                onChange={(e) => handleRoleChange(u.email, e.target.value)}
                                className="um-role-select"
                              >
                                <option value="Client">{t('roleClient')}</option>
                                <option value="Admin">{t('roleAdmin')}</option>
                              </select>
                            )}
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(u.isActive)}>
                              <span className={`um-status-dot ${u.isActive ? 'um-dot-active' : 'um-dot-inactive'}`}></span>
                              {u.isActive ? t('statusActive') : t('statusInactive')}
                            </span>
                          </td>
                          <td>
                            <div className="um-action-buttons">
                              <button
                                onClick={() => setSelectedUser(u)}
                                className="um-action-button um-details-button"
                              >
                                {t('viewDetails')}
                              </button>
                              {u.rol !== 'SysAdmin' && (
                                <button
                                  onClick={() => setUserToToggle(u)}
                                  disabled={isSelf || isBusy}
                                  title={isSelf ? t('cantChangeOwnStatus') : undefined}
                                  className={`um-action-button ${u.isActive ? 'um-deactivate-button' : 'um-activate-button'}`}
                                >
                                  {u.isActive ? t('deactivate') : t('activate')}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="um-pagination-container">
                <div className="um-pagination-info">
                  {t('showing')} <span className="um-font-medium">{indexOfFirstUser + 1}</span> {t('to')}{' '}
                  <span className="um-font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{' '}
                  {t('of')} <span className="um-font-medium">{filteredUsers.length}</span> {t('users')}
                </div>
                <div className="um-pagination-controls">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="um-pagination-button"
                  >
                    {t('previous')}
                  </button>
                  <span className="um-pagination-text">
                    {t('page')} {currentPage} {t('of')} {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="um-pagination-button"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal de detalles del usuario */}
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onRemovePlan={() => {
              setUserToRemovePlan(selectedUser)
              setSelectedUser(null)
            }}
            onRemoveInscription={(scheduleId) => {
              setInscriptionToRemove({
                userId: selectedUser.id,
                scheduleId
              })
              setSelectedUser(null)
            }}
          />
        )}

        {/* Modal de confirmación para activar/desactivar */}
        <ConfirmationModal
          isOpen={!!userToToggle}
          title={
            userToToggle?.isActive
              ? t('confirmDeactivateTitle')
              : t('confirmActivateTitle')
          }
          message={
            userToToggle
              ? (userToToggle.isActive
                ? t('confirmDeactivate', { email: userToToggle.email })
                : t('confirmActivate', { email: userToToggle.email }))
              : ''
          }
          confirmText={
            userToToggle?.isActive
              ? t('deactivate')
              : t('activate')
          }
          cancelText={t('cancel')}
          onConfirm={handleToggleStatus}
          onCancel={() => setUserToToggle(null)}
        />

        {/* Modal de confirmación para quitar plan */}
        <ConfirmationModal
          isOpen={!!userToRemovePlan}
          title={t('confirmRemovePlanTitle')}
          message={t('confirmRemovePlan')}
          confirmText={t('removePlan')}
          cancelText={t('cancel')}
          onConfirm={handleRemovePlan}
          onCancel={() => setUserToRemovePlan(null)}
        />

        {/* Modal de confirmación para desinscribir */}
        <ConfirmationModal
          isOpen={!!inscriptionToRemove}
          title={t('confirmUnsubscribeTitle')}
          message={t('confirmUnsubscribe')}
          confirmText={t('unsubscribe')}
          cancelText={t('cancel')}
          onConfirm={handleRemoveInscription}
          onCancel={() => setInscriptionToRemove(null)}
        />
      </div>
    </div>
  )
}

export default UserRolesPage