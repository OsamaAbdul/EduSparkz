import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Note: Blue badge SVG sourced from Flaticon.com
// Icon by Freepik: https://www.flaticon.com/free-icon/verified_10679174
// Attribution required for free use: <a href="https://www.flaticon.com/free-icons/verified" title="verified icons">Verified icons created by Freepik - Flaticon</a>

export const TestimonialsSection = () => {
  const testimonials = [
    
    {
      name: "02 Innovation Lab",
      handle: "@02innovations",
      avatar: "https://pbs.twimg.com/profile_images/1563644914549792769/3f1fTVtu_400x400.jpg",
      content: "This is one of the best tools for educationist and learners across all areas of studies. Kudos 👏 ",
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
      content: "The AI-powered evaluation is remarkably accurate. It's like having a personal tutor available 24/7 for every student.",
      verified: true,
    },
    {
      name: "Bola Ahmed Tinubu",
      handle: "@officialABAT",
      avatar: "https://pbs.twimg.com/profile_images/1663237686193160210/jhyvfpW0_400x400.jpg",
      content: "Wow! This should be integrated into schools across Nigeria to help boost our education.",
      verified: true,
    },
    
  ];

  return (
    <section className="relative z-10 px-4 py-16 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white font-sans">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto font-sans">
            Join thousands of satisfied learners who have transformed their study experience
          </p>
        </div>

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
            '--swiper-navigation-color': '#1DA1F2',
            '--swiper-navigation-size': '20px',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <Card className="bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-850 transition-all duration-200 hover:shadow-md hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500">
                <CardHeader className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-10 h-10 ring-1 ring-gray-700">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-blue-500 text-white font-sans text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-white text-base font-sans font-semibold">
                          {testimonial.name}
                        </CardTitle>
                        {testimonial.verified && (
                          <svg
                            className="w-4 h-4 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 256 256"
                            xmlSpace="preserve"
                            aria-label="Verified account"
                            role="img"
                          >
                            <g
                              style={{
                                stroke: 'none',
                                strokeWidth: 0,
                                strokeDasharray: 'none',
                                strokeLinecap: 'butt',
                                strokeLinejoin: 'miter',
                                strokeMiterlimit: 10,
                                fill: 'none',
                                fillRule: 'nonzero',
                                opacity: 1,
                              }}
                              transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                            >
                              <path
                                d="M 30.091 10.131 L 30.091 10.131 c 5.28 -13.046 23.695 -13.207 29.202 -0.255 l 0 0 l 0 0 c 12.959 -5.491 26.093 7.416 20.829 20.469 l 0 0 l 0 0 c 13.046 5.28 13.207 23.695 0.255 29.202 l 0 0 l 0 0 c 5.491 12.959 -7.416 26.093 -20.469 20.829 l 0 0 l 0 0 c -5.28 13.046 -23.695 13.207 -29.202 0.255 l 0 0 l 0 0 C 17.748 86.122 4.613 73.215 9.878 60.162 l 0 0 l 0 0 C -3.169 54.881 -3.33 36.467 9.623 30.96 l 0 0 l 0 0 C 4.131 18.001 17.038 4.866 30.091 10.131 L 30.091 10.131 z"
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'currentColor', // Uses text-blue-500
                                  fillRule: 'nonzero',
                                  opacity: 1,
                                }}
                                transform="matrix(1 0 0 1 0 0)"
                                strokeLinecap="round"
                              />
                              <polygon
                                points="39.66,63.79 23.36,47.76 28.97,42.05 39.3,52.21 59.6,29.58 65.56,34.93"
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'white',
                                  fillRule: 'nonzero',
                                  opacity: 1,
                                }}
                                transform="matrix(1 0 0 1 0 0)"
                              />
                            </g>
                          </svg>
                        )}
                      </div>
                      <CardDescription className="text-gray-500 text-sm font-sans">
                        {testimonial.handle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-300 text-sm font-sans leading-relaxed line-clamp-3">
                    {testimonial.content}
                  </p>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom CSS for Swiper navigation buttons */}
      <style jsx>{`
        .swiper-button-prev,
        .swiper-button-next {
          background-color: rgba(0, 0, 0, 0.5);
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
          background-color: rgba(0, 0, 0, 0.7);
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 16px;
        }
      `}</style>
    </section>
  );
};