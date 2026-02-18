import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";

export const registerUser = async (email, password) => {
  return api.post("/auth/register", { email, password });
};

export const verifyOTP = async (email, otp) => {
  return api.post("/auth/verify-otp", { email, otp });
};

export const loginUser = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("authToken", data.token);
  return data;
};

export const getProfile = async () => {
  return api.get("/auth/profile");
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
  toast({
    title: "Logout Successfully",
  });
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
};
