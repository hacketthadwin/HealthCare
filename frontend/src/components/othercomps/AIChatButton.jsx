import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResponseContext } from '../../context/AIResponseContext';
import { MessageSquare, X, Plus, Minus, Send, Sparkles } from 'lucide-react';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function AIChatButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [chatSize, setChatSize] = useState("medium");

    const { setLastAIMessage, setAiTasks } = useContext(AIResponseContext);

    // FULL logic from your original code regarding responsive sizes
    const getChatDimensions = () => {
        switch (chatSize) {
            case "small":
                return "w-[90vw] max-w-xs h-[50vh] max-h-[16rem] sm:h-[60vh] sm:max-h-[20rem]";
            case "large":
                return "w-[90vw] max-w-xl h-[80vh] max-h-[30rem] sm:max-h-[35rem] md:max-h-[40rem]";
            default:
                return "w-[90vw] max-w-md h-[70vh] max-h-[24rem] sm:max-h-[28rem]";
        }
    };

    const getInputFieldClasses = () => {
        return chatSize === "small" ? "p-1 sm:p-2 text-xs sm:text-sm" : "p-2 sm:p-3 text-sm sm:text-base";
    };

    const getSendButtonClasses = () => {
        return chatSize === "small" ? "py-1 px-2 sm:px-3 text-xs sm:text-sm ml-1" : "py-1 sm:py-2 px-3 sm:px-4 text-sm sm:text-base ml-1";
    };

    const increaseChatSize = () => {
        if (window.innerWidth < 640 && chatSize === "medium") return;
        if (chatSize === "small") setChatSize("medium");
        else if (chatSize === "medium") setChatSize("large");
    };

    const decreaseChatSize = () => {
        if (chatSize === "large") setChatSize("medium");
        else if (chatSize === "medium") setChatSize("small");
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ text: "Hi there! I am your clinical assistant. How can I help?", sender: "ai" }]);
        }
    }, [isOpen, messages.length]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newUserMessage = { text: inputMessage.trim(), sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = inputMessage;
        setInputMessage('');

        // RESTORED: Full list of keywords from your original code
        const healthKeywords = [
            "pain", "fever", "cough", "cold", "headache", "nausea", "vomiting", "diarrhea", "fatigue",
            "rash", "dizziness", "swelling", "sore", "inflammation", "shortness of breath", "bleeding",
            "chills", "sweating", "itching", "burning", "loss of appetite", "weight loss",
            "diabetes", "hypertension", "asthma", "cancer", "infection", "covid", "flu", "stroke",
            "allergy", "ulcer", "arthritis", "depression", "anxiety", "migraine", "tuberculosis",
            "cholesterol", "thyroid", "obesity", "hepatitis", "anemia", "jaundice", "pneumonia",
            "heart disease", "kidney", "liver", "lung", "acne", "eczema", "hiv", "aids",
            "cardiology", "neurology", "dermatology", "psychiatry", "pediatrics", "gynecology",
            "oncology", "radiology", "surgery", "orthopedics", "ENT", "pathology", "urology",
            "doctor", "nurse", "treatment", "therapy", "surgery", "operation", "medication", "prescription",
            "diagnosis", "checkup", "test", "scan", "x-ray", "mri", "ct scan", "blood test", "urine test",
            "consultation", "hospital", "clinic", "healthcare", "insurance", "vaccine", "vaccination",
            "injection", "dose", "tablet", "pill", "ointment", "capsule", "antibiotic",
            "head", "chest", "heart", "lung", "stomach", "skin", "eye", "ear", "nose", "throat", "hand",
            "foot", "back", "neck", "arm", "leg", "joint", "muscle", "bone", "spine", "abdomen", "brain",
            "diet", "nutrition", "exercise", "yoga", "fitness", "weight", "sleep", "stress", "hydration",
            "mental health", "well-being", "routine", "lifestyle", "rest", "recovery", "immune", "immunity"
        ];

        const isHealthRelated = healthKeywords.some(keyword => currentInput.toLowerCase().includes(keyword));
        if (!isHealthRelated) {
            setMessages(prev => [...prev, { text: "<strong>Kindly ask health-related issues.</strong>", sender: 'ai' }]);
            return;
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const chat = model.startChat({ history: [], generationConfig: { temperature: 0.7 } });

            const fullPrompt = `
You are a medical assistant chatbot for a healthcare website.

You must:
- Only answer health-related questions (symptoms, diseases, treatments, well-being, etc.)
- Use only clean HTML in your responses (no Markdown).
- Your reply format must always include two sections:

<h4>Answer:</h4>
<ul>
  <li>Start with bullet points here about the condition or issue</li>
  <li>Keep them short and helpful</li>
</ul>

<h4>Do these things:</h4>
<ul>
  <li>Write exactly 2–3 actionable health tips based on the user's issue</li>
  <li>This section must always be at the end of your reply</li>
</ul>

Important:
- Use <ul><li> for all points
- Use <strong> for highlighting important terms
- Never respond in paragraphs
- Never write anything **after** the "Do these things:" section

If the question is unrelated to health, reply only with:
<strong>Kindly ask health-related issues.</strong>

User: ${currentInput}
`;

            const result = await chat.sendMessage(fullPrompt);
            const response = await result.response;
            const aiResponse = await response.text();

            setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);

            // Task Parsing Logic (Untouched original logic)
            const doTheseMatch = aiResponse.match(/<h4>Do these things:<\/h4>\s*(<ul>[\s\S]*?<\/ul>)/);
            if (doTheseMatch && doTheseMatch[1]) {
                const html = doTheseMatch[1].trim();
                setLastAIMessage(html);

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const listItems = Array.from(doc.querySelectorAll('li')).map(li => li.textContent.trim());
                setAiTasks(listItems);
            } else {
                setLastAIMessage("");
                setAiTasks([]);
            }
        } catch (err) {
            console.error("AI error:", err);
            setMessages(prev => [...prev, { text: "System connection error. Please try again.", sender: 'ai' }]);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[200] select-none">
            {!isOpen ? (
                <button
                    onClick={toggleChat}
                    className="bg-[#C2F84F] text-[#1F3A4B] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group"
                >
                    <Sparkles className="group-hover:rotate-12 transition-transform" />
                    <div className="absolute inset-0 rounded-full border-2 border-[#C2F84F] animate-ping opacity-20" />
                </button>
            ) : (
                <div className={`rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-4 border-[#1F3A4B] ${getChatDimensions()} bg-white dark:bg-[#0a111a] transition-all duration-500`}>
                    
                    {/* UI Header: Consistent with Concierge Drawer */}
                    <div className="p-5 flex justify-between items-center bg-[#1F3A4B] text-[#FAFDEE]">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-[#C2F84F] rounded-xl"><MessageSquare size={18} className="text-[#1F3A4B]" /></span>
                            <h3 className="font-black italic uppercase text-xs tracking-widest leading-none mt-1">Clinical AI</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={decreaseChatSize} className="p-1.5 hover:bg-white/10 rounded-lg"><Minus size={16}/></button>
                            <button onClick={increaseChatSize} className="p-1.5 hover:bg-white/10 rounded-lg"><Plus size={16}/></button>
                            <button onClick={toggleChat} className="ml-2 p-1.5 bg-rose-600 rounded-full hover:bg-rose-500 transition-colors shadow-md"><X size={16} /></button>
                        </div>
                    </div>

                    {/* Messages: Frosted Clinical Style */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#FAFDEE] dark:bg-black/40 scroll-smooth">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-5 py-4 rounded-[2rem] text-[11px] font-black leading-relaxed shadow-sm transition-all ${
                                    msg.sender === 'user' 
                                    ? 'bg-[#1F3A4B] text-[#FAFDEE] rounded-tr-none' 
                                    : 'bg-[#C2F84F] text-[#1F3A4B] rounded-tl-none border border-transparent dark:border-white/5 shadow-md'
                                }`}>
                                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input: Rounded Command Style */}
                    <div className="p-4 bg-white dark:bg-transparent border-t border-[#1F3A4B]/10">
                        <div className="bg-[#1F3A4B]/5 dark:bg-white/5 p-1 rounded-full border-2 border-[#1F3A4B]/10 flex items-center shadow-inner">
                            <input
                                type="text"
                                className={`flex-1 bg-transparent px-5 py-2 text-[#1F3A4B] dark:text-white outline-none font-bold text-xs ${getInputFieldClasses()}`}
                                placeholder="Consult with AI Assistant..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                className={`h-12 w-12 sm:h-10 sm:w-10 rounded-full bg-[#1F3A4B] dark:bg-[#C2F84F] text-[#C2F84F] dark:text-[#1F3A4B] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg ${getSendButtonClasses()}`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AIChatButton;