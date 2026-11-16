import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_LANDING_PAGE_API_URL;
// export const API_URL = process.env.OMS_API_ORIGIN;


const api = axios.create({
  baseURL: API_URL,
});

export default api;
