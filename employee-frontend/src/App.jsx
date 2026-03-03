import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* Catch ALL unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;