import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>EMS</h2>

      <Link to="/dashboard" className="nav-link">
        Dashboard
      </Link>

      <Link to="/employees" className="nav-link">
        Employees
      </Link>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Navbar;