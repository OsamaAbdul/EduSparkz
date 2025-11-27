import { Link } from "react-router-dom";
import {
  Twitter,
  Instagram,
  MessageCircle,
  Brain
} from "lucide-react";

export const FooterSection = () => {
  return (
    <footer className="relative z-10 px-6 py-16 bg-space-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">

        {/* Left: Logo & Tagline & Socials */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-cyan to-hot-magenta p-[1px]">
              <div className="w-full h-full bg-space-dark rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-electric-cyan" />
              </div>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Edu<span className="text-electric-cyan">Sparkz</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm">Upload Anything, Learn Instantly</p>

          <div className="flex items-center gap-4">
            <a href="mailto:ibrahimabdulosama@gmail.com" className="w-10 h-10 rounded-full bg-electric-cyan text-space-dark flex items-center justify-center hover:bg-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/osamaabduljnr" className="w-10 h-10 rounded-full bg-electric-cyan text-space-dark flex items-center justify-center hover:bg-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/osama_abduljnrs" className="w-10 h-10 rounded-full bg-electric-cyan text-space-dark flex items-center justify-center hover:bg-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right: Quick Links */}
        <div className="space-y-4">
          <h3 className="font-bold text-white">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/how-it-works" className="hover:text-electric-cyan">How it works</Link></li>
            <li><Link to="/features" className="hover:text-electric-cyan">Features</Link></li>
            <li><Link to="/testimonial" className="hover:text-electric-cyan">Testimonial</Link></li>
            <li><Link to="/faq" className="hover:text-electric-cyan">FAQ's</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div>
          © {new Date().getFullYear()} EduSparkz. All rights reserved.
        </div>
        <div>
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};
