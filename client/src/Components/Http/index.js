import axios from "axios";

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const sendOTP = (data) => api.post("/api/send-otp", data);

export const verifyOTP = (data) => api.post("/api/verify-otp", data);

export const activate = (data) => api.post("/api/activate", data);

export const logout = (data) => api.post("/api/logout", data);

export const createRooms = (data) => api.post("/api/rooms", data);

export const getAllRooms = () => api.get("/api/rooms");

export const getRoomById = (id) => api.get(`/api/rooms/${id}`);

export const updateRoom = (data) => api.patch("/api/rooms", data);

export const sendEmail = (data) => api.post("/api/sendEmail", data);

// Interceptors
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, {
          withCredentials: true,
        });

        return api.request(originalRequest);
      } catch (err) {
        console.log(err.message);
      }
    }
    throw error;
  }
);

export default api;
