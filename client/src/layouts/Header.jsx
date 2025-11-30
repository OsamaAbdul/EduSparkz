import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, Loader2, Bell, Trash2, CheckCheck, Crown, LogIn, LogOut } from "lucide-react";
import { useUser } from "@/context/useContext.jsx";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const Header = ({ toggleSidebar, showMenuButton = true }) => {
  const { user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    username: user?.username || "",
    avatarUrl: user?.avatar_url || "",
  });

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const subscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info("New notification: " + payload.new.title);
        })
        .subscribe();
      return () => { supabase.removeChannel(subscription); };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) { console.error("Error fetching notifications:", error); }
  };

  const handleMarkAsRead = async (notification) => {
    if (notification.is_read) return;
    try {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notification.id);
      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) { console.error("Error marking notification as read:", error); }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) { toast.error("Failed to mark all as read"); }
  };

  const handleClearAllNotifications = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      const { error } = await supabase.from('notifications').delete().eq('user_id', user.id);
      if (error) throw error;
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (error) { toast.error("Failed to clear notifications"); }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
    handleMarkAsRead(notification);
  };

  const handleOpenChange = (open) => {
    if (open && user) {
      setFormData({
        fullName: user.name || "",
        username: user.username || "",
        avatarUrl: user.avatar_url || ""
      });
    }
    setIsProfileOpen(open);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({ data: { full_name: formData.fullName, username: formData.username, avatar_url: formData.avatarUrl } });
      if (authError) throw authError;
      const { error: profileError } = await supabase.from("profiles").update({ full_name: formData.fullName, username: formData.username, avatar_url: formData.avatarUrl, updated_at: new Date() }).eq("id", user.id);
      if (profileError) throw profileError;
      toast.success("Profile updated successfully!");
      setIsProfileOpen(false);
    } catch (error) { toast.error(error.message || "Failed to update profile"); } finally { setIsUpdating(false); }
  };


  const handleLogOut = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      setIsUpdating(true);
      await supabase.auth.signOut();
      window.location.href = "/";
      toast.success("You have been logged out successfully.");
    } catch (error) { toast.error("Failed to logout."); } finally { setIsUpdating(false); }
  };

  const getGreetings = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="w-full sticky top-0 z-50 border-b border-white/10 bg-space-dark/80 backdrop-blur-xl transition-colors duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {showMenuButton && (
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="text-gray-400 hover:text-white hover:bg-white/5">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg sm:text-2xl font-bold text-white truncate max-w-[150px] sm:max-w-none">
            {getGreetings()}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Plan Badge */}
          <Badge variant="outline" className="flex items-center gap-1 border-electric-cyan/30 text-electric-cyan bg-electric-cyan/10 whitespace-nowrap">
            <Crown className="w-3 h-3" />
            <span className="hidden sm:inline">{user?.plan || "Free"} Plan</span>
          </Badge>

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 relative">
                <Bell className="w-5 h-5" />
                <span className="sr-only">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-space-dark shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] sm:w-80 p-0 bg-space-dark border-white/10 text-white" align="end">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h4 className="font-semibold text-white">Notifications</h4>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" title="Mark all as read" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                    <CheckCheck className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-500" title="Clear all" onClick={handleClearAllNotifications} disabled={notifications.length === 0}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No notifications yet.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${!notification.is_read ? 'bg-white/5' : ''}`} onClick={() => handleNotificationClick(notification)}>
                        <div className="flex justify-between items-start gap-2">
                          <h5 className={`text-sm font-medium ${!notification.is_read ? 'text-electric-cyan' : 'text-gray-400'}`}>{notification.title}</h5>
                          {!notification.is_read && <span className="w-2 h-2 bg-hot-magenta rounded-full flex-shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-[10px] text-gray-600 mt-2">{new Date(notification.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Notification Detail Modal */}
          <Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-space-dark border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-electric-cyan">{selectedNotification?.title}</DialogTitle>
                <DialogDescription className="text-gray-400">{selectedNotification && new Date(selectedNotification.created_at).toLocaleString()}</DialogDescription>
              </DialogHeader>
              <div className="py-4 text-gray-200 whitespace-pre-wrap">{selectedNotification?.message}</div>
              <DialogFooter>
                <Button onClick={() => setIsNotificationModalOpen(false)} className="bg-white/10 text-white hover:bg-white/20">Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Profile Modal */}
          <Dialog open={isProfileOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-electric-cyan/50">
                <User className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-space-dark border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-electric-cyan">Edit Profile</DialogTitle>
                <DialogDescription className="text-gray-400">Make changes to your profile here.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-gray-400">Name</Label>
                    <Input id="name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="col-span-3 bg-white/5 border-white/10 text-white focus:border-electric-cyan" />
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right text-gray-400 mt-3">Avatar</Label>
                    <div className="col-span-3 space-y-3">
                      {/* Avatar Selection Grid */}
                      <div className="flex flex-wrap gap-3">
                        {[
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Zack",
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight",
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow"
                        ].map((url) => (
                          <button
                            key={url}
                            type="button"
                            onClick={() => setFormData({ ...formData, avatarUrl: url })}
                            className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${formData.avatarUrl === url
                              ? 'border-electric-cyan ring-2 ring-electric-cyan/20 scale-110'
                              : 'border-white/10 hover:border-white/30'
                              }`}
                          >
                            <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      {/* Custom URL Input */}
                      <div className="flex gap-2">
                        <Input
                          id="avatarUrl"
                          value={formData.avatarUrl}
                          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                          placeholder="Or paste a custom URL..."
                          className="bg-white/5 border-white/10 text-white focus:border-electric-cyan text-xs h-9"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFormData({ ...formData, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` })}
                          title="Generate Random"
                          className="shrink-0 border-white/10 hover:bg-white/10 h-9 w-9"
                        >
                          <User className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-gray-400">Email</Label>
                    <div className="col-span-3 text-sm text-gray-500 px-3 py-2">{user?.email}</div>
                  </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between w-full">
                  <Button type="button" variant="destructive" onClick={handleLogOut} disabled={isUpdating} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 mb-4">
                    <LogOut className="w-4 h-4 mr-2" /> Delete account
                  </Button>
                  <Button type="submit" disabled={isUpdating} className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold">
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
