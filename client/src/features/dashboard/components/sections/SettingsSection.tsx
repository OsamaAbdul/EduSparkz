
import { Settings, User, Bell, Shield, Palette, Globe, Save } from "lucide-react";

export const SettingsSection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-white/70">Customize your dashboard preferences and account settings</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-opacity-20">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Email</label>
              <input
                type="email"
                defaultValue="john@company.com"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Role</label>
              <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-opacity-20">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { label: "Email Notifications", checked: true },
              { label: "Push Notifications", checked: false },
              { label: "SMS Alerts", checked: true },
              { label: "Weekly Reports", checked: true }
            ].map((setting, index) => (
              <div key={setting.label} className="flex items-center justify-between">
                <span className="text-white/70">{setting.label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    defaultChecked={setting.checked}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    setting.checked ? 'bg-purple-500' : 'bg-white/20'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                      setting.checked ? 'translate-x-5' : 'translate-x-0.5'
                    } translate-y-0.5`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Security</h3>
          </div>
          
          <div className="space-y-4">
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors duration-200 text-white/70 hover:text-white">
              Change Password
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors duration-200 text-white/70 hover:text-white">
              Two-Factor Authentication
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors duration-200 text-white/70 hover:text-white">
              Login Sessions
            </button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 bg-opacity-20">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Theme</label>
              <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Language</label>
              <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};
