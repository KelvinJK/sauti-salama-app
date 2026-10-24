import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    let alive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED') return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_OUT') { void queryClient.cancelQueries(); queryClient.clear(); }
      void router.invalidate();
      if (event !== 'SIGNED_OUT') void queryClient.invalidateQueries();
    });
    void supabase.auth.getUser().then(({ data }) => { if (alive) { setUser(data.user); setLoading(false); } });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [router, queryClient]);
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
export const useAppAuth = () => useContext(AuthContext);