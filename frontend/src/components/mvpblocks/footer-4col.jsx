import { Link } from "react-router-dom";
import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { cn } from "../../lib/utils";

const data = {
  facebookLink: "https://facebook.com/HealthHub",
  instaLink: "https://instagram.com/HealthHub",
  twitterLink: "https://twitter.com/HealthHub",
  githubLink: "https://github.com/HealthHub",
  dribbbleLink: "https://dribbble.com/HealthHub",

  services: {
    appointments: "/book-appointment",
    doctors: "/find-doctors",
    community: "/community-support",
    aiassistant: "/ai-health-assistant",
  },

  about: {
    history: "/our-journey",
    team: "/our-doctors",
    handbook: "/patient-guidelines",
    careers: "/join-us",
  },

  help: {
    faqs: "/faqs",
    support: "/patient-support",
    livechat: "/chat-with-doctor",
  },

  contact: {
    email: "support@healthhub.com",
    phone: "+91 8637373116",
    address: "Kolkata, West Bengal, India",
  },

  company: {
    name: "HealthHub",
    description:
      "A modern healthcare platform connecting patients and doctors in real time. Secure appointments, instant chat, AI guidance, and responsive dashboards all in one place.",
  },
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Twitter, label: "Twitter", href: data.twitterLink },
  { icon: Github, label: "GitHub", href: data.githubLink },
  { icon: Dribbble, label: "Dribbble", href: data.dribbbleLink },
];

const aboutLinks = [
  { text: "Our Journey", href: data.about.history },
  { text: "Our Doctors", href: data.about.team },
  { text: "Patient Guidelines", href: data.about.handbook },
  { text: "Join Us", href: data.about.careers },
];

const serviceLinks = [
  { text: "Book Appointment", href: data.services.appointments },
  { text: "Find Doctors", href: data.services.doctors },
  { text: "Community Support", href: data.services.community },
  { text: "AI Health Assistant", href: data.services.aiassistant },
];

const helpfulLinks = [
  { text: "FAQs", href: data.help.faqs },
  { text: "Patient Support", href: data.help.support },
  { text: "Chat With Doctor", href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="bg-[#FAFDEE] dark:bg-[#1F3A4B] mt-16 w-screen transition-colors duration-300 border-t-2 border-[#1F3A4B]/10 dark:border-[#FAFDEE]/10">
      <div className="mx-auto max-w-screen-xl pt-16 pb-6 sm:px-6 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-3 sm:justify-start items-center">
              <span className="text-2xl font-bold tracking-tight text-[#1F3A4B] dark:text-[#FAFDEE]">
                {data.company.name}
              </span>
            </div>

            <p className="text-[#1F3A4B]/70 dark:text-[#FAFDEE]/70 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left font-medium">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-4 sm:justify-start md:gap-6">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#C2F84F] dark:bg-[#476407] text-[#1F3A4B] dark:text-[#FAFDEE] hover:scale-110 transition-transform shadow-sm border border-[#1F3A4B]/10"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="w-5 h-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-[#1F3A4B] dark:text-[#FAFDEE] text-lg font-bold uppercase tracking-widest text-xs">
                About Us
              </p>
              <ul className="mt-8 space-y-4 text-sm font-semibold">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className="text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 hover:text-[#1F3A4B] dark:hover:text-[#C2F84F] transition-colors"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-[#1F3A4B] dark:text-[#FAFDEE] text-lg font-bold uppercase tracking-widest text-xs">
                Services
              </p>
              <ul className="mt-8 space-y-4 text-sm font-semibold">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className="text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 hover:text-[#1F3A4B] dark:hover:text-[#C2F84F] transition-colors"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-[#1F3A4B] dark:text-[#FAFDEE] text-lg font-bold uppercase tracking-widest text-xs">
                Help
              </p>
              <ul className="mt-8 space-y-4 text-sm font-semibold">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className={cn(
                        "transition-colors flex justify-center sm:justify-start items-center gap-1.5",
                        hasIndicator
                          ? "text-[#476407] dark:text-[#C2F84F] font-extrabold underline decoration-2 underline-offset-4" 
                          : "text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 hover:text-[#1F3A4B] dark:hover:text-[#C2F84F]"
                      )}
                    >
                      <span className="text-inherit">{text}</span>
                      {hasIndicator && (
                        <span className="relative flex w-2 h-2">
                          <span className="bg-[#476407] dark:bg-[#C2F84F] absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-[#476407] dark:bg-[#C2F84F] relative inline-flex w-2 h-2 rounded-full" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-[#1F3A4B] dark:text-[#FAFDEE] text-lg font-bold uppercase tracking-widest text-xs">
                Contact
              </p>
              <ul className="mt-8 space-y-4 text-sm font-semibold">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-2 sm:justify-start group"
                      href={
                        isAddress
                          ? "#"
                          : text.includes("@")
                          ? `mailto:${text}`
                          : `tel:${text}`
                      }
                    >
                      <Icon className="text-[#1F3A4B] dark:text-[#C2F84F] w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                      {isAddress ? (
                        <address className="text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 -mt-0.5 flex-1 not-italic transition group-hover:text-[#1F3A4B] dark:group-hover:text-[#FAFDEE]">
                          {text}
                        </address>
                      ) : (
                        <span className="text-[#1F3A4B]/80 dark:text-[#FAFDEE]/80 flex-1 transition group-hover:text-[#1F3A4B] dark:group-hover:text-[#FAFDEE]">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#1F3A4B]/10 dark:border-[#FAFDEE]/10 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-[#1F3A4B]/60 dark:text-[#FAFDEE]/60 font-medium">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-[#1F3A4B]/60 dark:text-[#FAFDEE]/60 mt-4 text-sm transition sm:order-first sm:mt-0 font-bold">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}