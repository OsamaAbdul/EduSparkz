
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Github, ExternalLink } from "lucide-react";

export const DeveloperSection = () => {
  return (
    <section className="relative z-10 px-6 py-20 bg-space-dark text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta">
            Meet the Developer
          </h2>
          <p className="text-xl text-gray-400">
            Passionate about AI-powered education technology
          </p>
        </div>

        <Card className="glass-card border-white/10 max-w-2xl mx-auto shadow-[0_0_30px_rgba(0,245,255,0.1)]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <Avatar className="w-24 h-24 ring-4 ring-electric-cyan/50">
                <AvatarImage
                  src="https://osamaabdul-portfolio.netlify.app/images/osama.jpg"
                  alt="Developer"
                />
                <AvatarFallback className="bg-gradient-to-r from-electric-cyan to-hot-magenta text-white text-2xl font-bold">
                  OA
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-white text-2xl mb-2">Osama Abdullahi Ibrahim</CardTitle>
            <CardDescription className="text-electric-cyan text-lg font-medium">
              Full-Stack (MERN STACK) Developer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-center leading-relaxed">
              Passionate about creating innovative educational tools that leverage artificial intelligence
              to enhance learning experiences. With web development leveraging AI,
              and educational technology.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/50">React</Badge>
              <Badge className="bg-hot-magenta/20 text-hot-magenta border-hot-magenta/50">Node.js</Badge>
              <Badge className="bg-electric-lime/20 text-electric-lime border-electric-lime/50">OpenAI</Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">MongoDB</Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">ExpressJS</Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-electric-cyan" />
                Doma, Nasarawa State
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="w-4 h-4 mr-2 text-hot-magenta" />
                osamaabduljnr@gmail.com
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white"
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
                className="border-white/20 hover:bg-white/10 text-white"
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
