import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const employeesPerPage = 5;
  const token = localStorage.getItem("token");

  // 🔐 Protect Route
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    } else {
      fetchEmployees();
    }
  }, []);

  const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await api.get("/employees?limit=50", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEmployees(data.employees || data);
  } catch (err) {
    alert("Failed to fetch employees ❌");
  }
};

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/employees",
        {
          fullName,
          email: `${fullName
            .replace(" ", "")
            .toLowerCase()}${Date.now()}@company.com`,
          phoneNumber: "9999999999",
          department,
          designation: "Employee",
          salary: 30000,
          dateOfJoining: "2024-01-01",
          employmentType: "Full-time",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFullName("");
      setDepartment("");
      fetchEmployees();
    } catch {
      alert("Failed to create employee ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await api.delete(`/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch {
      alert("Failed to delete employee ❌");
    }
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setEditName(emp.fullName);
    setEditDepartment(emp.department);
  };

  const handleUpdate = async () => {
    try {
      await api.put(
        `/employees/${editingEmployee._id}`,
        {
          fullName: editName,
          department: editDepartment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingEmployee(null);
      fetchEmployees();
    } catch {
      alert("Failed to update employee ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // 🔎 Search
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredEmployees.length / employeesPerPage
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>EMS</h2>
        <nav>
          <p
            onClick={() => (window.location.href = "/dashboard")}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </p>

          <p
            onClick={() => (window.location.href = "/dashboard")}
            style={{ cursor: "pointer" }}
          >
            Employees
          </p>

          <p
            onClick={handleLogout}
            className="logout"
            style={{ cursor: "pointer" }}
          >
            Logout
          </p>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1>Employee Dashboard</h1>
        </div>

        {/* Add Employee */}
        <div className="card">
          <h2>Add Employee</h2>
          <form onSubmit={handleCreate} className="form">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
            <button type="submit">Add</button>
          </form>
        </div>

        {/* Employees Table */}
        <div className="card">
          <h2>Employees</h2>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.fullName}</td>
                  <td>
                    <span className="badge">
                      {emp.department}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(emp)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Employee</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <input
              type="text"
              value={editDepartment}
              onChange={(e) =>
                setEditDepartment(e.target.value)
              }
            />

            <div className="modal-actions">
              <button onClick={handleUpdate}>
                Save
              </button>
              <button
                onClick={() =>
                  setEditingEmployee(null)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;