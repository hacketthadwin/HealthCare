import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, 
  MessageCircle, 
  HelpCircle, 
  User, 
  CheckCircle, 
  Activity, 
  XCircle 
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/v1';

const token = localStorage.getItem('userToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const CommunitySupport = () => {
  const [question, setQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/community/problems`);
        const initialized = response.data.map(item => ({
          ...item,
          isAnswering: false,
          newAnswerContent: ''
        }));
        setQuestionsList(initialized);
      } catch (error) {
        console.error('Error fetching questions:', error.response?.data || error.message);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = question.trim();
    if (!text) return;

    try {
      const res = await axios.post(`${API_BASE}/community/problem`, { title: text });
      setQuestionsList(prev => [
        { ...res.data, isAnswering: false, newAnswerContent: '', answers: [] },
        ...prev
      ]);
      setQuestion('');
    } catch (err) {
      console.error('Error posting question:', err.response?.data || err.message);
    }
  };

  const toggleAnswerInput = (id) => {
    setQuestionsList(prev => prev.map(q =>
      q._id === id ? { ...q, isAnswering: !q.isAnswering } : q
    ));
  };

  const handleAnswerChange = (id, value) => {
    setQuestionsList(prev => prev.map(q =>
      q._id === id ? { ...q, newAnswerContent: value } : q
    ));
  };

  const submitAnswer = async (id) => {
    const questionObj = questionsList.find(q => q._id === id);
    const content = (questionObj.newAnswerContent || '').trim();
    if (!content) return;

    try {
      const res = await axios.post(`${API_BASE}/community/answer/${id}`, { content });
      const newAnswer = res.data;

      setQuestionsList(prev => prev.map(q => {
        if (q._id === id) {
          return {
            ...q,
            isAnswering: false,
            newAnswerContent: '',
            answers: [...(q.answers || []), newAnswer]
          };
        }
        return q;
      }));
    } catch (err) {
      console.error('Error submitting answer:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFDEE] dark:bg-[#0a111a] transition-all duration-500 font-sans pb-24 relative overflow-hidden">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#C2F84F] rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-cyan-400 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 pt-16">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none text-[#1F3A4B] dark:text-[#FAFDEE] mb-4">
            Peer <span className="text-[#1F3A4B]/40 dark:text-[#C2F84F]">Hub</span>
          </h1>
          <p className="text-[12px] font-black uppercase tracking-[0.3em] opacity-60 text-[#1F3A4B] dark:text-[#FAFDEE]">
            Verified Community Support Base
          </p>
        </div>

        {/* POST QUESTION BOX */}
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col sm:flex-row items-center mb-16 gap-4 bg-white dark:bg-white/5 backdrop-blur-2xl border-2 border-[#1F3A4B]/10 dark:border-white/10 p-4 rounded-[3rem] shadow-2xl"
        >
          <div className="flex-1 w-full flex items-center px-4 gap-4">
            <HelpCircle className="text-[#1F3A4B] dark:text-[#C2F84F] opacity-40" />
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask the community about clinical protocols..."
              className="w-full bg-transparent py-4 text-[#1F3A4B] dark:text-white placeholder-[#1F3A4B]/40 dark:placeholder-white/40 font-bold outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-4 bg-[#1F3A4B] dark:bg-[#C2F84F] text-white dark:text-[#1F3A4B] font-black italic rounded-[2rem] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send size={18} />
            POST HUB
          </button>
        </form>

        {/* FEED */}
        <div className="space-y-8">
          {questionsList.map(q => (
            <div
              key={q._id}
              className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[3rem] border-2 border-[#1F3A4B]/5 dark:border-white/5 p-8 transition-all hover:border-[#1F3A4B]/20 dark:hover:border-white/20"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-[#1F3A4B] text-[#C2F84F]">
                    <MessageCircle size={24}/>
                  </div>
                  <p className="text-2xl font-black italic tracking-tight text-[#1F3A4B] dark:text-[#FAFDEE] uppercase">
                    {q.title}
                  </p>
                </div>
                <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase ${q.answers?.length > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                  {q.answers?.length > 0 ? <CheckCircle size={12}/> : <Activity size={12}/>}
                  {q.answers?.length > 0 ? 'Verified' : 'Unresolved'}
                </span>
              </div>

              {/* ANSWERS CONTAINER */}
              {q.answers?.length > 0 && (
                <div className="space-y-4 mb-8 border-l-4 border-[#C2F84F]/30 pl-6">
                  {q.answers.map(ans => (
                    <div key={ans._id} className="relative p-4 rounded-2xl bg-[#1F3A4B]/5 dark:bg-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={14} className="opacity-40" />
                        <strong className="text-[10px] font-black uppercase tracking-widest opacity-40">
                          {ans.author?.name || 'hub_peer'}
                        </strong>
                      </div>
                      <p className="text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 text-sm font-bold leading-relaxed">
                        {ans.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* INPUT AREA */}
              {q.isAnswering ? (
                <div className="space-y-4 pt-6 border-t-2 border-[#1F3A4B]/5">
                  <textarea
                    value={q.newAnswerContent}
                    onChange={e => handleAnswerChange(q._id, e.target.value)}
                    rows={3}
                    className="w-full p-6 bg-[#1F3A4B]/5 dark:bg-white/5 rounded-3xl text-[#1F3A4B] dark:text-white font-bold outline-none border-2 border-transparent focus:border-[#C2F84F] transition-all"
                    placeholder="Provide supportive knowledge..."
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => submitAnswer(q._id)}
                      className="px-8 py-3 bg-[#1F3A4B] dark:bg-[#C2F84F] text-white dark:text-[#1F3A4B] font-black rounded-2xl transition-all"
                    >
                      SUBMIT
                    </button>
                    <button
                      onClick={() => toggleAnswerInput(q._id)}
                      className="px-8 py-3 bg-[#1F3A4B]/10 dark:bg-white/10 font-black rounded-2xl flex items-center gap-2 hover:bg-[#1F3A4B]/20"
                    >
                      <XCircle size={18}/> CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => toggleAnswerInput(q._id)}
                  className="px-10 py-4 bg-[#C2F84F] text-[#1F3A4B] font-black italic rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-lg border border-[#1F3A4B]/10"
                >
                  ENGAGE HUB
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitySupport;