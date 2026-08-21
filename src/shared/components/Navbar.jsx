import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { Menu, X, Languages, Dumbbell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext'
import userService from '@/shared/services/userService'
import Button from '@/shared/components/Button'
import './Navbar.css';

const links = [
    {
        path: '/',
        label: 'home',
    },
    {
        path: '/classes',
        label: 'classes',
    },
    {
        path: '/plans',
        label: 'plans',
    },
]

const Navbar = () => {
    const { t } = useTranslation()
    const { language, changeLanguage } = useLanguage()
    const [open, setOpen] = useState(false)
    const { isAuthenticated, logout, user } = useAuth()
    const navigate = useNavigate()
    
    // Estado para la información del plan
    const [planInfo, setPlanInfo] = useState(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isAdmin = isAuthenticated && (user?.rol === 'Admin' || user?.rol === 'SysAdmin')
    const isSysAdmin = isAuthenticated && user?.rol === 'SysAdmin'
    const isClient = isAuthenticated && user?.rol === 'Client'

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
            
            // Escuchar evento de actualización de plan
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
    
    // Actualizar calculateRemainingClasses
    const calculateRemainingClasses = () => {
        if (!planInfo?.planId) return null
        
        if (planInfo.planIsUnlimited) {
            return '∞'
        }
        
        if (planInfo.classesRemaining !== null && planInfo.classesRemaining !== undefined) {
            return planInfo.classesRemaining
        }
        
        if (planInfo.planMaxClass) {
            return planInfo.planMaxClass
        }
        
        return null
    }

    const remainingClasses = calculateRemainingClasses()

    // Componente del div de usuario
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