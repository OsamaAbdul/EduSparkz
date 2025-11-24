import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How accurate is the EduSparkz content?",
      answer:
        "Our AI uses advanced language models to ensure high accuracy. The system analyzes your uploaded material contextually and generates relevant questions with over 95% accuracy.",
    },
    {
      question: "What file formats are supported for upload?",
      answer:
        "We support PDF, DOCX, and image files up to 10MB. We're working on adding support for PowerPoint presentations and other common educational formats.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Absolutely! We use JWT-based authentication, encrypt all data in transit and at rest, and never share your content with third parties.",
    },
    {
      question: "Can I customize the difficulty level of generated quizzes?",
      answer:
        "We are currently working on adding difficulty levels to the app for more personalized quiz experiences.",
    },
    {
      question: "How does the instant evaluation system work?",
      answer:
        "Our AI evaluates your answers in real-time, providing detailed explanations and hints to guide your learning process.",
    },
    {
      question: "Is there a limit to how many quizzes I can generate?",
      answer:
        "Free users can generate up to 5 quizzes per day. Premium users enjoy unlimited quiz generation and advanced analytics.",
    },
  ];

  return (
    <section className="relative z-10 px-6 py-20 bg-white dark:bg-[#1E2D4C] transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E2D4C] dark:text-[#ACBDAA]">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#858585]">
            Everything you need to know about EduSparkz
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-[#ACBDAA]/20 dark:bg-[#ACBDAA]/10 border border-[#ACBDAA]/30 rounded-xl px-6 hover:shadow-sm transition-all"
            >
              <AccordionTrigger className="text-[#1E2D4C] dark:text-[#ACBDAA] hover:text-[#858585] text-left font-semibold">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-[#858585]" />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#858585] pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
