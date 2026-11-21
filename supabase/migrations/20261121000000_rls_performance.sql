-- RLS performance fixes flagged by the Supabase performance advisor.
-- Who can read or change what is unchanged.
--
-- 1. Wrap auth.uid() and the helper functions in (select ...) so Postgres
--    evaluates them once per query (an initPlan) instead of once per row.
-- 2. facilities had two permissive SELECT policies for authenticated users
--    ("publicly readable" + the FOR ALL admin policy). Replace them with one
--    SELECT policy per role and separate admin write policies.

ALTER POLICY own_profile_read ON public.profiles
  USING (id = (select auth.uid()));

ALTER POLICY own_profile_update ON public.profiles
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

ALTER POLICY own_role_read ON public.user_roles
  USING (user_id = (select auth.uid()));

ALTER POLICY own_records ON public.health_records
  USING (user_id = (select auth.uid()) AND (select private.registered_adult()))
  WITH CHECK (user_id = (select auth.uid()) AND (select private.registered_adult()));

DROP POLICY "Verified facilities are publicly readable" ON public.facilities;
DROP POLICY "Admins manage facilities" ON public.facilities;

-- Visitors see verified facilities only.
CREATE POLICY "Visitors read verified facilities"
ON public.facilities FOR SELECT TO anon
USING (verified = true);

-- Signed-in users see verified facilities; admins also see unverified ones.
CREATE POLICY "Signed-in users read verified facilities, admins read all"
ON public.facilities FOR SELECT TO authenticated
USING (verified = true OR (select private.is_admin()));

CREATE POLICY "Admins add facilities"
ON public.facilities FOR INSERT TO authenticated
WITH CHECK ((select private.is_admin()));

CREATE POLICY "Admins update facilities"
ON public.facilities FOR UPDATE TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));

CREATE POLICY "Admins delete facilities"
ON public.facilities FOR DELETE TO authenticated
USING ((select private.is_admin()));
