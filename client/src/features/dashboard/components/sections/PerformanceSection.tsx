
import { Zap, TrendingUp, Target, Award, Clock, BarChart3 } from "lucide-react";

export const PerformanceSection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Performance Metrics</h2>
        <p className="text-white/70">Monitor system performance and optimization metrics</p>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Response Time", value: "23ms", change: "-12.5%", icon: Clock, color: "from-emerald-500 to-teal-500" },
          { title: "Throughput", value: "1.2K/s", change: "+8.3%", icon: Zap, color: "from-blue-500 to-cyan-500" },
          { title: "Error Rate", value: "0.02%", change: "-45.2%", icon: Target, color: "from-purple-500 to-pink-500" },
          { title: "Uptime", value: "99.9%", change: "+0.1%", icon: Award, color: "from-orange-500 to-red-500" },
          { title: "Load Average", value: "0.8", change: "-5.7%", icon: BarChart3, color: "from-cyan-500 to-blue-500" },
          { title: "Memory Usage", value: "67%", change: "+2.1%", icon: TrendingUp, color: "from-pink-500 to-rose-500" }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} bg-opacity-20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-white/60 text-sm">{metric.title}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-6">Performance Over Time</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[85, 92, 78, 95, 88, 91, 87, 94, 89, 96, 83, 90].map((height, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-500 hover:scale-110"
              style={{ 
                height: `${height}%`,
                animationDelay: `${index * 100}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
