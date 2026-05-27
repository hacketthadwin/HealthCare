import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Earth from "../ui/globe";
import { SparklesCore } from "../ui/sparkles";
import { Label } from "../ui/label";
import { Check, Loader2 } from "lucide-react";
import Header1 from "../UIcomponents/Header1";

export default function ContactUs1() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadParticles, setLoadParticles] = useState(false); // Hook state to defer engine weight
  
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.1 });

  // Defer sparkle particle initializer math loop until after the primary canvas mounts
  useEffect(() => {
    const timer = setTimeout(() => setLoadParticles(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="relative w-full min-h-screen flex items-center justify-center pt-40 pb-16 overflow-y-auto transition-colors duration-300 font-sans select-none"
      style={{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }}
    >
      <Header1 />
      
      {/* Background Glows */}
      <div
        className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, var(--sparkle-neon), transparent 70%)`,
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, #476407, transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 flex items-center justify-center w-full">
        <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[28px] backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative p-6 md:p-10" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex w-full gap-2 relative z-20"
              >
                <h2 className="from-foreground to-foreground/80 mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-bold md:text-5xl">
                  Contact
                </h2>
                <span className="text-[#476407] dark:text-[#C2F84F] relative z-10 w-full text-4xl font-bold tracking-tight italic md:text-5xl">
                  HealthHub
                </span>
                
                {/* Render particle initialization deferred cleanly from UI mount point threads */}
                {loadParticles && (
                  <SparklesCore
                    id="tsparticles"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={350} // Optimized density to prevent continuous render calculations frame dropping
                    className="absolute inset-0 -top-5 h-32 w-full pointer-events-none"
                    particleColor="#C2F84F"
                  />
                )}
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Have a question about appointments, doctor availability, or health support?  
                  Send us a message and our team will respond shortly.
                </p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold tracking-wide opacity-80">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full h-12 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] focus:bg-transparent dark:focus:bg-transparent focus:ring-2 focus:ring-[#C2F84F] focus:border-transparent transition-all duration-200 outline-none shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold tracking-wide opacity-80">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full h-12 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] focus:bg-transparent dark:focus:bg-transparent focus:ring-2 focus:ring-[#C2F84F] focus:border-transparent transition-all duration-200 outline-none shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold tracking-wide opacity-80">How can we help you?</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message about appointments, doctors, or health queries..."
                    required
                    className="w-full h-40 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] focus:bg-transparent dark:focus:bg-transparent focus:ring-2 focus:ring-[#C2F84F] focus:border-transparent transition-all duration-200 outline-none resize-none shadow-inner leading-relaxed"
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full pt-2"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl text-sm font-bold bg-[#476407] dark:bg-[#C2F84F] text-[#FAFDEE] dark:text-[#1F3A4B] shadow-md transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : isSubmitted ? (
                      <span className="flex items-center justify-center">
                        <Check className="mr-2 h-4 w-4" />
                        Message Sent!
                      </span>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative my-8 hidden items-center justify-center overflow-hidden px-4 min-[350px]:flex md:items-start md:px-0 md:pr-8"
            >
              <div className="flex flex-col items-center justify-center overflow-hidden w-full h-full">
                <article className="relative mx-auto h-[350px] min-h-60 w-full max-w-[450px] overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-gradient-to-b from-[#C2F84F] to-[#C2F84F]/5 p-6 text-3xl tracking-tight text-[#1F3A4B] dark:text-[#FAFDEE] md:h-[450px] md:min-h-80 md:p-8 md:text-4xl md:leading-[1.05] lg:text-5xl">
                  Your health matters.  
                  <br />
                  <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-28 md:-bottom-28 md:max-w-[550px]">
                    <Earth
                      scale={1.1}
                      baseColor={[0.76, 0.97, 0.31]}
                      markerColor={[0, 0, 0]}
                      glowColor={[0.76, 0.97, 0.31]}
                    />
                  </div>
                </article>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}