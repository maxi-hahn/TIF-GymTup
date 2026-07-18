import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
      <div>
        <strong>GymTup</strong>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/classes">Classes</Link>
        </li>
        <li>
          <Link to="/plans">Plans</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
