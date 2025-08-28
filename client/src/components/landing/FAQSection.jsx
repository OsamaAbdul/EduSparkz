
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How accurate is the EduSparkz content?",
      answer: "Our AI uses advanced language models  to ensure high accuracy. The system analyzes your Uploaded Material content contextually and generates relevant questions with 95%+ accuracy rate."
    },
    {
      question: "What file formats are supported for upload?",
      answer: "We support PDF, Text Document(.DOCX) and Image up to 10MB in size. We're working on adding support for  PowerPoint presentations, and other common educational formats."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely! We use JWT-based authentication, encrypt all data in transit and at rest, and never share your content with third parties. Your uploaded documents and quiz results are completely private."
    },
    {
      question: "Can I customize the difficulty level of generated quizzes?",
      answer: "We are currently working on adding levels to the app."
    },
    {
      question: "How does the instant evaluation system work?",
      answer: "Our AI evaluates your answers in real-time, providing detailed explanations for both correct and incorrect responses. It also offers helpful hints and suggests related topics for further study."
    },
    {
      question: "Is there a limit to how many quizzes I can generate?",
      answer: "Free users can generate up to 5 quizzes per day. Premium users enjoy unlimited quiz generation, advanced analytics, and priority AI processing."
    }
  ];

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about EduSparkz
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white/5 backdrop-blur-sm border-white/10 rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
