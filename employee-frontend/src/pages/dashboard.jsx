import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");

  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get("/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(data.employees || data);
    } catch (error) {
      alert("Failed to fetch employees ❌");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/employees",
        {
          fullName,
          email: `${fullName.replace(" ", "").toLowerCase()}${Date.now()}@company.com`,
          phoneNumber: "9999999999",
          department,
          designation: "Employee",
          salary: 30000,
          dateOfJoining: "2024-01-01",
          employmentType: "Full-time",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFullName("");
      setDepartment("");

      fetchEmployees();
    } catch (error) {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
  } else {
    alert("Failed to fetch employees ❌");
  }
}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      <h2>Create Employee</h2>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Add Employee</button>
      </form>

      <h2>Employees:</h2>

      {employees.map((emp) => (
        <div key={emp._id} style={{ marginBottom: "10px" }}>
          <strong>{emp.fullName}</strong> — {emp.department}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;