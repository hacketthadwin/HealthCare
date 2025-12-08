import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import { LogOut, MessageSquare, Users, Send, ChevronRight, X, Stethoscope, Sun, Moon, Clock, UserCheck, ArrowLeft } from 'lucide-react';

const socket = io('https://healthcare-97r0.onrender.com');

const DoctorPage = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("User");
  const [patients, setPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPatient, setChatPatient] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [myScheduledAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [theme, setTheme] = useState('light');
  
  const [showPatientList, setShowPatientList] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (isDark ? 'dark' : 'light');
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const fetchAppointments = React.useCallback(async () => {
    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/login"); return; }
    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.name || "User");
      setUserId(decoded.id);
    } catch { localStorage.clear(); navigate("/login"); return; }
    try {
      const res = await axios.get("https://healthcare-97r0.onrender.com/api/v1/appointments/doctorappointment", { headers: { Authorization: `Bearer ${token}` } });
      const allAppointments = res.data.data;
      const pending = allAppointments.filter(app => app.status === 'pending');
      const accepted = allAppointments.filter(app => app.status === 'accepted' || app.status === 'completed');
      const formattedPendingRequests = pending.map(app => ({ id: app._id, patient: app.patientId?.name || "Unknown Patient", reason: app.reason, date: new Date(app.appointmentDate).toLocaleDateString(), time: new Date(app.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), originalApp: app }));
      const formattedPatientList = accepted.map(app => ({ id: app.patientId?._id, name: app.patientId?.name || "Unknown Patient", symptoms: app.reason, status: app.status }));
      setPendingRequests(formattedPendingRequests);
      setPatients(formattedPatientList);
    } catch (err) {
      toast.error("Error loading appointments");
      if (err.response && err.response.status === 401) { localStorage.clear(); navigate("/login"); }
    }
  }, [navigate]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  useEffect(() => {
    if (!userId) return;
    socket.on('previousMessages', (prevMessages) => {
      const formattedMessages = prevMessages.map(msg => ({ text: msg.message, sender: msg.sender === userId ? 'doctor' : 'patient', timestamp: msg.timestamp }));
      setMessages(formattedMessages);
    });
    socket.on('receiveMessage', (messageData) => {
      setMessages(prevMessages => [...prevMessages, { text: messageData.message, sender: messageData.senderId === userId ? 'doctor' : 'patient', timestamp: messageData.timestamp }]);
    });
    return () => { socket.off('previousMessages'); socket.off('receiveMessage'); };
  }, [userId]);

  const handleOpenChat = (patient) => {
    setChatPatient(patient);
    setChatOpen(true);
    setMessages([]);
    const roomId = [userId, patient.id].sort().join('_');
    if (userId) socket.emit('joinRoom', { roomId, userId, role: 'doctor' });
  };

  const handleCloseChat = () => { setChatOpen(false); setChatPatient(null); setMessages([]); setInputMessage(''); };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && chatPatient) {
      const roomId = [userId, chatPatient.id].sort().join('_');
      socket.emit('sendMessage', { roomId, senderId: userId, senderName: userName, receiverId: chatPatient.id, message: inputMessage });
      setInputMessage('');
    }
  };

  const handleLogout = () => { localStorage.removeItem('userToken'); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('role'); delete axios.defaults.headers.common['Authorization']; window.location.href = '/login'; };

  const handleRequest = async (appointmentId, action) => {
    const token = localStorage.getItem("userToken");
    try {
      const newStatus = action === "accept" ? "accepted" : "rejected";
      await axios.patch(`https://healthcare-97r0.onrender.com/api/v1/appointments/${appointmentId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Appointment ${action}ed successfully!`);
      fetchAppointments();
    } catch (err) { toast.error(`Failed to ${action} appointment.`); }
  };

  return (
    <div className="min-h-screen bg-[#FAFDEE] dark:bg-[#0a111a] transition-all duration-500 text-[#1F3A4B] dark:text-[#FAFDEE] font-sans overflow-x-hidden">
      <ToastContainer autoClose={2000} />
      
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#C2F84F] rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-[#C2F84F] rounded-full blur-[140px]" />
      </div>

      <header className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex items-center gap-6">
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#1F3A4B] to-[#C2F84F]">
            <div className="h-20 w-20 rounded-full bg-white dark:bg-[#1F3A4B] flex items-center justify-center">
              <Stethoscope size={40} className="text-[#1F3A4B] dark:text-[#C2F84F]" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Dr. {userName}</h1>
            <div className="flex justify-center md:justify-start items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-[#1F3A4B] dark:bg-[#C2F84F] text-white dark:text-[#1F3A4B] font-black text-[10px] rounded-full uppercase">Portal Official</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-[5.5rem] items-center rounded-full border-2 border-[#1F3A4B]/10 dark:border-white/10 bg-white/50 dark:bg-gray-800 transition-all cursor-pointer" onClick={toggleTheme}>
            <div className={`absolute h-9 w-[2.4rem] rounded-full bg-[#1F3A4B] dark:bg-[#C2F84F] shadow-md transition-all duration-300 ${theme === 'dark' ? 'translate-x-[2.7rem]' : 'translate-x-1'}`} />
            <span className="relative z-10 flex-1 flex items-center justify-center"><Sun size={18} className={theme === 'light' ? 'text-white' : 'text-gray-400'} /></span>
            <span className="relative z-10 flex-1 flex items-center justify-center"><Moon size={18} className={theme === 'dark' ? 'text-[#1F3A4B]' : 'text-gray-400'} /></span>
          </div>
          <button onClick={handleLogout} className="p-5 rounded-full bg-rose-600 shadow-xl text-white hover:scale-110 active:scale-90"><LogOut size={24} /></button>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 pb-24">
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[3rem] bg-[#1F3A4B] text-[#FAFDEE] shadow-2xl relative overflow-hidden group">
              <UserCheck className="absolute right-[-10px] bottom-[-10px] opacity-10 scale-150 transition-all duration-700" size={120} />
              <p className="text-[12px] font-black uppercase text-[#C2F84F] mb-4 tracking-[0.2em]">Active Patients</p>
              <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">{patients.length} Registered</h3>
            </div>
            <div className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border-2 border-[#1F3A4B]/10 dark:border-white/10 shadow-xl overflow-hidden group">
              <Clock className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:rotate-12 transition-transform duration-500" size={120} />
              <p className="text-[12px] font-black uppercase opacity-40 text-[#1F3A4B] dark:text-[#FAFDEE] tracking-[0.2em]">Waitlist Queue</p>
              <h3 className="text-3xl md:text-4xl font-black italic uppercase leading-none mt-2">{pendingRequests.length} Clinical Requests</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[4rem] p-6 md:p-10 border-2 border-[#1F3A4B]/10 dark:border-white/20">
              <h2 className="text-2xl font-black italic tracking-tighter mb-6 uppercase">Diary</h2>
               <style>{`
                .react-calendar { border: none !important; background: transparent !important; width: 100% !important; box-shadow: none !important; }
                .react-calendar__navigation { margin-bottom: 1rem; }
                .react-calendar__navigation button { font-weight: 900 !important; font-style: italic; border: none !important; background: none !important; min-width: 44px; color: #1F3A4B !important; transition: all 0.3s; }
                .dark .react-calendar__navigation button { color: #FAFDEE !important; }
                .react-calendar__navigation button:enabled:hover { color: #C2F84F !important; }
                .react-calendar__month-view__weekdays__weekday { text-transform: uppercase; font-weight: 900; opacity: 0.6; color: #1F3A4B; }
                .dark .react-calendar__month-view__weekdays__weekday { color: #FAFDEE; }
                .react-calendar__tile { padding: 1.5em 0.5em !important; border-radius: 1.5rem !important; font-weight: 800 !important; color: inherit; border: none !important; }
                .react-calendar__tile--active { background: #1F3A4B !important; color: #C2F84F !important; }
                .dark .react-calendar__tile--active { background: #C2F84F !important; color: #1F3A4B !important; }

                /* Mobile responsiveness for the calendar */
                @media (max-width: 768px) {
                  .react-calendar__tile { 
                    padding: 0.8em 0.2em !important; 
                    font-size: 0.8rem;
                  }
                  .react-calendar__navigation button {
                    font-size: 0.85rem;
                    min-width: 32px;
                  }
                }
              `}</style>
              <Calendar onChange={setCalendarDate} value={calendarDate} />
            </div>

            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[4rem] p-10 border-2 border-[#1F3A4B]/10 dark:border-white/20 shadow-2xl overflow-y-auto min-h-[400px]">
               <h2 className="text-2xl font-black italic tracking-tighter mb-6 uppercase">Appointments</h2>
               <div className="space-y-4">
                {myScheduledAppointments.length === 0 ? <p className="text-center py-20 opacity-40 italic font-black text-xs uppercase tracking-[0.2em]">Registry Clear</p> : myScheduledAppointments.map(app => (
                  <div key={app.id} className="p-6 rounded-3xl bg-[#1F3A4B]/5 border border-black/5 flex justify-between items-center transition-all">
                    <div><p className="font-black italic text-lg uppercase">{app.patient}</p><p className="text-xs opacity-60 font-black tracking-widest uppercase">{app.time}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-[4rem] p-12 border-2 border-[#1F3A4B]/10 shadow-3xl">
            <h2 className="text-4xl font-black italic mb-10 flex items-center gap-4 uppercase tracking-tighter">
              <Clock size={36} className="text-[#C2F84F]"/> Triage Queue
            </h2>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {pendingRequests.length === 0 ? (
                <p className="text-center py-20 italic font-black text-lg uppercase tracking-tighter opacity-40">no pending requests</p>
              ) : (
                pendingRequests.map(req => (
                  <div key={req.id} className="p-8 rounded-[3rem] bg-[#1F3A4B]/5 dark:bg-white/5 border-2 border-transparent hover:border-[#C2F84F] flex flex-col md:flex-row justify-between md:items-center group transition-all">
                    <div className="mb-4 md:mb-0">
                      <p className="text-xs font-black uppercase text-[#C2F84F] mb-1">{req.time}</p>
                      <p className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">{req.patient}</p>
                      <p className="text-xs opacity-60 font-bold mt-2">REASON: {req.reason}</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleRequest(req.id, "accept")} className="px-10 py-4 bg-[#C2F84F] text-[#1F3A4B] font-black rounded-2xl shadow-lg text-[10px] uppercase hover:scale-105 transition-all">Accept</button>
                      <button onClick={() => handleRequest(req.id, "reject")} className="p-4 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><X size={20} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <button onClick={() => navigate("/community-support")} className="w-full py-12 px-10 rounded-[4rem] bg-gradient-to-br from-[#1F3A4B] to-[#2a4d61] text-white flex justify-between items-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase">PEER HUB</h2>
            <ChevronRight size={32} />
          </button>

          <div className="bg-white dark:bg-[#1F3A4B]/50 rounded-[4rem] p-10 border-2 border-[#1F3A4B]/10 shadow-3xl backdrop-blur-md relative overflow-hidden">
            <h2 className="text-2xl font-black italic uppercase mb-10">Registry</h2>
            
            <div className="block lg:hidden">
              <button 
                onClick={() => setShowPatientList(true)}
                className="w-full py-10 px-8 rounded-[3rem] bg-[#1F3A4B] text-[#C2F84F] flex justify-between items-center group relative overflow-hidden shadow-xl active:scale-95 transition-all"
              >
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Member Records</p>
                  <h3 className="text-2xl font-black italic uppercase">Open List</h3>
                </div>
                <Users size={32} />
              </button>
            </div>

            <div className="hidden lg:block space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
              {patients.length === 0 ? <p className="text-center py-20 italic opacity-30">Registry Clear</p> : 
                patients.map(p => (
                <div key={p.id} className="p-8 rounded-[3rem] bg-[#1F3A4B]/5 dark:bg-white/5 border border-transparent hover:border-[#C2F84F] flex flex-col items-start transition-all">
                  <p className="text-2xl font-black italic uppercase leading-none mb-2">{p.name}</p>
                  <div className="flex justify-between w-full items-center">
                    <span className="text-[10px] font-black uppercase opacity-60">Status: Active</span>
                    <button onClick={() => handleOpenChat(p)} className="p-4 rounded-full bg-[#1F3A4B] dark:bg-[#C2F84F] text-white dark:text-[#1F3A4B] shadow-lg"><MessageSquare size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className={`fixed inset-0 z-[120] bg-[#FAFDEE] dark:bg-[#0a111a] transition-all duration-500 lg:hidden ${showPatientList ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-6 mb-12">
            <button onClick={() => setShowPatientList(false)} className="p-4 rounded-full bg-[#1F3A4B] text-white"><ArrowLeft size={24}/></button>
            <h2 className="text-3xl font-black italic uppercase">Clinical Registry</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 pb-12 pr-2 scrollbar-hide">
            {patients.map(p => (
              <div 
                key={p.id} 
                onClick={() => { handleOpenChat(p); setShowPatientList(false); }}
                className="p-10 rounded-[3rem] bg-[#1F3A4B]/5 border-2 border-[#1F3A4B]/10 active:border-[#C2F84F] flex justify-between items-center transition-all shadow-md"
              >
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">{p.name}</h3>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">Status: Registered</p>
                </div>
                <MessageSquare size={24} className="text-[#1F3A4B] opacity-40" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[540px] z-[150] transition-all duration-500 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-white/95 dark:bg-[#0d131b]/95 border-l-4 border-[#1F3A4B] shadow-2xl backdrop-blur-2xl" />
        <div className="h-full p-8 flex flex-col relative z-10 text-[#1F3A4B] dark:text-[#FAFDEE]">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <span className="p-3 bg-[#1F3A4B] dark:bg-[#C2F84F] rounded-2xl text-[#C2F84F] dark:text-[#1F3A4B]"><MessageSquare size={24}/></span>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">{chatPatient?.name}</h2>
            </div>
            <button onClick={handleCloseChat} className="p-3 rounded-full hover:bg-rose-600 hover:text-white transition-all"><X size={24}/></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 px-2 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-6 text-[11px] font-black max-w-[85%] rounded-3xl shadow-md ${m.sender === 'doctor' ? 'bg-[#1F3A4B] text-[#FAFDEE] rounded-tr-none' : 'bg-[#C2F84F] text-[#1F3A4B] rounded-tl-none'}`}>{m.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="mt-8 bg-[#1F3A4B]/5 dark:bg-white/5 p-2 rounded-full border-2 border-[#1F3A4B]/10 flex">
            <input value={inputMessage} onChange={(e)=>setInputMessage(e.target.value)} className="flex-1 bg-transparent px-6 py-3 font-black text-xs outline-none" placeholder="Advice..." />
            <button type="submit" className="h-12 w-12 rounded-full bg-[#1F3A4B] dark:bg-[#C2F84F] text-[#C2F84F] dark:text-[#1F3A4B] flex items-center justify-center shadow-lg"><Send size={18}/></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;