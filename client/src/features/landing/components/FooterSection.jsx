import { Link } from "react-router-dom";
import logoIcon from '../../../../public/edusparkz-logo.png';

export const FooterSection = () => {
  return (
    <footer className="relative w-full py-12 px-6 bg-space-dark text-white overflow-hidden border-t border-white/5">
      {/* Background Large Logo */}
      <div className="absolute inset-x-0 top-[10%] bottom-[-50%] flex justify-center items-center pointer-events-none select-none opacity-[0.12]">
        <img
          src={logoIcon}
          alt=""
          className="w-full max-w-[3000px] h-full object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          {/* Copyright */}
          <div className="text-gray-500 font-medium">
            © {new Date().getFullYear()} EDUSPARKZ. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex gap-6 items-center">
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
