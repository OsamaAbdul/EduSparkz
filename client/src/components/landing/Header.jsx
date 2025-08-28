import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Brain} from "lucide-react";


const Header = () => {

    const navigate = useNavigate();
  return (
    <>
         <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
           <div className="mb-6 pt-4">
              <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                EduSparkz
              </span>
            </div>
           </div>
           <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-gray-800 border-gray-700 text-white font-sans"
                onClick={() => navigate('/api/auth/login')}
              >
                Login
              </Button>
             <Button
                type="button"
                variant="outline"
                className="flex-1 bg-gray-800 border-gray-700 text-white font-sans"
                onClick={() => navigate('/api/auth/register')}
                >
                Register
            </Button>
            </div>
          </div>
        </div>
      </header>
       </>
  )
}

export default Header
