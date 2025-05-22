// context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
type User = {
  name: string;
  email: string;
} | null;

type UserContextType = {
  user: User;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUser({
          name:
            data.user.user_metadata?.full_name || data.user.email.split("@")[0],
          email: data.user.email,
        });
      }
      setLoading(false); // kullanıcı alındı
    };
    load();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
