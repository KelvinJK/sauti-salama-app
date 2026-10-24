import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

// Role check goes through the protected user_roles table, never user-editable metadata.
export const hasRole = createServerFn({ method: 'GET' })
  .inputValidator((input) => {
    const role = (input as { role?: string })?.role;
    if (role !== 'admin' && role !== 'user') throw new Error('Unknown role.');
    return { role };
  })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { data: allowed, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: data.role });
    if (error) throw new Error('Could not check permissions.');
    return { allowed: Boolean(allowed) };
  });
