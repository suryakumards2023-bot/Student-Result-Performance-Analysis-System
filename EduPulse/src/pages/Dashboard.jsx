import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/dashboard/stats");

        console.log("Dashboard API:", response.data);

        setStats(response.data.statistics);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load dashboard"
        );
      }
    };

    getDashboardStats();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>EduTrack Dashboard</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {stats && (
        <div>
          <p>Total Students: {stats.totalStudents}</p>

          <p>Total Departments: {stats.totalDepartments}</p>

          <p>Total Subjects: {stats.totalSubjects}</p>

          <p>Total Results: {stats.totalResults}</p>

          <p>Passed Results: {stats.passedResults}</p>

          <p>Failed Results: {stats.failedResults}</p>

          <p>
            Average Percentage: {stats.averagePercentage}%
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;