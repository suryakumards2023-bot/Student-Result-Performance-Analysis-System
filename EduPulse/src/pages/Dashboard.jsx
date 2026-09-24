import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Award, BookOpen, Building2, CheckCircle2, ClipboardList, Users, XCircle } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
const colors = ["#4f46e5", "#ef4444"];
function EmptyState({ children = "No data available yet." }) { return <div className="empty-state">{children}</div>; }
function StatCard({ icon: Icon, label, value, tone = "indigo" }) { return <article className={`dashboard-card ${tone}`}><span className="stat-icon"><Icon size={20} /></span><div><p>{label}</p><h2>{value}</h2></div></article>; }
export default function Dashboard() {
  const { user } = useAuth(); const [data, setData] = useState(null); const [error, setError] = useState("");
  const isStudent = user?.role?.toLowerCase() === "student";
    useEffect(() => {
      const load = async () => {
        try {
          if (isStudent) {
            const profile = await API.get("/students");
            const student = profile.data.data.students[0];
            if (!student) throw new Error("No student profile is linked to your account");
            const performance = await API.get(`/performance/student/${student._id}`);
            setData({ student, performance: performance.data });
            return;
          }
          const [stats, departments, passFail, subjects, topStudents, recentResults] = await Promise.all([
            API.get("/dashboard/stats"),
            API.get("/dashboard/department-performance"),
            API.get("/dashboard/pass-fail"),
            API.get("/performance/subjects"),
            API.get("/dashboard/top-students"),
            API.get("/dashboard/recent-results")
          ]);
          setData({
            stats: stats.data.statistics,
            departments: departments.data.performance,
            passFail: passFail.data.distribution,
            subjects: subjects.data.data.performance,
            topStudents: topStudents.data.topStudents,
            recentResults: recentResults.data.results
          });
        } catch (requestError) {
          setError(requestError.response?.data?.message || requestError.message || "Unable to load dashboard data.");
        }
      };
      load();
    }, [isStudent]);
  if (error) return <div className="page"><p className="notice error">{error}</p></div>; if (!data) return <div className="page"><div className="loading-state">Loading dashboard data...</div></div>;
  if (isStudent) {
    const performance = data.performance.performance;
    return <div className="page dashboard-page">
      <div className="page-header"><div><p className="eyebrow">Academic overview</p><h1>EduPulse Dashboard</h1><p>Welcome back, {data.student.name}.</p></div><span className="role-badge">Student</span></div>
      <div className="dashboard-grid">
        <StatCard icon={Award} label="Average Percentage" value={`${performance.averagePercentage}%`} />
        <StatCard icon={BookOpen} label="Total Subjects" value={performance.totalSubjects} tone="violet" />
        <StatCard icon={CheckCircle2} label="Passed" value={performance.passedSubjects} tone="green" />
        <StatCard icon={XCircle} label="Failed" value={performance.failedSubjects} tone="red" />
      </div>
      <section className="dashboard-section"><h2>My performance</h2><ResponsiveContainer width="100%" height={320}><BarChart data={performance.semesterPerformance}><XAxis dataKey="semester"/><YAxis/><Tooltip/><Bar dataKey="percentage" fill="#4f46e5"/></BarChart></ResponsiveContainer></section>
    </div>;
  }
  const { stats, departments, passFail, subjects, topStudents, recentResults } = data;
  const cards = [[Users, "Students", stats.totalStudents], [Building2, "Departments", stats.totalDepartments], [BookOpen, "Subjects", stats.totalSubjects], [ClipboardList, "Results", stats.totalResults], [CheckCircle2, "Passed", stats.passedResults], [XCircle, "Failed", stats.failedResults], [Award, "Average Percentage", `${stats.averagePercentage}%`]];
  return <div className="page dashboard-page">
    <div className="page-header"><div><p className="eyebrow">Academic analytics</p><h1>EduPulse Dashboard</h1><p>Welcome back, {user.name}. Here is the latest academic activity.</p></div><span className="role-badge">{user.role}</span></div>
    <div className="dashboard-grid">{cards.map(([Icon, label, value], index) => <StatCard key={label} icon={Icon} label={label} value={value} tone={["indigo", "violet", "blue", "slate", "green", "red", "amber"][index]} />)}</div>
    <div className="chart-grid">
      <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">By department</p><h2>Department Performance</h2></div></div>{departments.length ? <><ResponsiveContainer width="100%" height={260}><BarChart data={departments}><XAxis dataKey="departmentName"/><YAxis/><Tooltip/><Bar dataKey="averagePercentage" fill="#6366f1"/></BarChart></ResponsiveContainer><div className="table-container"><table><thead><tr><th>Department</th><th>Total Students</th><th>Average Percentage</th><th>Pass Rate</th></tr></thead><tbody>{departments.map((department) => <tr key={department.departmentId}><td>{department.departmentName}</td><td>{department.totalStudents}</td><td>{department.averagePercentage}%</td><td>{department.passRate == null ? "-" : `${department.passRate}%`}</td></tr>)}</tbody></table></div></> : <EmptyState />}</section>
      <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Outcome split</p><h2>Pass / Fail Distribution</h2></div></div>{stats.totalResults ? <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={[{name:"Passed",value:passFail.passed},{name:"Failed",value:passFail.failed}]} dataKey="value" nameKey="name" label>{colors.map(c=><Cell key={c} fill={c}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer> : <EmptyState>No result data available.</EmptyState>}</section>
    </div>
    <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Compare subjects</p><h2>Subject Performance</h2></div></div>{subjects.length ? <div className="table-container"><table><thead><tr><th>Subject</th><th>Code</th><th>Average Marks</th><th>Average Percentage</th><th>Pass Rate</th></tr></thead><tbody>{subjects.map((subject) => <tr key={`${subject.code}-${subject.subject}`}><td>{subject.subject}</td><td>{subject.code}</td><td>{subject.averageMarks ?? "-"}</td><td>{subject.averagePercentage == null ? "-" : `${subject.averagePercentage}%`}</td><td>{subject.passRate == null ? "-" : `${subject.passRate}%`}</td></tr>)}</tbody></table></div> : <EmptyState />}</section>
    <div className="dashboard-columns"><section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Latest entries</p><h2>Recent Results</h2></div><Link className="text-link" to="/results">View All Results</Link></div>{recentResults.length ? <div className="table-container"><table><thead><tr><th>Student</th><th>Subject</th><th>Marks</th><th>Percentage</th><th>Grade</th><th>Status</th><th>Date</th></tr></thead><tbody>{recentResults.map((result) => <tr key={result._id}><td>{result.student?.name || "-"}<small>{result.student?.studentId}</small></td><td>{result.subject?.name || "-"}</td><td>{result.marksObtained}/{result.maxMarks}</td><td>{result.percentage}%</td><td>{result.grade}</td><td className={result.status === "Pass" ? "pass" : "fail"}>{result.status}</td><td>{result.createdAt ? new Date(result.createdAt).toLocaleDateString() : "-"}</td></tr>)}</tbody></table></div> : <EmptyState />}</section><section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Highest averages</p><h2>Top Performing Students</h2></div></div>{topStudents.length ? <div className="leader-list">{topStudents.map((student, index) => <div className="leader-row" key={student.studentId}><span className="leader-rank">{index + 1}</span><div><strong>{student.name}</strong><small>{student.rollNumber} · {student.department?.name || "Department unavailable"} · Grade {student.grade || "-"}</small></div><b>{student.averagePercentage}%</b></div>)}</div> : <EmptyState />}</section></div>
  </div>;
}
