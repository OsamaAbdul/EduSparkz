import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ChevronDown } from "lucide-react";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How accurate is the EduSparkz content?",
      answer: "Our AI uses advanced language models to ensure high accuracy. The system analyzes your uploaded material contextually and generates relevant questions with over 95% accuracy.",
    },
    {
      question: "What file formats are supported for upload?",
      answer: "We support PDF, DOCX, and image files up to 10MB. We're working on adding support for PowerPoint presentations and other common educational formats.",
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely! We use JWT-based authentication, encrypt all data in transit and at rest, and never share your content with third parties.",
    },
    {
      question: "Can I customize the difficulty level of generated quizzes?",
      answer: "We are currently working on adding difficulty levels to the app for more personalized quiz experiences.",
    },
    {
      question: "How does the instant evaluation system work?",
      answer: "Our AI evaluates your answers in real-time, providing detailed explanations and hints to guide your learning process.",
    },
    {
      question: "Is there a limit to how many quizzes I can generate?",
      answer: "Free users can generate up to 3 quizzes per day. Premium users enjoy unlimited quiz generation and advanced analytics.",
    },
  ];

  return (
    <section className="relative z-10 px-6 py-20 bg-space-dark text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Frequently {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta">
              Asked Questions
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know about EduSparkz
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card border border-white/10 rounded-2xl px-6 data-[state=open]:border-electric-cyan/50 data-[state=open]:bg-white/5 transition-all duration-300"
            >
              <AccordionTrigger className="text-white hover:text-electric-cyan text-left font-semibold py-6 [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-electric-cyan">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="text-lg">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-6 pl-14 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
