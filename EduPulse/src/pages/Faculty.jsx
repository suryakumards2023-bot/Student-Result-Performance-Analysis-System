import { useEffect, useState } from "react";
import API from "../services/api";

const blank = { facultyId: "", name: "", email: "", password: "", phone: "", department: "", joiningDate: "", status: "active" };

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [facultyResponse, departmentResponse] = await Promise.all([API.get("/faculty"), API.get("/departments")]);
      setFaculty(facultyResponse.data.data.faculty);
      setDepartments(departmentResponse.data.data.departments);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load faculty");
    }
  };

  useEffect(() => { load(); }, []);
  const update = (field, value) => setForm({ ...form, [field]: value });
  const save = async (event) => {
    event.preventDefault();
    try {
      if (editing) await API.put(`/faculty/${editing}`, form);
      else await API.post("/faculty", form);
      setOpen(false); setEditing(null); setForm(blank); load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save faculty");
    }
  };
  const edit = (member) => { setEditing(member._id); setForm({ ...blank, ...member, department: member.department?._id || "", password: "" }); setOpen(true); };

  return <div className="page">
    <div className="page-header"><div><h1>Faculty Management</h1><p>Manage faculty accounts and assignments.</p></div><button className="primary-btn" onClick={() => { setForm(blank); setEditing(null); setOpen(true); }}>+ Add Faculty</button></div>
    {error && <p className="notice error">{error}</p>}
    {open && <form className="editor-card" onSubmit={save}>{["facultyId", "name", "email", "phone", "joiningDate"].map((field) => <input key={field} required={field === "facultyId" || field === "name" || field === "email"} type={field === "email" ? "email" : field === "joiningDate" ? "date" : "text"} placeholder={field.replace(/([A-Z])/g, " $1")} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} />)}{!editing && <input required type="password" placeholder="Temporary password" value={form.password} onChange={(event) => update("password", event.target.value)} />}<select value={form.department} onChange={(event) => update("department", event.target.value)}><option value="">Select department</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select><select value={form.status} onChange={(event) => update("status", event.target.value)}><option value="active">active</option><option value="inactive">inactive</option></select><button className="primary-btn">Save</button><button type="button" className="small-btn" onClick={() => setOpen(false)}>Cancel</button></form>}
    <div className="table-container"><table><thead><tr><th>Faculty ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Joining Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{faculty.map((member) => <tr key={member._id}><td>{member.facultyId}</td><td>{member.name}</td><td>{member.email}</td><td>{member.phone || "—"}</td><td>{member.department?.name || "—"}</td><td>{member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : "—"}</td><td>{member.status || "active"}</td><td><button className="small-btn" onClick={() => edit(member)}>Edit</button> <button className="small-btn danger-btn" onClick={async () => { if (confirm("Delete this faculty account?")) { await API.delete(`/faculty/${member._id}`); load(); } }}>Delete</button></td></tr>)}</tbody></table></div>
  </div>;
}
