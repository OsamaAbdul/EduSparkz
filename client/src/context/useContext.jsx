import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        console.log("UserContext: initSession started");
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        console.log("UserContext: Session retrieved", session);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) console.error("UserContext: Profile fetch error", profileError);

          if (mounted) {
            setUser({
              ...session.user,
              ...profile,
              token: session.access_token,
              username: profile?.username || session.user.user_metadata?.username || session.user.email.split('@')[0],
              name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            });
          }
        }
      } catch (error) {
        console.error("UserContext: initSession error", error);
      } finally {
        if (mounted) {
          console.log("UserContext: initSession finished, setting isLoading to false");
          setIsLoading(false);
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("UserContext: Auth state changed", _event);
      if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          // We might want to re-fetch profile or just update user from session
          // For now, let's just ensure user is set if it wasn't
          setUser(prev => {
            if (!prev || prev.id !== session.user.id) {
              // If it's a new user/login, we might need to fetch profile again
              // But to avoid complexity, let's just set basic session info first
              // Ideally we should fetch profile here too if we want to be robust
              return { ...session.user, token: session.access_token, ...prev };
            }
            return prev;
          });
        }
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ========Logout=========
  const logOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("user"); // Clean up legacy local storage if any
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);