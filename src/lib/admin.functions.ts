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
    // Reads the caller's own row in the protected user_roles table (owner-read policy).
    const { data: row, error } = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId).eq('role', data.role).maybeSingle();
    if (error) throw new Error('Could not check permissions.');
    return { allowed: Boolean(row) };
  });
