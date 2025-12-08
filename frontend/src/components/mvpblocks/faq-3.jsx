import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

/**
 * FAQ Item Component
 */
function FAQItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      className={cn(
        "relative rounded-2xl border-2 transition-all duration-300 overflow-hidden",
        "bg-[#C2F84F]/40 dark:bg-[#476407]/40 backdrop-blur-sm", 
        isOpen 
          ? "border-[#1F3A4B] dark:border-gray-500 z-10 scale-[1.01]" 
          : "border-transparent z-0 hover:border-[#1F3A4B]/20 dark:hover:border-[#FAFDEE]/20"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <h3
          className={cn(
            "text-base md:text-lg font-bold transition-colors duration-200",
            "text-[#1F3A4B] dark:text-[#FAFDEE]"
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className="shrink-0 text-[#1F3A4B] dark:text-[#FAFDEE]"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: { height: { duration: 0.4 }, opacity: { duration: 0.25, delay: 0.1 } } 
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } } 
            }}
          >
            <div className="px-6 pb-6 pt-0 border-t border-[#1F3A4B]/10 dark:border-[#FAFDEE]/10 mt-2">
              <motion.p 
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 text-sm md:text-base font-medium leading-relaxed pt-4"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Main CongestedFAQ Component
 */
export default function CongestedFAQ() {
const faqs = [
  {
    question: "What makes this healthcare platform unique?",
    answer:
      "Our platform bridges patients and doctors with real-time appointments, secure chat, AI assistance, and a responsive dashboard for both roles",
  },
  {
    question: "How does the appointment system work?",
    answer:
      "Patients can book available time slots, and doctors can accept, reject, or reschedule requests. Both sides get instant updates with a live calendar view.",
  },
  {
    question: "Is the chat with doctors secure?",
    answer:
      "Yes, all communication is protected with role-based authentication and JWT-secured sessions, ensuring private and reliable doctor–patient conversations.",
  },
  {
    question: "Can I access the platform from mobile?",
    answer:
      "Absolutely! The entire interface is mobile-friendly, including dashboards, chat, appointments, and the AI assistant, ensuring a smooth experience anywhere.",
  },
];


  return (
    /* Changed bg to transparent but removed the forced negative margin that breaks flow */
    /* Added h-auto and block display to ensure the component calculates expansion correctly */
    <div className="w-full h-auto block relative px-4 bg-transparent transition-all duration-300">
      <div className="max-w-4xl mx-auto mt-[-3.8rem]">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <Badge
            className={cn(
              "px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest",
              "bg-[#C2F84F] dark:bg-[#476407] border-[#1F3A4B] dark:border-[#FAFDEE] text-[#1F3A4B] dark:text-[#FAFDEE]"
            )}
          >
            FAQ
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-[#1F3A4B] dark:text-[#FAFDEE]">
            Common Questions
          </h2>
          <p className="text-lg text-[#1F3A4B]/70 dark:text-[#FAFDEE]/70 max-w-xl mx-auto font-medium">
            Everything you need to know about our tools and pricing plans.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        {/* Support Section Footer - Pushed dynamically down by expanding boxes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cn(
            "mt-20 p-8 rounded-3xl text-center border-2",
            "bg-[#C2F84F]/40 dark:bg-[#476407]/40 border-[#1F3A4B]/20 dark:border-gray-500 shadow-sm backdrop-blur-sm"
          )}
        >
          <div className="bg-[#1F3A4B] dark:bg-[#FAFDEE] text-[#FAFDEE] dark:text-[#1F3A4B] inline-flex p-3 rounded-full mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h4 className="text-[#1F3A4B] dark:text-[#FAFDEE] text-2xl font-bold mb-2">
            Still have questions?
          </h4>
          <p className="text-[#1F3A4B]/70 dark:text-[#FAFDEE]/70 font-medium mb-8">
            Can't find what you're looking for? Reach out to our team.
          </p>
          <button
            className={cn(
              "px-8 py-4 rounded-xl font-bold text-lg tracking-tight transition-all duration-300",
              "bg-[#1F3A4B] dark:bg-[#FAFDEE] text-[#FAFDEE] dark:text-[#1F3A4B] hover:opacity-90 active:scale-95"
            )}
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
}