import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  LogOut, MessageSquare, Users, 
  Send, ChevronRight, X, Plus, User, Orbit, Stethoscope, Sun, Moon, Heart, ShieldCheck
} from 'lucide-react';

import DailyTaskCompletionChart from './othercomps/DailyTaskCompletionChart';
import DailyTaskLog from './othercomps/DailyTaskLog';
import CurrentAppointments from './othercomps/CurrentAppointments';
import AIChatButton from './othercomps/AIChatButton';

const socket = io('http://localhost:5000');

const PatientPage = () => {
    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState("User");
    const [refreshChartKey, setRefreshChartKey] = useState(0);
    const [chatView, setChatView] = useState('closed'); 
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [theme, setTheme] = useState('light');

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

    const fetchDoctors = useCallback(async (token) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/appointments/patient-doctors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const uniqueDoctorsMap = {};
            response.data.data.forEach(app => {
                if (app.doctorId && app.doctorId._id) {
                    uniqueDoctorsMap[app.doctorId._id] = {
                        id: app.doctorId._id,
                        name: app.doctorId.name || "Unknown Doctor",
                    };
                }
            });
            setDoctors(Object.values(uniqueDoctorsMap));
        } catch (err) {
            console.error("Error fetching accepted doctors:", err);
            setDoctors([]);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserName(decoded.name || "User");
                const patientId = decoded.id;
                setUserId(patientId);
                fetchDoctors(token);
            } catch (err) {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }

        socket.on('previousMessages', (prevMessages) => {
            const formattedMessages = prevMessages.map(msg => ({
                text: msg.message,
                sender: msg.sender === userId ? 'user' : 'doctor',
                timestamp: msg.timestamp,
            }));
            setMessages(formattedMessages);
        });

        socket.on('receiveMessage', (messageData) => {
            setMessages(prevMessages => [...prevMessages, {
                text: messageData.message,
                sender: messageData.senderId === userId ? 'user' : 'doctor',
                timestamp: messageData.timestamp
            }]);
        });

        return () => {
            socket.off('previousMessages');
            socket.off('receiveMessage');
        };
    }, [navigate, userId, fetchDoctors]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
    };

    const handleSelectDoctor = (doctor) => {
        const roomId = [userId, doctor.id].sort().join('_');
        setSelectedDoctor({ ...doctor, roomId });
        setChatView('chatting');
        setMessages([]);
        if (userId) socket.emit('joinRoom', { roomId, userId, role: 'patient' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && selectedDoctor) {
            socket.emit('sendMessage', {
                roomId: selectedDoctor.roomId,
                senderId: userId,
                senderName: userName,
                receiverId: selectedDoctor.id,
                message: inputMessage,
            });
            setInputMessage('');
        }
    };

    const triggerChartRefresh = useCallback(() => {
        setRefreshChartKey(prevKey => prevKey + 1);
    }, []);

return (
        <div className="min-h-screen bg-[#FAFDEE] dark:bg-[#0a111a] transition-all duration-500 text-[#1F3A4B] dark:text-[#FAFDEE] font-sans overflow-x-hidden">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20">
                <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#C2F84F] rounded-full blur-[140px] dark:blur-[120px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-cyan-400 rounded-full blur-[140px] dark:blur-[100px]" />
            </div>

            <header className="relative z-10 p-4 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="p-1 rounded-full bg-gradient-to-tr from-[#1F3A4B] to-[#C2F84F] shrink-0">
                       <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white dark:bg-[#1F3A4B] flex items-center justify-center">
                          <User size={30} className="text-[#1F3A4B] dark:text-[#C2F84F]" />
                       </div>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-[#1F3A4B] dark:text-[#FAFDEE]">
                            {userName}
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="px-3 py-1 bg-[#1F3A4B] dark:bg-[#C2F84F] text-white dark:text-[#1F3A4B] font-black text-[8px] md:text-[10px] rounded-full uppercase tracking-widest">Rank: Gold</span>
                           <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="relative flex h-10 w-20 md:h-12 md:w-[5.5rem] items-center rounded-full border border-[#1F3A4B]/10 bg-white/50 dark:bg-gray-800 backdrop-blur-xl overflow-hidden cursor-pointer" onClick={toggleTheme}>
                        <div className={`absolute h-8 w-[2rem] md:h-9 md:w-[2.4rem] rounded-full bg-[#1F3A4B] dark:bg-[#C2F84F] transition-all duration-300 ${theme === 'dark' ? 'translate-x-[2.7rem] md:translate-x-[2.7rem]' : 'translate-x-1'}`} />
                        <span className="relative z-10 flex-1 flex items-center justify-center"><Sun size={14} className={theme === 'light' ? 'text-white' : 'text-gray-400'} /></span>
                        <span className="relative z-10 flex-1 flex items-center justify-center"><Moon size={14} className={theme === 'dark' ? 'text-[#1F3A4B]' : 'text-gray-400'} /></span>
                    </div>

                    <div className="bg-[#1F3A4B]/5 dark:bg-white/10 p-2 px-4 rounded-2xl hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Status</p>
                        <p className="text-xs font-black italic">ONLINE</p>
                    </div>
                    
                    <button onClick={handleLogout} className="p-4 rounded-full bg-rose-600 shadow-lg text-white">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="relative z-10 max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-10 pb-24">
                <div className="lg:col-span-8 space-y-6 md:space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                        <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-[#1F3A4B] text-[#FAFDEE] shadow-2xl relative overflow-hidden group">
                           <Stethoscope className="absolute right-[-10px] bottom-[-10px] opacity-10 scale-150" size={100}/>
                           <p className="text-[10px] font-black uppercase text-[#C2F84F] mb-2 tracking-widest">Compliance</p>
                           <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">On Track</h3>
                        </div>
                        <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white dark:bg-white/5 border-2 border-[#1F3A4B]/10 dark:border-white/10 shadow-xl relative group">
                           <Users size={30} className="text-[#1F3A4B] dark:text-[#C2F84F] mb-4" />
                           <p className="text-[10px] font-black uppercase opacity-40 text-[#1F3A4B] dark:text-[#FAFDEE] tracking-widest">Specialists</p>
                           <h3 className="text-4xl md:text-6xl font-black italic uppercase leading-none mt-2">{doctors.length}</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-8 border border-[#1F3A4B]/10 shadow-2xl">
                             <DailyTaskCompletionChart key={refreshChartKey} />
                        </div>
                        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 border border-[#1F3A4B]/10 shadow-2xl">
                             <DailyTaskLog onTaskUpdate={triggerChartRefresh} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-[#1F3A4B]/10 shadow-3xl overflow-hidden relative">
                         <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6 md:mb-10">
                                <h2 className="text-2xl md:text-4xl font-black tracking-tighter italic text-[#1F3A4B] dark:text-[#FAFDEE]">UPCOMING VISITS</h2>
                                <Link to="/book-appointment" className="h-10 w-10 md:h-14 md:w-14 bg-[#1F3A4B] dark:bg-[#C2F84F] text-white dark:text-[#1F3A4B] rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl">
                                    <Plus size={24}/>
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <CurrentAppointments />
                            </div>
                         </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6 md:space-y-8">
                    <Link to="/community-support" className="w-full py-8 md:py-12 px-6 md:px-10 rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-[#1F3A4B] to-[#254d63] text-white flex justify-between items-center transition-all shadow-2xl border-2 border-transparent hover:border-[#C2F84F]">
                        <div className="text-left relative z-10">
                            <h2 className="text-2xl md:text-4xl font-black italic uppercase">Peer Hub</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#C2F84F] mt-1">Connect Globally</p>
                        </div>
                        <ChevronRight size={24} />
                    </Link>

                    <div className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] bg-white dark:bg-white/5 border border-[#1F3A4B]/10 flex flex-col items-center justify-center text-center gap-6 shadow-2xl cursor-pointer" onClick={() => setChatView('doctorList')}>
                         <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-[#1F3A4B] dark:bg-[#FAFDEE] text-[#C2F84F] dark:text-[#1F3A4B] flex items-center justify-center shadow-2xl">
                             <MessageSquare size={36} />
                         </div>
                         <div>
                            <h2 className="text-xl md:text-2xl font-black italic text-[#1F3A4B] dark:text-[#FAFDEE]">STAFF INTERCOM</h2>
                            <p className="text-[10px] font-black tracking-widest opacity-40 uppercase">Direct Channel ({doctors.length})</p>
                         </div>
                    </div>
                </div>
            </main>

            {/* RESPONSIVE CHAT OVERLAY */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[540px] z-[100] transition-all duration-500 will-change-transform ${chatView === 'closed' ? 'translate-x-full invisible' : 'translate-x-0 visible'}`}>
                 <div className="absolute inset-0 bg-white dark:bg-[#0d131b] border-l-4 border-[#1F3A4B] shadow-2xl backdrop-blur-2xl" />
                 <div className="h-full w-full p-6 md:p-8 flex flex-col relative z-10 text-[#1F3A4B] dark:text-[#FAFDEE]">
                    <div className="flex justify-between items-center mb-6 md:mb-10">
                        <div className="flex items-center gap-4">
                            <span className="p-2 md:p-3 bg-[#1F3A4B] dark:bg-[#C2F84F] text-[#C2F84F] dark:text-[#1F3A4B] rounded-2xl"><Heart size={20}/></span>
                            <h2 className="text-lg md:text-2xl font-black italic">Physician Intercom</h2>
                        </div>
                        <button onClick={() => setChatView('closed')} className="p-2 bg-[#1F3A4B]/5 hover:bg-rose-600 hover:text-white transition-all rounded-full"><X size={24}/></button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                         {chatView === 'doctorList' ? (
                            <div className="space-y-4 pt-4 overflow-y-auto pr-1">
                                <p className="text-[10px] font-black uppercase text-[#1F3A4B] dark:text-[#C2F84F] tracking-widest mb-4">On Duty Specialists</p>
                                {doctors.map(dr => (
                                    <button key={dr.id} onClick={() => handleSelectDoctor(dr)} className="w-full p-6 rounded-[1.5rem] bg-[#1F3A4B]/5 dark:bg-white/5 border border-[#1F3A4B]/10 flex justify-between items-center hover:bg-[#1F3A4B] hover:text-[#C2F84F] transition-all">
                                        <div className="text-left">
                                            <p className="text-[8px] opacity-40 font-black uppercase tracking-widest">Attending</p>
                                            <span className="text-lg font-black italic">{dr.name}</span>
                                        </div>
                                        <ChevronRight size={20}/>
                                    </button>
                                ))}
                                {doctors.length === 0 && <p className="text-center italic opacity-40 mt-10">No specialists assigned yet.</p>}
                            </div>
                         ) : (
                            <div className="flex-1 flex flex-col h-full overflow-hidden px-1">
                                <button onClick={() => setChatView('doctorList')} className="w-fit mb-4 text-[10px] font-black uppercase text-[#1F3A4B] dark:text-[#C2F84F] border-b border-current pb-1 flex items-center gap-2">
                                    <ChevronRight size={12} className="rotate-180"/> Return to List
                                </button>
                                <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`p-4 text-[11px] font-bold leading-relaxed max-w-[85%] rounded-2xl ${m.sender === 'user' ? 'bg-[#1F3A4B] text-[#FAFDEE] rounded-tr-none shadow-md' : 'bg-[#C2F84F] text-[#1F3A4B] rounded-tl-none'}`}>
                                                {m.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                                <form onSubmit={handleSendMessage} className="mt-6 bg-[#1F3A4B]/5 dark:bg-white/5 p-1 rounded-full border border-[#1F3A4B]/20 flex">
                                    <input value={inputMessage} onChange={(e)=>setInputMessage(e.target.value)} className="flex-1 bg-transparent px-4 py-3 outline-none font-bold text-xs" placeholder="Query clinical staff..." />
                                    <button className="h-10 w-10 rounded-full bg-[#1F3A4B] dark:bg-[#C2F84F] text-[#C2F84F] dark:text-[#1F3A4B] flex items-center justify-center transition-all"><Send size={16}/></button>
                                </form>
                            </div>
                         )}
                    </div>
                 </div>
            </div>

            <AIChatButton />
        </div>
    );
};

export default PatientPage;