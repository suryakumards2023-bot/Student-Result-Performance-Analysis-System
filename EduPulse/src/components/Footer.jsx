import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div>
          <h2>EduPulse</h2>
          <p>
            College Result & Student Performance Analytics System.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <p><Link to="/">Home</Link></p>
          <p><a href="/#about">About</a></p>
          <p><a href="/#features">Features</a></p>
          <p><a href="/#contact">Contact</a></p>
        </div>

        <div>
          <h3>Account</h3>
          <p><Link to="/login">Login</Link></p>
          <p><Link to="/register">Register</Link></p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 EduPulse. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
