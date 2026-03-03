import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Navbar from "./components/navbar";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      {token && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;