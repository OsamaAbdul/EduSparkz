
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students, teachers, and lifelong learners who are already using AI to enhance their educational journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 px-8 py-6 text-lg">
              <Star className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            
          </div>
        </div>
      </div>
    </section>
  );
};
