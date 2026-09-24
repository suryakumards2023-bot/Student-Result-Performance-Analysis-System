import { Link } from "react-router-dom";
import {
  GraduationCap,
  BarChart3,
  Users,
  FileText,
  ArrowRight,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ImageSlider from "../components/ImageSlider";

function Home() {
  const { user } = useAuth();
  return (
    <div className="home">

      <ImageSlider />

      <section className="hero">
        <div className="hero-content">

          <span className="hero-badge">
            College Academic Analytics
          </span>

          <h1>
            Empowering Better
            <span> Student Performance</span>
          </h1>

          <p>
            EduPulse helps educational institutions manage students, academic results, departments and performance analytics in one intelligent platform.
          </p>

          <div className="hero-buttons">
            <Link to={user ? "/dashboard" : "/register"} className="primary-btn">
              {user ? "Open Dashboard" : "Create your account"} <ArrowRight size={16} />
            </Link>

            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>

        </div>

        <div className="hero-icon">
          <GraduationCap size={180} strokeWidth={1} />
        </div>
      </section>

      <section className="about-section" id="about">
        <div><span className="hero-badge">About EduPulse</span><h2>Academic data, made useful.</h2><p>EduPulse is a Student Result &amp; Performance Analysis System designed to help educational institutions manage academic data and understand student performance. It is secure, dynamic, data-driven, and easy to use.</p></div>
      </section>

      <section className="features" id="features">

        <div className="section-heading">
          <h2>EduPulse Features</h2>
          <p>
            Everything required to manage and analyze college results.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <Users size={40} />
            <h3>Student Management</h3>
            <p>
              Manage student records, departments, semesters,
              and academic information.
            </p>
          </div>

          <div className="feature-card">
            <FileText size={40} />
            <h3>Result Management</h3>
            <p>
              Enter, manage, upload, and generate student results.
            </p>
          </div>

          <div className="feature-card">
            <BarChart3 size={40} />
            <h3>Performance Analysis</h3>
            <p>
              Analyze semester, subject, and overall student
              performance using charts.
            </p>
          </div>

        </div>

      </section>

      <section className="workflow" id="workflow">
        <div className="section-heading">
          <h2>A connected academic workflow</h2>
          <p>Every step is backed by your EduPulse API and MongoDB records.</p>
        </div>
        <div className="workflow-grid">
          <article><Users size={28} /><h3>Organize</h3><p>Create departments, subjects, and student profiles in one secure workspace.</p></article>
          <article><Upload size={28} /><h3>Record</h3><p>Add individual marks or upload validated CSV and Excel result files.</p></article>
          <article><BarChart3 size={28} /><h3>Understand</h3><p>Review live dashboard metrics, results, and performance trends.</p></article>
          <article><ShieldCheck size={28} /><h3>Control access</h3><p>JWT-protected routes keep academic operations available only to signed-in users.</p></article>
        </div>
      </section>

      <section className="contact-section" id="contact"><div className="section-heading"><h2>Contact</h2><p>For institutional support, please use your organization’s configured EduPulse support channels.</p></div></section>
    </div>
  );
}

export default Home;
