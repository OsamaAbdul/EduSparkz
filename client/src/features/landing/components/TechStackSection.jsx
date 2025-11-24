
export const TechStackSection = () => {
  const techStack = ["React", "Express.js", "MongoDB", "OpenAI", "Gemini AI", "JWT Auth", "Netlify", "Heroku"];

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Built with These Modern Technologies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techStack.map((tech, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-white font-semibold">{tech}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
