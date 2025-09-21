const API_URL = "http://localhost:5000/api/auth";

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json(); 
  } catch (err) {
    throw new Error("Invalid server response (not JSON)");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Register Error:", error.message);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

export const getToken = () => localStorage.getItem("token");

export const logoutUser = () => {
  localStorage.removeItem("token");
};
