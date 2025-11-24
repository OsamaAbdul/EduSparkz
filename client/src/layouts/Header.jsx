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

const Header = ({ toggleSidebar }) => {
  const { user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    username: user?.username || "",
  });

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Subscribe to new notifications
      const subscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info("New notification: " + payload.new.title);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (notification) => {
    if (notification.is_read) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id);

      if (error) throw error;

      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleClearAllNotifications = async () => {
    if (notifications.length === 0) return;

    if (!window.confirm("Are you sure you want to clear all notifications?")) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
    handleMarkAsRead(notification);
  };

  // Sync form data when user opens modal or user data changes
  const handleOpenChange = (open) => {
    if (open && user) {
      setFormData({
        fullName: user.name || "",
        username: user.username || "",
      });
    }
    setIsProfileOpen(open);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // 1. Update Supabase Auth Metadata (updates session & context)
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          username: formData.username,
        },
      });

      if (authError) throw authError;

      // 2. Update Profiles Table (keeps DB in sync)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          username: formData.username,
          updated_at: new Date(),
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast.success("Profile updated successfully!");
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to logout your account? ")) {
      return;
    }

    try {
      setIsUpdating(true);
      const { error } = await supabase.from('profiles').delete().eq('id', user.id);

      if (error) throw error;

      await supabase.auth.signOut();
      window.location.href = "/";
      toast.success("You have been logged out successfully.");
      s
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account. Please contact support.");
    } finally {
      setIsUpdating(false);
    }
  };

  // == greet user ===
  const getGreetings = () => {
    const formatter = new Intl.DateTimeFormat("en-NG", {
      hour: "numeric",
      hour12: false,
      timeZone: "Africa/Lagos",
    });

    const hour = Number(formatter.format(new Date()));

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header
      className="
        w-full sticky top-0 z-50 
        border-b transition-colors duration-300
        bg-white/80 border-[#ACBDAA]/40 
        dark:bg-[#1E2D4C]/80 dark:border-[#ACBDAA]/30
        backdrop-blur-xl
      "
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="
              text-[#1E2D4C] dark:text-[#ACBDAA] hover:opacity-80
              transition-colors duration-200
            "
          >
            <Menu className="w-5 h-5" />
          </Button>

          <h1
            className="
              text-lg sm:text-2xl font-bold 
              text-[#1E2D4C] dark:text-[#ACBDAA]
              truncate max-w-[150px] sm:max-w-none
            "
          >
            {getGreetings()}, {user?.name || "Guest"}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">

          {/* Plan Badge */}
          <Badge variant="outline" className="flex items-center gap-1 border-[#ACBDAA]/50 text-[#1E2D4C] dark:text-[#ACBDAA] bg-[#ACBDAA]/10 whitespace-nowrap">
            <Crown className="w-3 h-3" />
            <span className="hidden sm:inline">{user?.plan || "Free"} Plan</span>
          </Badge>

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#1E2D4C] dark:text-[#ACBDAA] hover:bg-transparent relative"
              >
                <Bell className="w-5 h-5" />
                <span className="sr-only">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-[#1E2D4C]" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] sm:w-80 p-0 bg-white dark:bg-[#1E2D4C] border-[#ACBDAA]/30" align="end">
              <div className="p-4 border-b border-[#ACBDAA]/30 flex justify-between items-center">
                <h4 className="font-semibold text-[#1E2D4C] dark:text-[#ACBDAA]">Notifications</h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-[#ACBDAA] hover:text-[#1E2D4C] dark:hover:text-white"
                    title="Mark all as read"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <CheckCheck className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-400 hover:text-red-600"
                    title="Clear all"
                    onClick={handleClearAllNotifications}
                    disabled={notifications.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#ACBDAA]/10">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 cursor-pointer hover:bg-[#ACBDAA]/10 transition-colors ${!notification.is_read ? 'bg-[#ACBDAA]/5' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h5 className={`text-sm font-medium ${!notification.is_read ? 'text-[#1E2D4C] dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                            {notification.title}
                          </h5>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-[#ACBDAA] rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Notification Detail Modal */}
          <Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1E2D4C] border-[#ACBDAA]/30">
              <DialogHeader>
                <DialogTitle className="text-[#1E2D4C] dark:text-[#ACBDAA]">{selectedNotification?.title}</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-[#ACBDAA]/70">
                  {selectedNotification && new Date(selectedNotification.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 text-[#1E2D4C] dark:text-gray-200 whitespace-pre-wrap">
                {selectedNotification?.message}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsNotificationModalOpen(false)} className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/90">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isProfileOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="
                  border-[#1E2D4C] text-[#1E2D4C]
                  hover:opacity-90
                  dark:border-[#ACBDAA] dark:text-[#ACBDAA]
                "
              >
                <User className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1E2D4C] border-[#ACBDAA]/30">
              <DialogHeader>
                <DialogTitle className="text-[#1E2D4C] dark:text-[#ACBDAA]">Edit Profile</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-[#ACBDAA]/70">
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-[#1E2D4C] dark:text-[#ACBDAA]">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="col-span-3 bg-white dark:bg-[#1E2D4C]/50 border-[#ACBDAA]/30 text-[#1E2D4C] dark:text-[#ACBDAA]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right text-[#1E2D4C] dark:text-[#ACBDAA]">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="col-span-3 bg-white dark:bg-[#1E2D4C]/50 border-[#ACBDAA]/30 text-[#1E2D4C] dark:text-[#ACBDAA]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-[#1E2D4C] dark:text-[#ACBDAA]">
                      Email
                    </Label>
                    <div className="col-span-3 text-sm text-gray-500 dark:text-[#ACBDAA]/70 px-3 py-2">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between w-full">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isUpdating}
                    className="bg-red-500 hover:bg-red-600 text-white mb-4"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                  <br />
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/90 pt-4"
                  >
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
