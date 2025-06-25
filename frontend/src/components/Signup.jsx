import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
// Removed: import 'react-toastify/dist/ReactToastify.css';
// In this environment, direct CSS imports from node_modules within JS files are not supported.
// For a full application, ensure react-toastify's CSS is linked globally in your index.html or main CSS bundle.

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

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
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'role':
        setRole(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    axios.post("http://localhost:5000/api/v1/signup", {
      email,
      password,
      name: username,
      role
    })
      .then(response => {
        if (response.data.success) {
          toast.success("Signup successful!");
          setTimeout(() => navigate('/'), 1500); // Delay so toast is visible
        } else {
          toast.error(response.data.message || "Signup failed!");
        }
      })
      .catch(error => {
        console.error(error);
        toast.error(error.response?.data?.message || "Signup failed!");
      });

    console.log("Form submitted:", { username, email, password, role });
  };

  return (
    // Main container with radial gradient background, white text, no shadow
    <div className="min-h-screen flex items-center justify-center px-4 font-sans text-white antialiased
      bg-[radial-gradient(circle_farthest-corner_at_-24.7%_-47.3%,_rgba(6,130,165,1)_0%,_rgba(34,48,86,1)_66.8%,_rgba(15,23,42,1)_100.2%)]">

      {/* Signup Form Container - blurred and without borders/shadows */}
      <form onSubmit={onSubmit} className="w-full max-w-sm md:max-w-md lg:max-w-lg p-8 rounded-xl
                                          bg-white/20 backdrop-blur-md flex flex-col items-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-center text-white">SIGNUP</h1> {/* Text is white */}

        {/* Username Input Field */}
        <input
          name="username"
          type="text"
          placeholder="Your Name"
          className="w-full mb-6 p-3 rounded-lg font-bold
                     bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400
                     transition duration-300 ease-in-out" // Consistent input styling
          onChange={onEachChange}
          required
        />

        {/* Email Input Field */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-6 p-3 rounded-lg font-bold
                     bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400
                     transition duration-300 ease-in-out" // Consistent input styling
          onChange={onEachChange}
          required
        />

        {/* Password Input Field */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-lg font-bold
                     bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400
                     transition duration-300 ease-in-out" // Consistent input styling
          onChange={onEachChange}
          required
        />

        {/* Confirm Password Input Field */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-8 p-3 rounded-lg font-bold
                     bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400
                     transition duration-300 ease-in-out" // Consistent input styling
          onChange={onEachChange}
          required
        />

        {/* Role Selection - Labels in white, accent for radio buttons */}
        <label className="block text-white font-bold text-lg md:text-xl mb-3">
          <input
            type="radio"
            name="role"
            value="Doctor"
            className="mr-3 accent-cyan-400 scale-110" // Accent for radio button
            onChange={onEachChange}
            required // Made role selection required
          />
          I am a Doctor
        </label>

        <label className="block text-white font-bold text-lg md:text-xl mb-6">
          <input
            type="radio"
            name="role"
            value="Patient"
            className="mr-3 accent-cyan-400 scale-110" // Accent for radio button
            onChange={onEachChange}
            required // Made role selection required
          />
          I am a Patient
        </label>

        {/* Sign Up Button - neon styling */}
        <button
          type="submit"
          className="w-full bg-lime-500 text-white px-6 py-3 rounded-full font-extrabold text-lg
                     hover:bg-lime-400 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-lime-300
                     transition duration-300 ease-in-out uppercase tracking-wide"
        >
          Sign Up
        </button>
      </form>

      {/* Toast container for feedback messages */}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default Signup;
