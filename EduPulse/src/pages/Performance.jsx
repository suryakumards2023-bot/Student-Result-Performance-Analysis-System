import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const EmptyState = ({ children = "No data available yet." }) => <div className="empty-state">{children}</div>;

export default function Performance() {
  const { user } = useAuth();
  const isStudent = user?.role?.toLowerCase() === "student";
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/students", { params: { limit: 100 } }).then((response) => {
      const available = response.data.data.students;
      setStudents(available);
      if (isStudent && available[0]) setStudentId(available[0]._id);
    }).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load students."));
  }, [isStudent]);

  const analyze = async (event) => {
    event?.preventDefault();
    if (!studentId) return;
    setLoading(true);
    setError("");
    try {
      const response = await API.get(`/performance/student/${studentId}`);
      setData(response.data);
    } catch (requestError) {
      setData(null);
      setError(requestError.response?.data?.message || "Unable to load performance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStudent || !studentId) return;
    setLoading(true);
    API.get(`/performance/student/${studentId}`).then((response) => setData(response.data)).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load performance data.")).finally(() => setLoading(false));
  }, [isStudent, studentId]);

  const performance = data?.performance;
  return <div className="page performance-page">
    <div className="page-header"><div><p className="eyebrow">Academic insights</p><h1>Student Performance Analysis</h1><p>Track academic progress semester by semester.</p></div>{user?.role && <span className="role-badge">{user.role}</span>}</div>
    <form className="analysis-toolbar" onSubmit={analyze}>
      {!isStudent && <label>Student<select value={studentId} onChange={(event) => setStudentId(event.target.value)}><option value="">Select a student</option>{students.map((student) => <option key={student._id} value={student._id}>{student.studentId} - {student.name}</option>)}</select></label>}
      {!isStudent && <button className="primary-btn" disabled={!studentId || loading}>{loading ? "Analyzing..." : "Analyze"}</button>}
    </form>
    {error && <p className="notice error">{error}</p>}
    {loading && <div className="loading-state">Loading performance data...</div>}
    {!loading && data && <>
      <section className="profile-panel"><div><p className="eyebrow">Student profile</p><h2>{data.student.name}</h2><p>{data.student.studentId} · {data.student.course}</p></div><div className="profile-facts"><span><b>Department</b>{data.student.department?.name || "-"}</span><span><b>Current semester</b>{data.student.currentSemester || "-"}</span></div></section>
      <div className="performance-summary"><Summary label="Overall Percentage" value={`${performance.overallPercentage}%`} /><Summary label="Overall Grade" value={performance.overallGrade} /><Summary label="Total Subjects" value={performance.totalSubjects} /><Summary label="Passed" value={performance.passedSubjects} /><Summary label="Failed" value={performance.failedSubjects} /><Summary label="Best Semester" value={performance.bestSemester ? `Semester ${performance.bestSemester}` : "-"} /></div>
      {performance.semesterPerformance.length ? <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Progress by term</p><h2>Semester-wise Performance</h2></div></div><ResponsiveContainer width="100%" height={320}><LineChart data={performance.semesterPerformance}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="semester" tickFormatter={(value) => `Semester ${value}`} /><YAxis domain={[0, 100]} /><Tooltip formatter={(value) => [`${value}%`, "Average"]} /><Line type="monotone" dataKey="percentage" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} /></LineChart></ResponsiveContainer></section> : <EmptyState>No result data available.</EmptyState>}
      {performance.semesterPerformance.length ? <div className="semester-grid">{performance.semesterPerformance.map((semester) => <article className="semester-card" key={semester.semester}><span>Semester {semester.semester}</span><strong>{semester.percentage}%</strong><small>{semester.subjects} subjects · {semester.passedSubjects ?? "-"} passed</small></article>)}</div> : null}
      <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Detailed results</p><h2>Subject-wise Performance</h2></div></div>{performance.subjectPerformance.length ? <div className="table-container"><table><thead><tr><th>Subject</th><th>Semester</th><th>Marks</th><th>Percentage</th><th>Grade</th><th>Status</th></tr></thead><tbody>{performance.subjectPerformance.map((result) => <tr key={result.id}><td>{result.subject}<small>{result.code}</small></td><td>{result.semester}</td><td>{result.marks}/{result.maxMarks}</td><td>{result.percentage}%</td><td>{result.grade}</td><td className={result.status === "Pass" ? "pass" : "fail"}>{result.status}</td></tr>)}</tbody></table></div> : <EmptyState />}</section>
    </>}
    {!loading && !data && !error && <EmptyState>Select a student to view performance.</EmptyState>}
  </div>;
}

function Summary({ label, value }) { return <div className="summary-card"><p>{label}</p><h2>{value}</h2></div>; }
