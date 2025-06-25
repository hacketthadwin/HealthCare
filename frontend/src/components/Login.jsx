import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
// Removed: import 'react-toastify/dist/ReactToastify.css';
// In this environment, direct CSS imports from node_modules within JS files are not supported.
// For a full application, ensure react-toastify's CSS is linked globally in your index.html or main CSS bundle.

const Login = () => {
  const [username, setUsername] = useState(""); // This state is not used in the current form, consider removing if not needed.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onEachChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/v1/login", {
      email: email,
      password: password,
    })
      .then(response => {
        console.log(response.data);

        if (response.data.success) {
          const role = response.data.user.role?.trim().toLowerCase();
          localStorage.setItem("isLoggedIn", "true"); // Set the key here
          localStorage.setItem("role", role);  // store user role
          localStorage.setItem("userToken", response.data.token); // (optional) store JWT token
          toast.success("Logged in successfully!");
          console.log("Full login response:", response.data);
          setTimeout(() => {
            navigate(role === "doctor" ? "/doctor" : "/patient");
          }, 1500);
        } else {
          toast.error(response.data.message || "Invalid credentials!");
        }
      })
      .catch(error => {
        console.error(error);
        toast.error(error.response?.data?.message || "Login failed!");
      });

    console.log("Form submitted:", { username, email, password });
  };

  return (
    // Main container with radial gradient background
    <div className="min-h-screen flex items-center justify-center px-4 font-sans text-white antialiased
      bg-[radial-gradient(circle_farthest-corner_at_-24.7%_-47.3%,_rgba(6,130,165,1)_0%,_rgba(34,48,86,1)_66.8%,_rgba(15,23,42,1)_100.2%)]">

      {/* Login Form Container - now blurred and without borders/shadows */}
      <form onSubmit={onSubmit} className="w-full max-w-sm md:max-w-md lg:max-w-lg p-8 rounded-xl
                                          bg-white/20 backdrop-blur-md flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-white">LOGIN</h1> {/* Text is white */}

        {/* Email Input Field */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-6 p-3 rounded-lg font-bold
                     bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400
                     transition duration-300 ease-in-out" // Subtle transparent background, focus ring, white text and placeholder
          onChange={onEachChange}
          required
        />

        {/* Password Input Field */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-8 p-3 rounded-lg font-bold
                     bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400
                     transition duration-300 ease-in-out" // Subtle transparent background, focus ring, white text and placeholder
          onChange={onEachChange}
          required
        />

        {/* Login Button - neon styling */}
        <button
          type="submit"
          className="w-full bg-lime-500 text-white px-6 py-3 rounded-full font-extrabold text-lg
                     hover:bg-lime-400 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-lime-300
                     transition duration-300 ease-in-out uppercase tracking-wide"
        >
          Login
        </button>
      </form>

      {/* Toast messages */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default Login;
