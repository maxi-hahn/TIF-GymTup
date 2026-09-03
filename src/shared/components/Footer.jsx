import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Dumbbell } from 'lucide-react'
import { FaInstagram, FaFacebook } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="footer-brand">
            <Dumbbell size={20} />
            GymTup
          </div>
          <p className="footer-tagline">{t('footerTagline')}</p>
        </div>

        <div>
          <h4 className="footer-heading">{t('footerLinksHeading')}</h4>
          <ul className="footer-links">
            <li><Link to="/">{t('home')}</Link></li>
            <li><Link to="/classes">{t('classes')}</Link></li>
            <li><Link to="/plans">{t('plans')}</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">{t('footerContactHeading')}</h4>
          <p>{t('footerAddress')}</p>
          <p>{t('footerCity')}</p>
          <p>{t('footerHours')}</p>
        </div>

        <div>
          <h4 className="footer-heading">{t('footerSocialHeading')}</h4>
          <div className="footer-socials">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={18} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} GymTup. {t('footerRights')}
      </div>
    </footer>
  )
}

export default Footer