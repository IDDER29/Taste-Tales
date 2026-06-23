import axios from "axios";

// Talks to the in-app backend at /api/v1 (same origin) by default. Cookies are
// sent so authenticated writes work. Override with NEXT_PUBLIC_API_URL only if
// the API is hosted elsewhere.
const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export default axios.create({
    baseURL,
    withCredentials: true,
});
