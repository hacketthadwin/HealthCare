import {
  Building2,
  Lightbulb,
  ScreenShare,
  Trophy,
  User,
  User2,
} from "lucide-react";
import { cn } from "../../lib/utils";

const leftFeatures = [
  {
    icon: Building2,
    title: "Verified Doctors",
    description: "Connect only with certified healthcare professionals available for consultations.",
    cornerStyle: "sm:translate-x-4 sm:rounded-br-[2px]",
  },
  {
    icon: User2,
    title: "Patient Support Rooms",
    description: "Join community spaces to discuss symptoms, ask doubts, and get guidance safely.",
    cornerStyle: "sm:-translate-x-4 sm:rounded-br-[2px]",
  },
  {
    icon: Trophy,
    title: "Health Insights",
    description: "Get personalized analytics on appointments, symptoms, and medical patterns.",
    cornerStyle: "sm:translate-x-4 sm:rounded-tr-[2px]",
  },
];

const rightFeatures = [
  {
    icon: ScreenShare,
    title: "Live Consultations",
    description: "Interact with your doctor in real time through chat for quicker, clearer medical help.",
    cornerStyle: "sm:-translate-x-4 sm:rounded-bl-[2px]",
  },
  {
    icon: User,
    title: "Smart Appointment System",
    description: "Book, manage, and track doctor appointments with instant confirmations.",
    cornerStyle: "sm:translate-x-4 sm:rounded-bl-[2px]",
  },
  {
    icon: Lightbulb,
    title: "AI Health Assistant",
    description: "Ask health-related questions and receive AI-powered guidance anytime.",
    cornerStyle: "sm:-translate-x-4 sm:rounded-tl-[2px]",
  },
];


const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;
  return (
    <div className="h-full">
      <div
        className={cn(
          "relative rounded-2xl px-6 py-8 border-2 transition-all duration-300 h-full",
          // Theming: Matched to FAQ (Backdrop Blur + Transparency)
          "bg-[#C2F84F]/40 dark:bg-[#476407]/40 backdrop-blur-sm",
          "border-transparent hover:border-[#1F3A4B] dark:hover:border-[#FAFDEE]",
          feature.cornerStyle
        )}
      >
        <div className="text-[#1F3A4B] dark:text-[#FAFDEE] mb-3 text-[2rem]">
          <Icon className="h-10 w-10" />
        </div>
        <h2 className="text-[#1F3A4B] dark:text-[#FAFDEE] mb-2.5 text-2xl font-bold leading-tight">
          {feature.title}
        </h2>
        <p className="text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 text-base font-medium leading-relaxed">
          {feature.description}
        </p>

        {/* Decorative elements kept intact */}
        <span className="from-[#1F3A4B]/0 via-[#1F3A4B]/30 to-[#1F3A4B]/0 dark:via-[#FAFDEE]/30 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"></span>
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,rgba(31,58,75,0.1)_0%,transparent_100%)] dark:bg-[radial-gradient(30%_5%_at_50%_100%,rgba(250,253,238,0.1)_0%,transparent_100%)] opacity-60 pointer-events-none"></span>
      </div>
    </div>
  );
};

export default function CongestedFeatures() {
  return (
    <section className="relative w-full py-20 bg-transparent transition-colors duration-300" id="features">
      <div className="mx-auto px-4 max-w-[1200px]">
        {/* items-start is critical: ensures container grows as cards expand with text */}
        <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-3 items-start">
          
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {leftFeatures.map((feature, index) => (
              <FeatureCard key={`left-feature-${index}`} feature={feature} />
            ))}
          </div>

          {/* Center column */}
          <div className="order-[1] mb-6 self-center md:sticky md:top-24 sm:order-[0] md:mb-0">
            <div className="bg-[#C2F84F] dark:bg-[#476407] text-[#1F3A4B] dark:text-[#FAFDEE] border border-[#1F3A4B]/20 dark:border-[#FAFDEE]/20 relative mx-auto mb-6 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm font-bold tracking-widest uppercase ring-1 ring-[#1F3A4B]/10 dark:ring-[#FAFDEE]/10">
              <span className="relative z-1">Features</span>
              <span className="from-[#1F3A4B]/0 via-[#1F3A4B]/40 to-[#1F3A4B]/0 dark:via-[#FAFDEE]/40 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
            </div>
            
            <h2 className="text-[#1F3A4B] dark:text-[#FAFDEE] mb-4 text-center text-3xl font-extrabold sm:text-4xl md:text-[2.5rem] leading-tight">
              Key Benefits <br className="hidden md:block" /> of Cohorts
            </h2>
            
            <p className="text-[#1F3A4B]/70 dark:text-[#FAFDEE]/70 mx-auto max-w-[18rem] text-center font-bold leading-relaxed">
              Accelerate your growth through community-driven learning cohorts.
            </p>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {rightFeatures.map((feature, index) => (
              <FeatureCard key={`right-feature-${index}`} feature={feature} />
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}