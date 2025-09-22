import axios from 'axios';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export async function fetchProblems({ page = 1, limit = 100 } = {}) {
    const res = await axios.get(`${SERVER_URL}/home`, {
        params: { page, limit },
        withCredentials: true,
    });
    return res.data.problems || res.data;
}
