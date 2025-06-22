import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  let role = localStorage.getItem("role");

  if (!role) {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        role = decoded.role;
        if (role) {
          localStorage.setItem("role", role);
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }

  if (isLoggedIn) {
    if (role === "Doctor") return <Navigate to="/doctor" replace />;
    if (role === "Patient") return <Navigate to="/patient" replace />;
    return <Navigate to="/" replace />; // fallback
  }

  return children;
};

export default PublicRoute;
