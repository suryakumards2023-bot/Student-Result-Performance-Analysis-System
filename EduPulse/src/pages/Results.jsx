import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const blank = {
  student: "",
  subject: "",
  semester: "",
  examType: "Final",
  marksObtained: "",
  maxMarks: "100",
  remarks: ""
};

export default function Results() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [studentProfile, setStudentProfile] = useState(null);

  const isStudent = user?.role?.toLowerCase() === "student";

  const load = async () => {
    try {
      if (isStudent) {
        // For students: fetch their own results only
        const profile = await API.get("/students");
        const student = profile.data.data.students[0];
        if (!student) throw new Error("No student profile linked to your account");
        setStudentProfile(student);

        const resultsRes = await API.get("/results");
        const studentResults = resultsRes.data.data.results.filter(
          (r) => r.student?._id === student._id || r.student === student._id
        );
        setResults(studentResults);
      } else {
        // For admin/faculty: fetch all results
        const [r, s, u] = await Promise.all([
          API.get("/results"),
          API.get("/students", { params: { limit: 100 } }),
          API.get("/subjects")
        ]);
        setResults(r.data.data.results);
        setStudents(s.data.data.students);
        setSubjects(u.data.data.subjects);
      }
    } catch (e) {
      setError(e.response?.data?.message || "Could not load results");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/results/${editing}`, form);
      } else {
        await API.post("/results", form);
      }
      setOpen(false);
      setForm(blank);
      setEditing(null);
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not save result");
    }
  };

  const deleteResult = async (id) => {
    if (confirm("Delete result?")) {
      try {
        await API.delete(`/results/${id}`);
        load();
      } catch (e) {
        setError(e.response?.data?.message || "Could not delete result");
      }
    }
  };

  const upload = async () => {
    if (!file) return setError("Choose a CSV or Excel file first.");
    try {
      const data = new FormData();
      data.append("file", file);
      const r = await API.post("/upload/results", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(`${r.data.successful} records imported; ${r.data.failed} skipped.`);
      setFile(null);
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed");
    }
  };

  // Student view - read-only
  if (isStudent) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>My Results</h1>
            <p>Your academic results and performance</p>
          </div>
          <span className="role-badge">Student</span>
        </div>

        {error && <p className="notice error">{error}</p>}

        {results.length === 0 ? (
          <div className="empty-state">No results available yet</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Semester</th>
                  <th>Exam Type</th>
                  <th>Marks Obtained</th>
                  <th>Max Marks</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const percentage = Math.round((r.marksObtained / r.maxMarks) * 100);
                  const status = percentage >= 40 ? "Pass" : "Fail";
                  return (
                    <tr key={r._id}>
                      <td>{r.subject?.name || r.subject || "-"}</td>
                      <td>{r.semester}</td>
                      <td>{r.examType}</td>
                      <td>{r.marksObtained}</td>
                      <td>{r.maxMarks}</td>
                      <td>{percentage}%</td>
                      <td className={status === "Pass" ? "pass" : "fail"}>{status}</td>
                      <td>{r.remarks || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Admin/Faculty view - full management
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Result Management</h1>
          <p>Add, update, upload, or download verified student results.</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => {
            setForm(blank);
            setEditing(null);
            setOpen(true);
          }}
        >
          + Add Result
        </button>
      </div>

      <div className="upload-bar">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="small-btn" onClick={upload}>
          Upload results
        </button>
        <span>
          Columns: studentId, subjectCode, semester, marksObtained (optional:
          examType, maxMarks, remarks)
        </span>
      </div>

      {error && <p className="notice error">{error}</p>}
      {message && <p className="notice success">{message}</p>}

      {open && (
        <form className="editor-card" onSubmit={save}>
          <select
            required
            value={form.student}
            onChange={(e) => setForm({ ...form, student: e.target.value })}
          >
            <option value="">Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.studentId} — {s.name}
              </option>
            ))}
          </select>

          <select
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          >
            <option value="">Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.code} — {s.name}
              </option>
            ))}
          </select>

          {["semester", "marksObtained", "maxMarks"].map((k) => (
            <input
              required
              key={k}
              type="number"
              placeholder={k.replace(/([A-Z])/g, " $1")}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          ))}

          <select
            value={form.examType}
            onChange={(e) => setForm({ ...form, examType: e.target.value })}
          >
            {["Final", "Mid Term", "Internal", "Practical"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>

          <input
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />

          <button className="primary-btn">Save</button>
          <button type="button" className="small-btn" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const percentage = Math.round((r.marksObtained / r.maxMarks) * 100);
              const status = percentage >= 40 ? "Pass" : "Fail";
              let grade = "F";
              if (percentage >= 90) grade = "A+";
              else if (percentage >= 80) grade = "A";
              else if (percentage >= 70) grade = "B";
              else if (percentage >= 60) grade = "C";
              else if (percentage >= 50) grade = "D";

              return (
                <tr key={r._id}>
                  <td>{r.student?.name}</td>
                  <td>{r.subject?.code}</td>
                  <td>{r.marksObtained}/{r.maxMarks}</td>
                  <td>{percentage}%</td>
                  <td>{grade}</td>
                  <td className={status === "Pass" ? "pass" : "fail"}>{status}</td>
                  <td>
                    <button
                      className="small-btn"
                      onClick={() => {
                        setForm({
                          ...blank,
                          student: r.student?._id,
                          subject: r.subject?._id,
                          semester: r.semester,
                          examType: r.examType,
                          marksObtained: r.marksObtained,
                          maxMarks: r.maxMarks,
                          remarks: r.remarks || ""
                        });
                        setEditing(r._id);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="small-btn"
                      onClick={() => window.open(`http://localhost:5000/api/results/student/${r.student?._id}/pdf`, "_blank")}
                    >
                      PDF
                    </button>
                    <button
                      className="small-btn danger-btn"
                      onClick={() => deleteResult(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!results.length && (
          <p className="empty-state">No results have been recorded.</p>
        )}
      </div>
    </div>
  );
}
