import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MessageCircle, Heart, Share2, BarChart3, Star, CheckCircle2 } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [{
    name: "AQ",
    handle: "OsamaabdulJnr",
    avatar: "https://osamaabdul-portfolio.netlify.app/images/osama.jpg",
    content: "As a founder I can say it clearly: EduSparkz is literally all a student or lifelong learner needs. Your smart 🤓 buddy is here.",
    metrics: { comments: "4", retweets: "12", likes: "48", views: "1.2K" },
    verified: true,
    postLink: "https://x.com/i/status/2020815070234616100",
    date: "Feb 9, 2026"
  },
  {
    name: "BOHMI",
    handle: "praisebaba_27",
    avatar: "https://pbs.twimg.com/profile_images/2020571173353070592/iHuryNDq.jpg",
    content: "Edu Sparks has been a game-changer for me! 🚀 The AI tutor is like having a personal study buddy that's always there to help. The platform's streamlined approach makes learning so much easier and fun. With its awesome educational features",
    metrics: { comments: "1", retweets: "1", likes: "1", views: "3" },
    verified: true,
    postLink: "https://x.com/i/status/2020570874273829320",
    date: "Feb 8, 2026"
  },
  {
    name: "02 Innovation Lab",
    handle: "02innovations",
    avatar: "https://pbs.twimg.com/profile_images/1563644914549792769/3f1fTVtu_400x400.jpg",
    content: "This is one of the best tools for educationists and learners across all areas of studies. Kudos 👏 #EduSparkz #EdTech",
    metrics: { comments: "12", retweets: "45", likes: "128", views: "12.4K" },
    verified: true,
    postLink: "https://x.com/02innovations",
    date: "Feb 5, 2026"
  },
  ];

  return (
    <section id="testimonials" className="relative z-10 px-4 py-24 bg-space-dark text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-edu-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edu-cyan/10 border border-edu-cyan/20 text-edu-cyan text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Star className="w-3 h-3 fill-edu-cyan" />
              Community Voice
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
              Real People. <br />
              <span className="text-gray-500">Real Results.</span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg font-medium max-w-sm">
            Join thousands of learners sharing their wins and leveling up with EduSparkz.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, A11y, Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 6000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonials-swiper !pb-20"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 flex flex-col h-full hover:border-edu-cyan/30 transition-all duration-500 group relative">
                  {/* X Logo Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 border border-white/10">
                          <AvatarImage src={t.avatar} alt={t.name} />
                          <AvatarFallback className="bg-space-dark text-edu-cyan font-bold">
                            {t.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {t.verified && (
                          <div className="absolute -right-1 -bottom-1 bg-space-dark rounded-full p-0.5">
                            <CheckCircle2 className="w-4 h-4 text-edu-cyan fill-edu-cyan/10" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-white tracking-tight">{t.name}</p>
                        </div>
                        <p className="text-gray-500 text-xs font-medium">@{t.handle}</p>
                      </div>
                    </div>
                    <a
                      href={t.postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white/5 rounded-full hover:bg-edu-cyan/10 hover:text-edu-cyan transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>

                  {/* Content */}
                  <div className="flex-1 mb-8">
                    <p className="text-gray-200 text-[1.05rem] leading-relaxed font-medium">
                      {t.content}
                    </p>
                  </div>

                  {/* Metrics Footer */}
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between text-gray-500">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5 hover:text-edu-cyan transition-colors cursor-pointer">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">{t.metrics.comments}</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-green-400 transition-colors cursor-pointer">
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs font-bold">{t.metrics.retweets}</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-pink-500 transition-colors cursor-pointer">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs font-bold">{t.metrics.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-xs font-bold">{t.metrics.views}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
                .testimonials-swiper .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.2);
                    opacity: 1;
                }
                .testimonials-swiper .swiper-pagination-bullet-active {
                    background: #7bf6fc;
                    box-shadow: 0 0 10px rgba(123, 246, 252, 0.4);
                }
            `}</style>
    </section>
  );
};
