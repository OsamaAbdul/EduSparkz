
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "-2.5%",
    trend: "down",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Activity Score",
    value: "573",
    change: "+12.3%",
    trend: "up",
    icon: Activity,
    color: "from-orange-500 to-red-500"
  }
];

export const AnalyticsSection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-white/60 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Revenue Overview</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 65, 80].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-500 hover:scale-110"
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { user: "Sarah Johnson", action: "completed project", time: "2m ago", color: "from-emerald-500 to-teal-500" },
              { user: "Mike Chen", action: "updated dashboard", time: "5m ago", color: "from-blue-500 to-cyan-500" },
              { user: "Alex Rivera", action: "joined team", time: "1h ago", color: "from-purple-500 to-pink-500" },
              { user: "Emma Davis", action: "created report", time: "3h ago", color: "from-orange-500 to-red-500" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${activity.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-white/70">{activity.action}</span>
                  </p>
                  <p className="text-white/50 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
