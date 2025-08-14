
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Phone, Calendar } from "lucide-react";

export const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "EduSparkz@gmail.com",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team instantly",
      contact: "Available 9 AM - 6 PM ",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to us directly for urgent issues",
      contact: "+234 814 509 6342",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Schedule Demo",
      description: "Book a personalized product demo",
      contact: "+234 814 509 6342",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Need help or have questions? We're here to support your learning journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group text-center">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg">{method.title}</CardTitle>
                <CardDescription className="text-gray-400">{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-purple-300 font-medium">{method.contact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
