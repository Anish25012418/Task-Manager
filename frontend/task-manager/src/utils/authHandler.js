import axiosInstance from "./axiosInstance.js";

export async function authHandler({path, credentials, updateUser, navigate, setError}) {
  try {
    const response = await axiosInstance.post(path, credentials);
    const {token, role} = response.data;

    if (token) {
      localStorage.setItem("accessToken", token);
      updateUser(response.data);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }
  } catch (error) {
    localStorage.removeItem("accessToken");
    if (error.response?.data?.error || error.response?.data?.message) {
      setError(error.response.data.error || error.response.data.message);
    }else {
      setError("Something went wrong. Please try again later.");
    }
  }
}