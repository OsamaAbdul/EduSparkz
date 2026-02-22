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
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

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

          setIsLoading(false);
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {

      if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
        if (session?.user) {

          setUser(prev => {
            if (!prev || prev.id !== session.user.id) {

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