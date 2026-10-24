CREATE TABLE public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  services TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.facilities TO anon;
GRANT SELECT ON public.facilities TO authenticated;
GRANT ALL ON public.facilities TO service_role;

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- Role lookup against the protected user_roles table; SECURITY DEFINER avoids recursive RLS.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Anyone may read facilities, but only ones marked verified are visible.
CREATE POLICY "Verified facilities are publicly readable"
ON public.facilities FOR SELECT TO anon, authenticated
USING (verified = true);

-- Only admins manage the directory; has_role reads the protected user_roles table.
CREATE POLICY "Admins manage facilities"
ON public.facilities FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));