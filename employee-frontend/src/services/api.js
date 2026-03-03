import axios from "axios";

const api = axios.create({
  baseURL: "https://employee-management-backend-wr9s.onrender.com",
});

export default api;