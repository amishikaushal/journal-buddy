import { Link, useNavigate } from "react-router-dom";
import "./styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="brand">
          ✨ Journal Buddy 📖
        </Link>

        <div className="nav-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">
                <span className="nav-icon">🔐</span> Login
              </Link>
              <Link to="/signup" className="nav-link">
                <span className="nav-icon">✨</span> Sign up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span> Dashboard
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <span className="nav-icon">👋</span> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
