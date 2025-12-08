import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeOff, Home } from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onEachChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    if (name === 'role') setRole(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    axios.post("http://localhost:5000/api/v1/signup", {
      email,
      password,
      name: username,
      role
    })
      .then(response => {
        if (response.data.success) {
          toast.success("Signup successful!");
          setTimeout(() => navigate('/'), 1500);
        } else {
          toast.error(response.data.message || "Signup failed!");
        }
      })
      .catch(error => {
        console.error(error);
        toast.error(error.response?.data?.message || "Signup failed!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="bg-transparent flex h-screen w-full flex-col items-center justify-center py-12 px-4 relative">
      
      {/* Floating Home Link */}
            <Link 
        to="/"
        className="absolute top-8 left-8 group"
      >
        {/* Pulsing Background Aura */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#C2F84F] to-[#1F3A4B] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        
        <div className="relative flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 bg-[#1F3A4B] dark:bg-[#FAFDEE] text-[#FAFDEE] dark:text-[#1F3A4B] font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all duration-300 group-hover:scale-110 group-active:scale-95 group-hover:shadow-[#C2F84F]/40">
          <Home size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:text-[#5f8707]" />
          <span>Home</span>
          
          {/* Subtle Shine Gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      <div className="w-full space-y-4 sm:max-w-md">
        <div className="text-center">
          {/* <img
            src="https://i.postimg.cc/j5dW4vFd/Mvpblocks.webp"
            alt="Logo"
            width={80}
            className="mx-auto"
          /> */}
          <div className="mt-5 space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1F3A4B] dark:text-[#FAFDEE]">
              SIGNUP
            </h1>
            <p className="text-[#1F3A4B]/70 dark:text-[#FAFDEE]/70 font-medium">
              Create your account to get started.
            </p>
          </div>
        </div>

        <form 
          onSubmit={onSubmit} 
          className="bg-[#C2F84F]/40 dark:bg-[#476407]/40 backdrop-blur-md space-y-5 p-6 shadow-2xl border-2 border-[#1F3A4B]/10 dark:border-[#FAFDEE]/10 rounded-2xl"
        >
          {/* Inputs kept exactly as your design requirements */}
          <div>
            <label className="font-bold text-[#1F3A4B] dark:text-[#FAFDEE] ml-1">Your Name</label>
            <input
              name="username"
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={onEachChange}
              required
              className="mt-1 w-full rounded-xl border-2 border-[#1F3A4B]/10 bg-white/50 dark:bg-black/20 px-4 py-3 text-[#1F3A4B] dark:text-[#FAFDEE] font-semibold outline-none focus:border-[#1F3A4B] dark:focus:border-[#C2F84F] transition-all placeholder-[#1F3A4B]/40 dark:placeholder-[#FAFDEE]/40"
            />
          </div>

          <div>
            <label className="font-bold text-[#1F3A4B] dark:text-[#FAFDEE] ml-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={onEachChange}
              required
              className="mt-1 w-full rounded-xl border-2 border-[#1F3A4B]/10 bg-white/50 dark:bg-black/20 px-4 py-3 text-[#1F3A4B] dark:text-[#FAFDEE] font-semibold outline-none focus:border-[#1F3A4B] dark:focus:border-[#C2F84F] transition-all placeholder-[#1F3A4B]/40 dark:placeholder-[#FAFDEE]/40"
            />
          </div>

          <div>
            <label className="font-bold text-[#1F3A4B] dark:text-[#FAFDEE] ml-1">Password</label>
            <div className="relative mt-1">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={onEachChange}
                required
                className="w-full rounded-xl border-2 border-[#1F3A4B]/10 bg-white/50 dark:bg-black/20 px-4 py-3 text-[#1F3A4B] dark:text-[#FAFDEE] font-semibold outline-none focus:border-[#1F3A4B] dark:focus:border-[#C2F84F] transition-all placeholder-[#1F3A4B]/40 dark:placeholder-[#FAFDEE]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[#1F3A4B] dark:text-[#FAFDEE]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#1F3A4B] dark:text-[#FAFDEE] ml-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={onEachChange}
              required
              className="mt-1 w-full rounded-xl border-2 border-[#1F3A4B]/10 bg-white/50 dark:bg-black/20 px-4 py-3 text-[#1F3A4B] dark:text-[#FAFDEE] font-semibold outline-none focus:border-[#1F3A4B] dark:focus:border-[#C2F84F] transition-all placeholder-[#1F3A4B]/40 dark:placeholder-[#FAFDEE]/40"
            />
          </div>

          <div className="pt-2">
            <span className="font-bold text-[#1F3A4B] dark:text-[#FAFDEE] ml-1 block mb-2 text-center">I am a...</span>
            <div className="flex justify-center gap-6">
              <label className="flex items-center space-x-2 text-[#1F3A4B] dark:text-[#FAFDEE] font-bold cursor-pointer">
                <input type="radio" name="role" value="Doctor" onChange={onEachChange} required className="accent-[#1F3A4B] dark:accent-[#C2F84F] h-4 w-4" />
                <span>Doctor</span>
              </label>
              <label className="flex items-center space-x-2 text-[#1F3A4B] dark:text-[#FAFDEE] font-bold cursor-pointer">
                <input type="radio" name="role" value="Patient" onChange={onEachChange} required className="accent-[#1F3A4B] dark:accent-[#C2F84F] h-4 w-4" />
                <span>Patient</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#1F3A4B] dark:bg-[#C2F84F] px-4 py-4 font-extrabold text-[#FAFDEE] dark:text-[#1F3A4B] uppercase tracking-widest duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 shadow-lg"
          >
            {loading ? "Verifying..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm font-bold text-[#1F3A4B]/60 dark:text-[#FAFDEE]/60">
            Already have an account?{" "}
            {/* Link component replacement for consistency */}
            <Link 
              to="/login" 
              className="text-rose-600 hover:text-rose-500 underline decoration-2 underline-offset-4 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </main>
  );
};

export default Signup;