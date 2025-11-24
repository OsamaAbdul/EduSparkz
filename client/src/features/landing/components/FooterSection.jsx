import { Button } from "@/components/ui/button";
import {
  Brain,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Globe,
  Clock,
} from "lucide-react";

export const FooterSection = () => {
  return (
    <footer className="relative z-10 px-6 py-10 md:py-16 border-t border-[#858585]/20 bg-white dark:bg-[#1E2D4C] text-[#1E2D4C] dark:text-[#ACBDAA] transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Grid Layout */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ACBDAA] to-[#1E2D4C] rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#ACBDAA] to-[#1E2D4C] bg-clip-text text-transparent">
                EduSparkz
              </span>
            </div>

            <p className="text-[#858585] dark:text-[#CECOBB] text-sm leading-relaxed">
              Empowering education through AI. Transform your learning with
              personalized quizzes and instant feedback.
            </p>

            <div className="flex space-x-3">
              {[
                {
                  icon: Twitter,
                  href: "https://www.x.com/osama_abdulJnr",
                },
                {
                  icon: Linkedin,
                  href: "https://linkedin.com/in/osamaabdullahiibrahim",
                },
                {
                  icon: Instagram,
                  href: "https://instagram.com/osamaabdul",
                },
                { icon: Github, href: "https://github.com/osamaabdul" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#858585]/30 hover:bg-[#ACBDAA]/10 dark:hover:bg-[#ACBDAA]/20 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#1E2D4C] dark:text-[#ACBDAA]" />
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <FooterColumn
            title="Product"
            links={[
              { label: "Features", href: "/features" },
              { label: "Pricing", href: "/pricing" },
            ]}
          />

          {/* Support */}
          <FooterColumn
            title="Support"
            links={[
              { label: "Help Center", href: "#" },
              { label: "Contact Us", href: "mailto:osamaabduljnr@gmail.com" },
              { label: "Community", href: "#" },
              { label: "Status Page", href: "#" },
              {
                label: "Bug Reports",
                href: "https://github.com/osamaabdul/ai-quiz-generator-and-evaluator/issues",
              },
            ]}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Careers", href: "/careers" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
            ]}
          />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#858585]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#858585] dark:text-[#CECOBB] space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Available Worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24/7 AI Support</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-center">
              <span>MIT License</span>
              <span>•</span>
              <span>Made for learners</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} EduSparkz</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* Footer Column Component */
const FooterColumn = ({ title, links }) => (
  <div className="space-y-4">
    <h3 className="text-[#1E2D4C] dark:text-[#ACBDAA] font-semibold">
      {title}
    </h3>
    <ul className="space-y-2 text-sm">
      {links.map(({ label, href }, i) => (
        <li key={i}>
          <a
            href={href}
            className="text-[#858585] dark:text-[#CECOBB] hover:text-[#1E2D4C] dark:hover:text-[#ACBDAA] transition-colors"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
