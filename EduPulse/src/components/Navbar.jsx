import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isPublic = ["/", "/login", "/register"].includes(location.pathname);

  const publicLinks = (
    <>
      <Link to="/" className="nav-link" onClick={() => setOpen(false)}>Home</Link>
      <Link to="/dashboard" className="nav-link" onClick={() => setOpen(false)}>Dashboard</Link>
      <Link to="/results" className="nav-link" onClick={() => setOpen(false)}>Results</Link>
      <div className="nav-auth-actions">
        <Link to="/login" className="nav-auth-btn login-btn-outline" onClick={() => setOpen(false)}>Login</Link>
        <Link to="/register" className="nav-auth-btn register-btn" onClick={() => setOpen(false)}>Register</Link>
      </div>
    </>
  );

  const roleLinks = 
    user?.role?.toLowerCase() === "admin" 
      ? [["Dashboard", "/dashboard"], ["Faculty", "/faculty"], ["Students", "/students"], ["Departments", "/departments"], ["Subjects", "/subjects"], ["Results", "/results"], ["Performance", "/performance"]]
      : user?.role?.toLowerCase() === "faculty"
      ? [["Dashboard", "/dashboard"], ["Students", "/students"], ["Subjects", "/subjects"], ["Results", "/results"], ["Performance", "/performance"]]
      : [["Dashboard", "/dashboard"], ["My Results", "/results"], ["My Performance", "/performance"]];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <GraduationCap size={30} />
          <span>EduPulse</span>
        </Link>

        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${open ? "nav-open" : ""}`}>
          {isPublic ? (
            publicLinks
          ) : (
            <>
              {roleLinks.map(([label, path]) => (
                <Link 
                  to={path} 
                  key={label} 
                  className="nav-link"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="nav-user-section">
                <span className="user-chip">
                  {user?.name} <span className="role-text">— {user?.role}</span>
                </span>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
