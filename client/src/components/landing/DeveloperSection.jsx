
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Github, ExternalLink } from "lucide-react";

export const DeveloperSection = () => {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Meet the Developer
          </h2>
          <p className="text-xl text-gray-400">
            Passionate about AI-powered education technology
          </p>
        </div>
        
        <Card className=" border-white/20 text-black max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <Avatar className="w-24 h-24 ring-4 ring-purple-500/50">
                <AvatarImage 
                  src="https://osamaabdul-portfolio.netlify.app/images/osama.jpg" 
                  alt="Developer"
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-2xl font-bold">
                  AI
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-black text-2xl mb-2">Osama Abdullahi Ibrahim</CardTitle>
            <CardDescription className="text-purple-300 text-lg font-medium">
            Full-Stack(MERN STACK) Developer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-black text-center leading-relaxed">
              Passionate about creating innovative educational tools that leverage artificial intelligence 
              to enhance learning experiences. With web development leveraging AI, 
              and educational technology.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">React</Badge>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">Node.js</Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">OpenAI</Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">MongoDB</Badge>
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50">ExpressJS</Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="flex items-center text-black text-sm">
                <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                Doma, Nasarawa State
              </div>
              <div className="flex items-center text-black text-sm">
                <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                osamaabduljnr@gmail.com
              </div>
            </div>
            
            <div className="flex justify-center gap-3 pt-4">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <a href="https://github.com/osamaAbdul" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <a href="https://osamaabdul-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Portfolio
                </a>
              </Button>
          </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
