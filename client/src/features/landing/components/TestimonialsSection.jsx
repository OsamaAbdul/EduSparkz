import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
    <section className="relative z-10 px-4 py-16 bg-[#FFFFFF] dark:bg-[#1E2D4C] transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#1E2D4C] dark:text-[#ACBDAA]">
            What Our Users Say
          </h2>
          <p className="text-lg text-[#858585] max-w-xl mx-auto">
            Join thousands of learners who’ve transformed their study experience
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          className="mySwiper"
          style={{
            "--swiper-navigation-color": "#ACBDAA",
            "--swiper-navigation-size": "20px",
          }}
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <Card className="bg-[#ACBDAA]/10 dark:bg-[#ACBDAA]/20 border border-[#ACBDAA]/30 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 border border-[#CECOBB]/50">
                      <AvatarImage src={t.avatar} alt={t.name} />
                      <AvatarFallback className="bg-[#ACBDAA] text-[#1E2D4C] font-semibold">
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] font-semibold text-base">
                          {t.name}
                        </CardTitle>
                        {t.verified && (
                          <svg
                            className="w-4 h-4 text-[#ACBDAA]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                            aria-label="Verified account"
                          >
                            <g transform="scale(2.81 2.91)">
                              <path
                                d="M 30.091 10.131 C 35.371 -2.915 53.786 -3.076 59.293 9.876 C 72.252 4.385 85.386 17.292 80.122 30.345 C 93.168 35.625 93.329 54.04 80.377 59.547 C 85.868 72.506 72.961 85.641 59.908 80.376 C 54.628 93.422 36.213 93.583 30.706 80.631 C 17.747 86.122 4.613 73.215 9.878 60.162 C -3.169 54.881 -3.33 36.467 9.623 30.96 C 4.131 18.001 17.038 4.866 30.091 10.131 Z"
                                fill="currentColor"
                              />
                              <polygon
                                points="39.66,63.79 23.36,47.76 28.97,42.05 39.3,52.21 59.6,29.58 65.56,34.93"
                                fill="white"
                              />
                            </g>
                          </svg>
                        )}
                      </div>
                      <CardDescription className="text-[#858585] text-sm">{t.handle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <p className="text-[#858585] dark:text-[#CECOBB] text-sm leading-relaxed">
                    {t.content}
                  </p>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Swiper button styles */}
      <style jsx="true">{`
        .swiper-button-prev,
        .swiper-button-next {
          background-color: rgba(172, 189, 170, 0.3);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background-color: rgba(172, 189, 170, 0.6);
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 16px;
          color: #1E2D4C;
        }
        .dark .swiper-button-prev:after,
        .dark .swiper-button-next:after {
          color: #ACBDAA;
        }
      `}</style>
    </section>
  );
};
