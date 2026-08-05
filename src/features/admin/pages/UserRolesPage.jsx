import { useState, useEffect } from 'react'
import userService from '@/shared/services/userService'
import { useAuth } from '@/shared/contexts/AuthContext'

const UserRolesPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [message, setMessage] = useState('')

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch {
      setError('No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [])

  const handleRoleChange = async (email, newRole) => {
    setMessage('')
    setError('')
    setSavingId(email)
    try {
      await userService.changeRole(email, newRole)
      setMessage(`Rol de ${email} actualizado a ${newRole}.`)
      await fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo cambiar el rol.')
    } finally {
      setSavingId(null)
    }
  }

  const handleToggleStatus = async (u) => {
    const action = u.isActive ? 'desactivar' : 'activar'
    const confirmToggle = window.confirm(`¿Seguro que querés ${action} a ${u.email}?`)
    if (!confirmToggle) return

    setMessage('')
    setError('')
    setSavingId(u.id)
    try {
      await userService.toggleUserStatus(u.id)
      setMessage(`Usuario ${u.email} ${u.isActive ? 'desactivado' : 'activado'} correctamente.`)
      await fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo cambiar el estado del usuario.')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) return <p>Cargando usuarios...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Gestión de Roles</h1>

      {message && <p>{message}</p>}

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
    </div>
  )
}

export default UserRolesPage