import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { Menu, X, Languages, Dumbbell } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext'
import userService from '@/shared/services/userService'
import notificationService from '@/shared/services/notificationService'
import Button from '@/shared/components/Button'
import './Navbar.css'

const links = [
    { path: '/', label: 'home' },
    { path: '/classes', label: 'classes' },
    { path: '/plans', label: 'plans' },
]

const Navbar = () => {
    const { t: tCommon } = useTranslation()
    const { t: tNotif } = useTranslation('notifications')

    const t = (key, options) => {
        if (typeof key === 'string' && key.startsWith('notifications.')) {
            const realKey = key.substring('notifications.'.length)
            return tNotif(realKey, options)
        }
        return tCommon(key, options)
    }

    const { language, changeLanguage } = useLanguage()
    const [open, setOpen] = useState(false)
    const { isAuthenticated, logout, user } = useAuth()
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [showNotifications, setShowNotifications] = useState(false)
    const notificationRef = useRef(null)

    const [planInfo, setPlanInfo] = useState(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isAdmin = isAuthenticated && (user?.rol === 'Admin' || user?.rol === 'SysAdmin')
    const isSysAdmin = isAuthenticated && user?.rol === 'SysAdmin'
    const isClient = isAuthenticated && user?.rol === 'Client'

    // Cargar notificaciones + listener para actualización instantánea
    useEffect(() => {
        const fetchNotifications = async () => {
            if (isAuthenticated) {
                try {
                    const notifs = await notificationService.getNotifications()
                    setNotifications(notifs)
                } catch (error) {
                    console.error('Error loading notifications:', error)
                }
                
                try {
                    const count = await notificationService.getUnreadCount()
                    setUnreadCount(count)
                } catch (error) {
                    console.error('Error loading unread count:', error)
                }
            }
        }

        if (isAuthenticated) {
            fetchNotifications()

            const handleNotificationUpdate = () => {
                fetchNotifications()
            }

            window.addEventListener('notificationsUpdated', handleNotificationUpdate)

            return () => {
                window.removeEventListener('notificationsUpdated', handleNotificationUpdate)
            }
        }
    }, [isAuthenticated, user?.id])

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId)
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead()
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }

    const getNotificationIcon = (type) => {
        const icons = {
            'ClassCompleted': '🎉',
            'PlanExpiring': '⚠️',
            'PlanExpired': '❌',
            'EnrollmentSuccess': '✅',
            'EnrollmentCancelled': '📋'
        }
        return icons[type] || '📢'
    }

    const getNotificationContent = (notif) => {
        const typeTranslations = {
            'EnrollmentSuccess': {
                title: t('notifications.enrollmentSuccessTitle'),
                message: t('notifications.enrollmentSuccessMessage')
            },
            'EnrollmentCancelled': {
                title: t('notifications.enrollmentCancelledTitle'),
                message: t('notifications.enrollmentCancelledMessage')
            },
            'ClassCompleted': {
                title: t('notifications.classCompletedTitle'),
                message: t('notifications.classCompletedMessage')
            },
            'PlanExpiring': {
                title: t('notifications.planExpiringTitle'),
                message: t('notifications.planExpiringMessage')
            },
            'PlanExpired': {
                title: t('notifications.planExpiredTitle'),
                message: t('notifications.planExpiredMessage')
            }
        }
        return typeTranslations[notif.type] || { title: notif.title, message: notif.message }
    }

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMin = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMin < 1) return tNotif('justNow')
        if (diffMin < 60) return tNotif('minutesAgo', { minutes: diffMin })
        if (diffHours < 24) return tNotif('hoursAgo', { hours: diffHours })
        return tNotif('daysAgo', { days: diffDays })
    }

    // Cargar información del plan si es cliente
    useEffect(() => {
        const fetchPlanInfo = async () => {
            if (isClient) {
                try {
                    const data = await userService.getMyPlanStatus()
                    setPlanInfo(data)
                } catch (error) {
                    console.error('Error al cargar plan:', error)
                    setPlanInfo(null)
                }
            }
        }

        if (isClient) {
            fetchPlanInfo()

            const handlePlanUpdate = () => {
                fetchPlanInfo()
            }

            window.addEventListener('planUpdated', handlePlanUpdate)

            return () => {
                window.removeEventListener('planUpdated', handlePlanUpdate)
            }
        } else {
            setPlanInfo(null)
        }
    }, [isClient, user?.id])

    const calculateRemainingClasses = () => {
        if (!planInfo?.planId) return null
        if (planInfo.planIsUnlimited) return '∞'
        if (planInfo.classesRemaining !== null && planInfo.classesRemaining !== undefined) {
            return planInfo.classesRemaining
        }
        if (planInfo.planMaxClass) return planInfo.planMaxClass
        return null
    }

    const remainingClasses = calculateRemainingClasses()

    const UserInfoCard = ({ isMobile = false }) => {
        if (!isAuthenticated) return null

        const cardClass = isClient ? 'user-info-card client' : 'user-info-card admin'
        const handleCardClick = () => {
            navigate('/profile')
            if (isMobile) setOpen(false)
        }

        return (
            <div
                className={cardClass}
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') handleCardClick()
                }}
            >
                <div className="user-info-name">
                    {user?.name}
                </div>

                {isClient && (
                    <div className="user-info-details">
                        <div className="user-info-plan">
                            {planInfo?.planName ? planInfo.planName : t('noPlan')}
                        </div>
                        <div className="user-info-divider"></div>
                        <div className="user-info-credits">
                            {planInfo?.planId
                                ? `${t('credits')}: ${remainingClasses}`
                                : t('noCredits')
                            }
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <header className="navbar">
            <nav className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="navbar-logo-icon">
                        <Dumbbell size={20} />
                    </span>
                    <span className="navbar-logo-text">
                        GymTup
                    </span>
                </Link>

                {/* Links de navegación */}
                <div className="navbar-links">
                    {links.map((link) => {
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    isActive ? 'navbar-link active' : 'navbar-link'
                                }
                            >
                                {t(link.label)}
                            </NavLink>
                        )
                    })}
                </div>

                {/* Acciones */}
                <div className="navbar-actions">
                    {/* Notificaciones */}
                    {isAuthenticated && (
                        <div className="notification-wrapper" ref={notificationRef}>
                            <button
                                className="navbar-icon-button notification-bell"
                                onClick={() => setShowNotifications(!showNotifications)}
                                aria-label={tNotif('title')}
                            >
                                🔔
                                {unreadCount > 0 && (
                                    <span className="notification-badge">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="notification-dropdown">
                                    <div className="notification-header">
                                        <h3>🔔 {tNotif('title')}</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                className="notification-mark-all"
                                                onClick={handleMarkAllAsRead}
                                                title={tNotif('markAllRead')}
                                            >
                                                ✓✓
                                            </button>
                                        )}
                                    </div>

                                    <div className="notification-list">
                                        {notifications.length === 0 ? (
                                            <p className="notification-empty">
                                                {tNotif('empty')}
                                            </p>
                                        ) : (
                                            notifications.slice(0, 20).map((notif) => {
                                                const content = getNotificationContent(notif)
                                                return (
                                                    <div
                                                        key={notif.id}
                                                        className={`notification-item ${!notif.isRead ? 'notification-unread' : ''}`}
                                                        onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                                    >
                                                        <span className="notification-icon">
                                                            {getNotificationIcon(notif.type)}
                                                        </span>
                                                        <div className="notification-content">
                                                            <p className="notification-title">{content.title}</p>
                                                            <p className="notification-message">{content.message}</p>
                                                            <span className="notification-time">
                                                                {formatTimeAgo(notif.createdAt)}
                                                            </span>
                                                        </div>
                                                        {!notif.isRead && (
                                                            <span className="notification-dot"></span>
                                                        )}
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Selector de idioma */}
                    <button
                        onClick={() => changeLanguage(language === 'es' ? 'en' : 'es')}
                        className="navbar-icon-button"
                        aria-label="Change language"
                    >
                        <Languages size={16} />
                        <span className="navbar-language-text">{language.toUpperCase()}</span>
                    </button>

                    {/* User Info Card */}
                    {isAuthenticated && (
                        <div className="user-info-card-wrapper">
                            <UserInfoCard />
                        </div>
                    )}

                    {/* Admin links */}
                    {isAdmin && (
                        <NavLink
                            to="/admin/plans"
                            className={({ isActive }) =>
                                isActive ? 'navbar-link active' : 'navbar-link'
                            }
                        >
                            Admin
                        </NavLink>
                    )}

                    {isSysAdmin && (
                        <NavLink
                            to="/admin/roles"
                            className={({ isActive }) =>
                                isActive ? 'navbar-link active' : 'navbar-link'
                            }
                        >
                            Roles
                        </NavLink>
                    )}

                    {/* Login/Logout */}
                    {isAuthenticated ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleLogout}
                        >
                            {t('logout')}
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => navigate('/login')}
                        >
                            {t('login')}
                        </Button>
                    )}
                </div>

                {/* Botón de menú móvil */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="mobile-menu-button"
                    aria-label={open ? t('closeMenu') : t('openMenu')}
                    aria-expanded={open}
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </nav>

            {/* Menú móvil */}
            {open && (
                <div className="mobile-menu">
                    <div className="mobile-menu-content">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    isActive ? 'mobile-link active' : 'mobile-link'
                                }
                            >
                                {t(link.label)}
                            </NavLink>
                        ))}

                        {isAuthenticated && (
                            <div className="user-info-card-wrapper-mobile">
                                <UserInfoCard isMobile={true} />
                            </div>
                        )}

                        {isAdmin && (
                            <NavLink
                                to="/admin/plans"
                                onClick={() => setOpen(false)}
                                className="mobile-link"
                            >
                                Admin
                            </NavLink>
                        )}

                        {isSysAdmin && (
                            <NavLink
                                to="/admin/roles"
                                onClick={() => setOpen(false)}
                                className="mobile-link"
                            >
                                Roles
                            </NavLink>
                        )}

                        <Button
                            size="sm"
                            className="mobile-login-button"
                            onClick={() => {
                                if (isAuthenticated) {
                                    handleLogout()
                                } else {
                                    navigate('/login')
                                }
                                setOpen(false)
                            }}
                        >
                            {isAuthenticated ? t('logout') : t('login')}
                        </Button>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar