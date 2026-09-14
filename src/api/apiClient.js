import axios from "axios";

const api = axios.create({

    baseURL: window.__APP_CONFIG__?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL,

    headers: {

        "Content-Type": "application/json"

    },

    timeout: 30000

});

export default api;