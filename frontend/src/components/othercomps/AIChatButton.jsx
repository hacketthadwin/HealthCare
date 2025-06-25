// src/components/AIChatButton.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResponseContext } from '../../context/AIResponseContext';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [chatSize, setChatSize] = useState("medium");

  const { setLastAIMessage, setAiTasks } = useContext(AIResponseContext);

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
      setMessages([{ text: "Hi there! How can I assist you today?", sender: "ai" }]);
    }
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = { text: inputMessage.trim(), sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

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

    const isHealthRelated = healthKeywords.some(keyword => inputMessage.toLowerCase().includes(keyword));
    if (!isHealthRelated) {
      setMessages(prev => [...prev, { text: "Kindly ask health-related issues.", sender: 'ai' }]);
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

User: ${inputMessage}
`;

      const result = await chat.sendMessage(fullPrompt);
      const response = await result.response;
      const aiResponse = await response.text();

      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);

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
      setLastAIMessage("");
      setAiTasks([]);
      setMessages(prev => [...prev, { text: "Something went wrong!", sender: 'ai' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 sm:bottom-4 right-8 sm:right-4 z-50">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="bg-emerald-500 hover:bg-emerald-400 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          <span className="font-bold text-lg sm:text-xl">AI</span>
        </button>
      ) : (
        <div className={`rounded-lg flex flex-col overflow-hidden ${getChatDimensions()} bg-white/20 backdrop-blur-md border-2 sm:border-4 border-fuchsia-400`}>
          <div className="p-2 sm:p-4 flex justify-between items-center text-white bg-white/20 backdrop-blur-sm rounded-t-lg border-b border-fuchsia-400">
            <h3 className="font-bold text-sm sm:text-lg">AI Assistant</h3>
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={decreaseChatSize} className="px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-white/30 text-white rounded hover:bg-white/50">−</button>
              <button onClick={increaseChatSize} className="px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-white/30 text-white rounded hover:bg-white/50">+</button>
              <button onClick={toggleChat} className="text-white hover:text-gray-200 focus:outline-none text-lg sm:text-2xl font-semibold">×</button>
            </div>
          </div>

          <div className="flex-1 p-2 sm:p-4 overflow-y-auto space-y-2 sm:space-y-3 bg-black/10">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] sm:max-w-[75%] px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm ${msg.sender === 'user' ? 'bg-cyan-500 text-white' : 'bg-white/30 text-white'}`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 sm:p-4 border-t border-fuchsia-400 flex items-center">
            <input
              type="text"
              className={`flex-1 rounded-lg font-bold bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300 ease-in-out ${getInputFieldClasses()}`}
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              className={`bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors duration-200 ${getSendButtonClasses()}`}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChatButton;
