import axios, { CanceledError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

const nPoint = "http://localhost:4000";

export default api;
export { CanceledError, nPoint };
