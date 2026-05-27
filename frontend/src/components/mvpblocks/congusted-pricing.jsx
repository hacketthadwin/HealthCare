import React, { useState, useRef, useId } from 'react';
import { buttonVariants } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { cn } from "../../lib/utils";
import { Check, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';

const NumberFlow = ({ value, format, transformTiming, willChange, className }) => {
  const formattedValue = new Intl.NumberFormat('en-US', format).format(value);
  return (
    <span 
      className={className}
      style={{ 
        transition: `all ${transformTiming?.duration || 500}ms ${transformTiming?.easing || 'ease-out'}`,
      }}
    >
      {formattedValue}
    </span>
  );
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const plans = [
  {
    name: "PATIENT PLAN",
    price: "9",
    yearlyPrice: "7",
    period: "per month",
    features: [
      "Priority matchmaking with available doctors",
      "Faster appointment confirmations",
      "Access to upgraded AI health assistant",
      "Unlimited symptom checks",
      "Priority chat response from doctors",
      "Community health discussions",
    ],
    description: "Best for patients who want faster responses and enhanced AI support.",
    buttonText: "Subscribe as Patient",
    href: "/signup",
    isPopular: false,
  },
  {
    name: "PREMIUM DOCTOR PLAN",
    price: "39",
    yearlyPrice: "29",
    period: "per month",
    features: [
      "Premium Doctor Badge on profile",
      "Higher visibility to patients",
      "Priority listing in search results",
      "Advanced analytics for patient engagement",
      "Faster support and verification",
      "Unlimited appointments",
      "Direct patient chat access with priority routing",
    ],
    description: "Ideal for doctors who want more visibility, insights, and patient reach.",
    buttonText: "Upgrade as Doctor",
    href: "/signup",
    isPopular: true,
  },
  {
    name: "HOSPITAL PRO PLAN",
    price: "149",
    yearlyPrice: "119",
    period: "per month",
    features: [
      "Register unlimited doctors under one hospital",
      "Hospital verification badge",
      "Custom dashboard for staff and specialists",
      "Advanced reporting and analytics",
      "Priority support for onboarding doctors",
      "Dedicated account manager",
      "API access for hospital systems",
      "Bulk doctor profile management",
    ],
    description: "Designed for clinics and hospitals wanting a unified management system.",
    buttonText: "Register Hospital",
    href: "/contact",
    isPopular: false,
  },
];


const MotionDiv = ({ children, initial, whileInView, viewport, transition, className, style }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && viewport?.once) {
          setIsVisible(true);
          observer.disconnect();
        } else if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (!viewport?.once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [viewport?.once]);

  const getTransform = () => {
    if (!isVisible || !whileInView) return {};
    
    const transforms = [];
    if (whileInView.y !== undefined) transforms.push(`translateY(${whileInView.y}px)`);
    if (whileInView.x !== undefined) transforms.push(`translateX(${whileInView.x}px)`);
    if (whileInView.scale !== undefined) transforms.push(`scale(${whileInView.scale})`);
    
    return {
      transform: transforms.length > 0 ? transforms.join(' ') : 'none',
      opacity: whileInView.opacity !== undefined ? whileInView.opacity : 1,
      transition: `all ${transition?.duration || 0.5}s ${transition?.type === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'}`,
      transitionDelay: `${transition?.delay || 0}s`,
    };
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...getTransform(),
        opacity: isVisible ? (whileInView?.opacity !== undefined ? whileInView.opacity : 1) : (initial?.opacity || 1),
      }}
    >
      {children}
    </div>
  );
};

