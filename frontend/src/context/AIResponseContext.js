import { createContext, useState } from 'react';

export const AIResponseContext = createContext();

export const AIResponseProvider = ({ children }) => {
  const [lastAIMessage, setLastAIMessage] = useState("");

  return (
    <AIResponseContext.Provider value={{ lastAIMessage, setLastAIMessage }}>
      {children}
    </AIResponseContext.Provider>
  );
};
