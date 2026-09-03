import { Link } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { FaInstagram, FaFacebook } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="footer-brand">
            <Dumbbell size={20} />
            GymTup
          </div>
          <p className="footer-tagline">
            Entrená con propósito. Tu gym, tus horarios, tu ritmo.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Enlaces</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/classes">Clases</Link></li>
            <li><Link to="/plans">Planes</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">Sede central</h4>
          <p>Av. Pellegrini 1234</p>
          <p>Rosario, Santa Fe</p>
          <p>Lun a Sáb · 6:00 - 23:00</p>
        </div>

        <div>
          <h4 className="footer-heading">Seguinos</h4>
          <div className="footer-socials">
                      <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" aria-label="Instagram">
                  <FaInstagram size={18} />
              </a>
                      <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" aria-label="Facebook">
                  <FaFacebook size={18} />
              </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} GymTup. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer
