
import { Users, Mail, Phone, MoreVertical, UserPlus } from "lucide-react";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Frontend Developer",
    email: "sarah@company.com",
    phone: "+1 (555) 123-4567",
    avatar: "from-emerald-500 to-teal-500",
    status: "online",
    projects: 5
  },
  {
    name: "Mike Chen",
    role: "Backend Developer",
    email: "mike@company.com",
    phone: "+1 (555) 234-5678",
    avatar: "from-blue-500 to-cyan-500",
    status: "away",
    projects: 3
  },
  {
    name: "Alex Rivera",
    role: "UI/UX Designer",
    email: "alex@company.com",
    phone: "+1 (555) 345-6789",
    avatar: "from-purple-500 to-pink-500",
    status: "online",
    projects: 4
  },
  {
    name: "Emma Davis",
    role: "Project Manager",
    email: "emma@company.com",
    phone: "+1 (555) 456-7890",
    avatar: "from-orange-500 to-red-500",
    status: "offline",
    projects: 7
  },
  {
    name: "John Smith",
    role: "DevOps Engineer",
    email: "john@company.com",
    phone: "+1 (555) 567-8901",
    avatar: "from-cyan-500 to-blue-500",
    status: "online",
    projects: 2
  },
  {
    name: "Lisa Wang",
    role: "Data Scientist",
    email: "lisa@company.com",
    phone: "+1 (555) 678-9012",
    avatar: "from-pink-500 to-rose-500",
    status: "away",
    projects: 6
  }
];

export const TeamSection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Team Members</h2>
          <p className="text-white/70">Manage your team and collaborate effectively</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
          <UserPlus className="w-5 h-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Members", value: "12", color: "from-blue-500 to-cyan-500" },
          { label: "Online Now", value: "8", color: "from-emerald-500 to-teal-500" },
          { label: "Active Projects", value: "15", color: "from-purple-500 to-pink-500" },
          { label: "This Month", value: "+3", color: "from-orange-500 to-red-500" }
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20 flex items-center justify-center mb-4`}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-white/60 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={member.name}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Member Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${member.avatar} flex items-center justify-center relative`}>
                  <span className="text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                    member.status === 'online' 
                      ? 'bg-emerald-500' 
                      : member.status === 'away' 
                      ? 'bg-yellow-500' 
                      : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-white/60 text-sm">{member.role}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white/50 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-200">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{member.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-200">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{member.phone}</span>
              </div>
            </div>

            {/* Projects */}
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Active Projects</span>
              <span className="font-semibold text-white">{member.projects}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
