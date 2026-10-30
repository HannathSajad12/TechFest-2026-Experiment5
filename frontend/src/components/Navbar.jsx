
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      navigate("/login");
    }
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        TechFest <b>2026</b>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/events">Events</NavLink>

        {user && (
          <NavLink to="/my-registrations">
            My registrations
          </NavLink>
        )}

        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="who">
              {user.name}
              {user.role === "admin" ? " (admin)" : ""}
            </span>

            <button className="btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link className="btn-ghost" to="/login">
              Log in
            </Link>

            <Link className="btn" to="/register">
              Sign up
            </Link>
          </>
        )}

        <button className="btn-ghost" onClick={toggleTheme}>
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
