import axios from "axios";

// Base URL is environment-driven so production builds can point at a real API.
// Falls back to the local json-server used in development.
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000/";

export default axios.create({
    baseURL,
});