export default function CongestedPricing() {
  const [isMonthly, setIsMonthly] = useState(true);
  const { isDarkMode } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef(null);
  const switchId = useId();

  const handleToggle = (checked) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ['#476407', '#C2F84F', '#FAFDEE', '#1F3A4B'],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-20 px-4 bg-[#FAFDEE] dark:bg-[#1F3A4B] transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-[#1F3A4B] dark:text-[#FAFDEE] transition-colors duration-300">
            Simple, transparent pricing for all.
          </h2>
          <p className="text-lg whitespace-pre-line text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 transition-colors duration-300">
            Choose the plan that works for you
All plans include access to our platform, lead generation tools, and dedicated support.
          </p>
        </div>

        <div className="mb-10 flex justify-center items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-2">
            <Switch 
              className="rounded-md [&_span]:rounded transition-colors duration-300" 
              style={{ 
                backgroundColor: !isMonthly ? (isDarkMode ? '#C2F84F' : '#476407') : (isDarkMode ? '#a0d000' : '#2d4d04') 
              }}
              id={switchId}
              ref={switchRef}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
            />
            <Label 
              htmlFor={switchId} 
              className="cursor-pointer font-semibold text-[#1F3A4B] dark:text-[#FAFDEE] transition-colors duration-300"
            >
              Annual billing
            </Label>
          </div>
          <span className="font-semibold px-2 py-1 rounded text-[#1F3A4B] dark:text-[#FAFDEE] bg-[#C2F84F] dark:bg-[#476407] transition-colors duration-300">
            Save 20%
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <MotionDiv
              key={index}
              initial={{ y: 50, opacity: 1 }}
              whileInView={
                isDesktop
                  ? {
                      y: plan.isPopular ? -20 : 0,
                      opacity: 1,
                      x: index === 2 ? -30 : index === 0 ? 30 : 0,
                      scale: index === 0 || index === 2 ? 0.94 : 1.0,
                    }
                  : {}
              }
              viewport={{ once: true }}
              transition={{
                duration: 1.6,
                type: "spring",
                stiffness: 100,
                damping: 30,
                delay: 0.4,
                opacity: { duration: 0.5 },
              }}
              className={cn(
                "relative rounded-2xl border-2 p-6 text-center flex flex-col transition-all duration-300",
                "bg-[#C2F84F] dark:bg-[#476407]",
                plan.isPopular 
                  ? "border-[#1F3A4B] dark:border-[#FAFDEE]" 
                  : "border-[#C2F84F] dark:border-[#476407]",
                !plan.isPopular && "mt-5",
                index === 0 || index === 2 ? "z-0" : "z-10",
                index === 0 && "origin-right",
                index === 2 && "origin-left",
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 flex items-center rounded-tr-xl rounded-bl-xl px-3 py-1 bg-[#1F3A4B] dark:bg-[#FAFDEE] transition-colors duration-300">
                  <Star className="h-4 w-4 fill-current text-[#FAFDEE] dark:text-[#1F3A4B] transition-colors duration-300" />
                  <span className="ml-1 font-sans font-semibold text-[#FAFDEE] dark:text-[#1F3A4B] transition-colors duration-300">
                    Popular
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col">
                <p className="text-base font-semibold text-[#1F3A4B]/90 dark:text-[#FAFDEE]/90 transition-colors duration-300">
                  {plan.name}
                </p>
                <div className="mt-6 flex items-center justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-[#1F3A4B] dark:text-[#FAFDEE] transition-colors duration-300">
                    <NumberFlow
                      value={
                        isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                      }
                      format={{
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }}
                      transformTiming={{
                        duration: 500,
                        easing: "ease-out",
                      }}
                      willChange
                      className="font-variant-numeric: tabular-nums"
                    />
                  </span>
                  {plan.period !== "Next 3 months" && (
                    <span className="text-sm leading-6 font-semibold tracking-wide text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 transition-colors duration-300">
                      / {plan.period}
                    </span>
                  )}
                </div>

                <p className="text-xs leading-5 text-[#1F3A4B]/70 dark:text-[#FAFDEE]/70 transition-colors duration-300">
                  {isMonthly ? "billed monthly" : "billed annually"}
                </p>

                <ul className="mt-5 flex flex-col gap-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[#1F3A4B] dark:text-[#FAFDEE] transition-colors duration-300" />
                      <span className="text-left text-[#1F3A4B] dark:text-[#FAFDEE] transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <hr className="my-4 w-full border-[#1F3A4B]/20 dark:border-[#FAFDEE]/20 transition-colors duration-300" />

                <a
                  href={plan.href}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg font-semibold text-lg tracking-tight transition-all duration-300 hover:opacity-90",
                    plan.isPopular
                      ? "bg-[#1F3A4B] dark:bg-[#FAFDEE] text-[#FAFDEE] dark:text-[#1F3A4B]"
                      : "bg-transparent border-2 border-[#1F3A4B] dark:border-[#FAFDEE] text-[#1F3A4B] dark:text-[#FAFDEE]"
                  )}
                >
                  {plan.buttonText}
                </a>
                <p className="mt-6 text-xs leading-5 text-[#1F3A4B]/70 dark:text-[#FAFDEE]/70 transition-colors duration-300">
                  {plan.description}
                </p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
}
