
import { Button } from "@/components/ui/button";
import { Brain, Twitter, Linkedin, Instagram, Github, Globe, Clock, Shield } from "lucide-react";

export const FooterSection = () => {
  return (
    <footer className="relative z-10 px-6 py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI Quiz Generator
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering education through artificial intelligence. Transform your learning experience with personalized quizzes and instant feedback.
            </p>
            <div className="flex space-x-3">
              <Button size="sm"variant="outline" className="border-white/20 hover:bg-white/10 w-10 h-10 p-0">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10 w-10 h-10 p-0">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10 w-10 h-10 p-0">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10 w-10 h-10 p-0">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-300 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-300 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Status Page</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Bug Reports</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-300 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Available Worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24/7 AI Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>SOC2 Compliant</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>MIT License</span>
              <span>•</span>
              <span>Made with ❤️ for learners</span>
              <span>•</span>
              <span>© 2024 AI Quiz Gen</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
