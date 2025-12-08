import { Eye, EyeOff, Home } from "lucide-react";
import { useState } from "react";
// Import Link along with useNavigate
import { useNavigate, Link } from 'react-router-dom'; 
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("https://healthcare-97r0.onrender.com/api/v1/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.success) {
          const role = response.data.user.role?.trim().toLowerCase();
          
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', role);
          localStorage.setItem('userToken', response.data.token);
          
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
          
          toast.success("Logged in successfully!");
          
          setTimeout(() => {
            navigate(role === "doctor" ? "/doctor" : "/patient");
          }, 1500);
        } else {
          toast.error(response.data.message || "Invalid credentials!");
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login failed!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="bg-transparent flex min-h-screen w-full flex-col items-center justify-center px-4 relative">
      
      {/* Home Navigation via Link component */}
{/* AWESOME HOME BUTTON UI */}
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
            alt="MVPBlocks Logo"
            width={80}
            className="mx-auto"
          /> */}
          <div className="mt-5 space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1F3A4B] dark:text-[#FAFDEE]">
              LOGIN
            </h1>
            <p className="text-[#1F3A4B]/70 dark:text-[#FAFDEE]/70 font-medium">
              Access your dashboard to continue.
            </p>
          </div>
        </div>
        
        <form 
          onSubmit={onSubmit} 
          className="bg-[#C2F84F]/40 dark:bg-[#476407]/40 backdrop-blur-md space-y-6 p-6 shadow-2xl border-2 border-[#1F3A4B]/10 dark:border-[#FAFDEE]/10 rounded-2xl"
        >
          <div className="space-y-5">
            <div>
              <label className="font-bold text-[#1F3A4B] dark:text-[#FAFDEE] ml-1">Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-2 w-full rounded-xl border-2 border-[#1F3A4B]/10 bg-white/50 dark:bg-black/20 px-4 py-3 text-[#1F3A4B] dark:text-[#FAFDEE] font-semibold shadow-sm outline-none focus:border-[#1F3A4B] dark:focus:border-[#C2F84F] transition-all placeholder-[#1F3A4B]/30 dark:placeholder-[#FAFDEE]/30"
              />
            </div>
            
            <div>
              <label className="font-bold text-[#1F3A4B] dark:text-[#FAFDEE] ml-1">Password</label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border-2 border-[#1F3A4B]/10 bg-white/50 dark:bg-black/20 px-4 py-3 text-[#1F3A4B] dark:text-[#FAFDEE] font-semibold shadow-sm outline-none focus:border-[#1F3A4B] dark:focus:border-[#C2F84F] transition-all placeholder-[#1F3A4B]/30 dark:placeholder-[#FAFDEE]/30"
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
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#1F3A4B] dark:bg-[#C2F84F] px-4 py-4 font-extrabold text-[#FAFDEE] dark:text-[#1F3A4B] uppercase tracking-widest duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 shadow-lg"
            >
              {loading ? "Verifying Account..." : "Login"}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-2">
          <p className="text-sm font-bold text-[#1F3A4B]/60 dark:text-[#FAFDEE]/60">
            Don't have an account?{" "}
            {/* Swapped <a> for <Link> */}
            <Link to="/signup" className="text-rose-600 hover:text-rose-500 underline decoration-2 underline-offset-4 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar 
        theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
      />
    </main>
  );
};

export default Login;