-- Move the RLS helper functions out of the API-exposed public schema.
--
-- public.has_role(uuid, text) and public.registered_adult() are SECURITY DEFINER
-- and were executable by anon and authenticated through /rest/v1/rpc/*.
-- has_role accepted an arbitrary user id, so any caller could check whether
-- another user is an admin. The replacements live in a schema PostgREST does not
-- expose, take no user id (they only ever check auth.uid()), and are executable
-- only by authenticated (needed for RLS evaluation) and service_role.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- True when the caller has completed adult registration with consent.
CREATE FUNCTION private.registered_adult() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND birth_date <= (CURRENT_DATE - interval '18 years')::date
      AND terms_accepted_at IS NOT NULL
  )
$$;

-- True when the caller holds the admin role. Caller-only by design.
CREATE FUNCTION private.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

REVOKE ALL ON FUNCTION private.registered_adult() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.registered_adult() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;

-- Repoint the policies; their logic is otherwise unchanged.
ALTER POLICY own_records ON public.health_records
  USING (user_id = auth.uid() AND private.registered_adult())
  WITH CHECK (user_id = auth.uid() AND private.registered_adult());

ALTER POLICY "Admins manage facilities" ON public.facilities
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- Nothing else references the public versions (checked: policies, app code, MCP tools).
DROP FUNCTION public.has_role(uuid, text);
DROP FUNCTION public.registered_adult();
