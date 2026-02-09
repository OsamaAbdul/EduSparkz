import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Phone, Calendar } from "lucide-react";

export const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "EduSparkz@gmail.com",
      color: "text-electric-cyan",
      bg: "bg-electric-cyan/10",
      action: "mailto:EduSparkz@gmail.com"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team instantly",
      contact: "Available 9 AM - 6 PM",
      color: "text-hot-magenta",
      bg: "bg-hot-magenta/10",
      action: "https://wa.me/2348145096342"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to us directly for urgent issues",
      contact: "+234 814 509 6342",
      color: "text-electric-lime",
      bg: "bg-electric-lime/10",
      action: "tel:+2348145096342"
    },
    {
      icon: Calendar,
      title: "Schedule Demo",
      description: "Book a personalized product demo",
      contact: "View Availability",
      color: "text-white",
      bg: "bg-white/10",
      action: "https://calendly.com"
    },
  ];

  return (
    <section className="relative z-10 px-6 py-12 md:py-20 bg-space-dark text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-hot-magenta/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Get In {" "}
            <span className="text-highlight">
              Touch
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Need help or have questions? We're here to support your learning journey.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.action}
              target={method.title === "Phone Support" || method.title === "Email Support" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="block"
            >
              <Card
                className="h-full glass-card border-white/10 hover:border-electric-cyan/50 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)] hover:-translate-y-1 transition-all duration-300 group text-center cursor-pointer"
              >
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto ${method.bg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <method.icon className={`w-7 h-7 ${method.color}`} />
                  </div>
                  <CardTitle className="text-white text-lg font-bold">
                    {method.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-medium">
                    {method.contact}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
