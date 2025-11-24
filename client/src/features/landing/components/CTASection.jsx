import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="relative z-10 px-6 py-12 md:py-20 bg-white dark:bg-[#1E2D4C] transition-colors duration-500">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-[#ACBDAA]/10 dark:bg-[#ACBDAA]/20 backdrop-blur-md rounded-2xl p-6 md:p-12 border border-[#E4E6E3] dark:border-[#858585]/30 shadow-lg transition-all duration-500">

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1E2D4C] dark:text-[#ACBDAA]">
            Ready to Transform Your Learning?
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-[#858585] dark:text-[#CECOBB] mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students, teachers, and lifelong learners who are already using AI to enhance their educational journey.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-[#1E2D4C] dark:bg-[#ACBDAA] text-[#ACBDAA] dark:text-[#1E2D4C] hover:opacity-90 font-semibold px-8 py-6 text-lg rounded-xl transition-all"
            >
              <Star className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
