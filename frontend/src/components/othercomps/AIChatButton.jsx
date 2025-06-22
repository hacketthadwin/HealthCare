// src/components/AIChatButton.js
import React, { useState, useEffect, useRef, useContext } from 'react'; // 1. Ensure useContext is imported
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResponseContext } from '../../context/AIResponseContext'; // 2. Make sure the path to your context is correct

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [chatSize, setChatSize] = useState("medium");

  // 3. Use the context to get the setter function
  const { setLastAIMessage } = useContext(AIResponseContext);

  const getChatDimensions = () => {
    switch (chatSize) {
      case "small":
        return "w-64 h-64";
      case "large":
        return "w-[30rem] h-[35rem]";
      default:
        return "w-80 h-96";
    }
  };

  const increaseChatSize = () => {
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage = { text: inputMessage.trim(), sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    const healthKeywords = [
      // ... (your keywords remain unchanged)
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

    const isHealthRelated = healthKeywords.some(keyword =>
      inputMessage.toLowerCase().includes(keyword)
    );

    if (!isHealthRelated) {
      setMessages(prev => [...prev, { text: "Kindly ask health-related issues.", sender: 'ai' }]);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Note: Updated model name to a common one

      const chat = model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
        }
      });

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

      // Add the full AI response to the chat window
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);

      // 4. --- NEW LOGIC TO EXTRACT AND SEND DATA TO CONTEXT ---
      // This regex captures the full <ul>...</ul> block that follows "<h4>Do these things:</h4>"
      const doTheseMatch = aiResponse.match(/<h4>Do these things:<\/h4>\s*(<ul>[\s\S]*?<\/ul>)/);

      if (doTheseMatch && doTheseMatch[1]) {
        // doTheseMatch[1] contains the captured group: the entire <ul>...</ul> string
        setLastAIMessage(doTheseMatch[1].trim());
      } else {
        // If the section is not found for any reason, send an empty string
        setLastAIMessage("");
      }
      // --- END OF NEW LOGIC ---

    } catch (err) {
      console.error("AI error:", err);
      setLastAIMessage(""); // Also clear on error
      setMessages(prev => [...prev, { text: "Something went wrong!", sender: 'ai' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-14 right-14 z-50">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <span className="font-bold text-xl">AI</span>
        </button>
      ) : (
        <div className={`bg-white rounded-lg shadow-xl flex flex-col overflow-hidden ${getChatDimensions()}`}>
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg">AI Assistant</h3>
            <div className="flex items-center gap-2">
              <button onClick={decreaseChatSize} className="px-2 py-1 text-sm bg-white text-blue-600 rounded hover:bg-gray-100">&minus;</button>
              <button onClick={increaseChatSize} className="px-2 py-1 text-sm bg-white text-blue-600 rounded hover:bg-gray-100">+</button>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 focus:outline-none text-2xl font-semibold"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white self-end'
                      : 'bg-gray-200 text-gray-800 self-start'
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 flex items-center">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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