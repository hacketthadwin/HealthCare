import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <div className="bg-green-200 min-h-screen flex items-center justify-center px-4">
  <form onSubmit={onSubmit} className="w-full max-w-sm md:max-w-md lg:max-w-lg p-6">
    <h1 className="text-4xl lg:text-6xl font-extrabold mb-8 text-center">SIGNUP</h1>

    <input
      name="username"
      type="text"
      placeholder="Your Name"
      className="w-full mb-3 p-2 border border-gray-300 rounded-lg font-bold bg-gray-700 text-white"
      onChange={onEachChange}
    />

    <input
      name="email"
      type="email"
      placeholder="Email"
      className="w-full mb-3 p-2 border border-gray-300 rounded-lg font-bold bg-gray-700 text-white"
      onChange={onEachChange}
    />

    <input
      name="password"
      type="password"
      placeholder="Password"
      className="w-full mb-3 p-2 border border-gray-300 rounded-lg font-bold bg-gray-700 text-white"
      onChange={onEachChange}
    />

    <input
      name="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      className="w-full mb-5 p-2 border border-gray-300 rounded-lg font-bold bg-gray-700 text-white"
      onChange={onEachChange}
    />

    <label className="block text-black font-bold text-lg md:text-xl mb-3">
      <input
        type="radio"
        name="role"
        value="Doctor"
        className="mr-3 accent-black scale-110"
        onChange={onEachChange}
      />
      I am a Doctor
    </label>

    <label className="block text-black font-bold text-lg md:text-xl mb-6">
      <input
        type="radio"
        name="role"
        value="Patient"
        className="mr-3 accent-black scale-110"
        onChange={onEachChange}
      />
      I am a Patient
    </label>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600"
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
