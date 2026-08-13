import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import userService from '@/shared/services/userService'
import { useAuth } from '@/shared/contexts/AuthContext'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const UserRolesPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [savingId, setSavingId] = useState(null)

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch {
      toast.error('No se pudieron cargar los usuarios.')
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [])

  const handleRoleChange = async (email, newRole) => {
    setSavingId(email)
    try {
      await userService.changeRole(email, newRole)
      toast.success(`Rol de ${email} actualizado a ${newRole}.`)
      await fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'No se pudo cambiar el rol.')
    } finally {
      setSavingId(null)
    }
  }

  const handleToggleStatus = async (u) => {
    const action = u.isActive ? 'desactivar' : 'activar'
    const confirmToggle = window.confirm(`¿Seguro que querés ${action} a ${u.email}?`)
    if (!confirmToggle) return

    setSavingId(u.id)
    try {
      await userService.toggleUserStatus(u.id)
      toast.success(`Usuario ${u.email} ${u.isActive ? 'desactivado' : 'activado'} correctamente.`)
      await fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'No se pudo cambiar el estado del usuario.')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) return <LoadingSpinner />
  if (loadError) return <EmptyState message="No se pudieron cargar los usuarios. Intentá recargar la página." />

  return (
    <div>
      <h1>Gestión de Roles</h1>

      {users.length === 0 ? (
        <EmptyState message="No hay usuarios para mostrar." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol actual</th>
              <th>Cambiar rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.email === currentUser?.email
              const isBusy = savingId === u.email || savingId === u.id
              return (
                <tr key={u.email}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td>
                    {u.rol === 'SysAdmin' ? (
                      <span>No editable</span>
                    ) : (
                      <select
                        defaultValue={u.rol}
                        disabled={isSelf || isBusy}
                        title={isSelf ? 'No podés cambiar tu propio rol' : undefined}
                        onChange={(e) => handleRoleChange(u.email, e.target.value)}
                      >
                        <option value="Client">Client</option>
                        <option value="Admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td>
                    {u.rol === 'SysAdmin' ? (
                      <span>No editable</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={isSelf || isBusy}
                        title={isSelf ? 'No podés cambiar tu propio estado' : undefined}
                      >
                        {u.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UserRolesPage