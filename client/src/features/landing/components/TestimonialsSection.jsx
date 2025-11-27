import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "02 Innovation Lab",
      handle: "@02innovations",
      avatar: "https://pbs.twimg.com/profile_images/1563644914549792769/3f1fTVtu_400x400.jpg",
      content: "This is one of the best tools for educationists and learners across all areas of studies. Kudos 👏",
      verified: true,
    },
    {
      name: "Osama Abdul",
      handle: "@Osama_abdulJnr",
      avatar: "https://osamaabdul-portfolio.netlify.app/images/osama.jpg",
      content: "This AI quiz generator has revolutionized how I create assessments.",
      verified: true,
    },
    {
      name: "Elon Musk",
      handle: "@elonmusk",
      avatar: "https://pbs.twimg.com/profile_images/1936002956333080576/kqqe2iWO_400x400.jpg",
      content: "The AI-powered evaluation is remarkably accurate. It's like having a personal tutor available 24/7.",
      verified: true,
    },
    {
      name: "Bola Ahmed Tinubu",
      handle: "@officialABAT",
      avatar: "https://pbs.twimg.com/profile_images/1663237686193160210/jhyvfpW0_400x400.jpg",
      content: "This should be integrated into schools across Nigeria to help boost our education system.",
      verified: true,
    },
  ];

  return (
    <section className="relative z-10 px-4 py-16 md:py-24 bg-space-dark text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Join thousands of learners who’ve transformed their study experience
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, A11y, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          className="mySwiper !pb-12"
          style={{
            "--swiper-navigation-color": "#00F5FF",
            "--swiper-navigation-size": "20px",
          }}
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <Card className="glass-card border-white/10 hover:border-electric-cyan/50 h-full transition-all duration-300 group">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan to-hot-magenta rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity" />
                      <Avatar className="w-12 h-12 border-2 border-white/20 relative z-10">
                        <AvatarImage src={t.avatar} alt={t.name} />
                        <AvatarFallback className="bg-space-dark text-electric-cyan font-bold">
                          {t.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1">
                        <CardTitle className="text-white font-bold text-base">
                          {t.name}
                        </CardTitle>
                        {t.verified && (
                          <svg className="w-4 h-4 text-electric-cyan" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </div>
                      <CardDescription className="text-gray-500 text-xs">{t.handle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-2 relative">
                  <Quote className="absolute top-2 right-4 w-8 h-8 text-white/5 rotate-180" />
                  <p className="text-gray-300 text-sm leading-relaxed relative z-10">
                    "{t.content}"
                  </p>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
