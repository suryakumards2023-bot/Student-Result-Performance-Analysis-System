import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Departments from "./pages/Departments";
import Subjects from "./pages/Subjects";
import Results from "./pages/Results";
import Performance from "./pages/Performance";
import Faculty from "./pages/Faculty";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute allowedRoles={["admin", "faculty"]}><Students /></ProtectedRoute>} />
          <Route path="/faculty" element={<ProtectedRoute allowedRoles={["admin"]}><Faculty /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute allowedRoles={["admin"]}><Departments /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute allowedRoles={["admin", "faculty", "student"]}><Subjects /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
