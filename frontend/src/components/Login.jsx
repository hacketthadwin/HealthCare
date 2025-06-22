import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState("");
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
    localStorage.setItem("isLoggedIn", "true"); // <- ✅ Set the key here
    localStorage.setItem("role", role);  // store user role
    localStorage.setItem("userToken", response.data.token); // (optional) store JWT token
  toast.success("Logged in successfully!");
  console.log("Full login response:", response.data);
  // setTimeout(() => navigate('/loggedIn'), 1500);
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
<div className="bg-green-200 min-h-screen flex items-center justify-center px-4">
  <form onSubmit={onSubmit} className="w-full max-w-sm md:max-w-md lg:max-w-lg p-6 ">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">LOGIN</h1>
    
    <input
      name="email"
      type="email"
      placeholder="Email"
      className="w-full mb-4 p-2 border border-gray-300 rounded-lg font-bold bg-gray-700 text-white"
      onChange={onEachChange}
      required
    />
    
    <input
      name="password"
      type="password"
      placeholder="Password"
      className="w-full mb-4 p-2 border border-gray-300 rounded-lg font-bold bg-gray-700 text-white"
      onChange={onEachChange}
      required
    />
    
    <button
      type="submit"
      className="w-full bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600"
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
