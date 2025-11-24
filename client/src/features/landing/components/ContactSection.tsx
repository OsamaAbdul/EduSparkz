import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Phone, Calendar } from "lucide-react";

export const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "smartquizapp@gmail.com",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team instantly",
      contact: "Available 9 AM - 6 PM PST",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to us directly for urgent issues",
      contact: "+234 814 509 6342",
    },
    {
      icon: Calendar,
      title: "Schedule Demo",
      description: "Book a personalized product demo",
      contact: "+234 814 509 6342",
    },
  ];

  return (
    <section className="relative z-10 px-6 py-20 bg-white dark:bg-[#1E2D4C] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E2D4C] dark:text-[#ACBDAA]">
            Get In Touch
          </h2>
          <p className="text-lg text-[#858585] max-w-2xl mx-auto">
            Need help or have questions? We're here to support your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className="bg-[#ACBDAA]/20 dark:bg-[#ACBDAA]/10 border border-[#ACBDAA]/30 rounded-xl hover:shadow-md hover:scale-105 transition-all duration-300 group text-center"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#ACBDAA] dark:bg-[#1E2D4C] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <method.icon className="w-6 h-6 text-[#1E2D4C] dark:text-[#ACBDAA]" />
                </div>
                <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] text-lg">
                  {method.title}
                </CardTitle>
                <CardDescription className="text-[#858585]">
                  {method.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#1E2D4C] dark:text-[#ACBDAA] font-medium">
                  {method.contact}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
