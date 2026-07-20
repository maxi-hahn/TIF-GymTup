import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { Menu, Languages } from 'lucide-react'
import { useState } from 'react'
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

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <div className="navbar-logo">
          {/* <Dumbbell size={22} /> */}
          <Link to="/">
            <strong>GymTup</strong>
          </Link>
        </div>

        <ul className="navbar-links">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => (isActive ? 'active' : '')}>
                
                {t(link.label)}
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="navbar-actions">
          <li>
            <button onClick={() => changeLanguage(language === 'es' ? 'en' : 'es')}>
              <Languages size={18} />
              {language.toUpperCase()}
            </button>
          </li>

          <li>
            <Link to="/login">
              {t('login')}
            </Link>
          </li>
        </ul>

        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <Menu size={24} />
        </button>

      </nav>

      {open && (
        <div className="mobile-menu">
          <ul>
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {t(link.label)}
                </NavLink>
              </li>
            ))}

            <li>
              <button onClick={() => { changeLanguage(language === 'es' ? 'en' : 'es'); setOpen(false)}}>
                <Languages size={18} />
                {language.toUpperCase()}
              </button>
            </li>

            <li>
              <Link to="/login"onClick={() => setOpen(false)} >
                {t('login')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar