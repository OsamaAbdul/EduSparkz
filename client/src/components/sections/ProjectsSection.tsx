
import { FolderOpen, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";

const projects = [
  {
    name: "E-commerce Platform",
    description: "Modern shopping experience with React & Node.js",
    status: "In Progress",
    progress: 75,
    dueDate: "Dec 15, 2024",
    team: 5,
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "Mobile Banking App",
    description: "Secure financial transactions on mobile",
    status: "Completed",
    progress: 100,
    dueDate: "Nov 30, 2024",
    team: 3,
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "AI Dashboard",
    description: "Analytics dashboard with machine learning",
    status: "Planning",
    progress: 25,
    dueDate: "Jan 20, 2025",
    team: 4,
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "CRM System",
    description: "Customer relationship management platform",
    status: "In Progress",
    progress: 60,
    dueDate: "Dec 25, 2024",
    team: 6,
    color: "from-orange-500 to-red-500"
  }
];

export const ProjectsSection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Projects</h2>
          <p className="text-white/70">Manage your ongoing projects and track progress</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.name}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${project.color} bg-opacity-20`}>
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                {project.status === "Completed" && (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
                {project.status === "In Progress" && (
                  <Clock className="w-5 h-5 text-blue-400" />
                )}
                {project.status === "Planning" && (
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                )}
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  project.status === "Completed" 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : project.status === "In Progress"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
              <p className="text-white/70 text-sm mb-3">{project.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Progress</span>
                  <span className="text-white font-medium text-sm">{project.progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${project.color} transition-all duration-500`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Project Footer */}
            <div className="flex items-center justify-between text-sm text-white/60">
              <div className="flex items-center space-x-4">
                <span>Due: {project.dueDate}</span>
                <span>{project.team} members</span>
              </div>
              <button className="text-white/70 hover:text-white transition-colors duration-200">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
