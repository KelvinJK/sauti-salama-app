CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 display_name text NOT NULL DEFAULT '',
 language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','sw')),
 birth_date date,
 terms_accepted_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile_read ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY own_profile_update ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE FUNCTION public.validate_adult_profile() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN
 IF NEW.birth_date IS NOT NULL AND (NEW.birth_date > (CURRENT_DATE - interval '18 years')::date OR NEW.birth_date < (CURRENT_DATE - interval '120 years')::date) THEN RAISE EXCEPTION 'Accounts require age 18 or older'; END IF;
 RETURN NEW; END $$;
CREATE TRIGGER validate_adult_profile BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.validate_adult_profile();
CREATE TABLE public.user_roles (
 user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin','clinician')),
 PRIMARY KEY(user_id,role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_role_read ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE FUNCTION public.create_app_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN
 INSERT INTO public.profiles(id) VALUES(NEW.id);
 INSERT INTO public.user_roles(user_id,role) VALUES(NEW.id,'user');
 RETURN NEW; END $$;
CREATE TRIGGER create_app_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_app_profile();
CREATE FUNCTION public.registered_adult() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND birth_date <= (CURRENT_DATE - interval '18 years')::date AND terms_accepted_at IS NOT NULL) $$;
REVOKE ALL ON FUNCTION public.registered_adult() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.registered_adult() TO authenticated;
CREATE TABLE public.health_records (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('cycle','pregnancy','antenatal','postnatal','child','growth','journal')),
 record_date date NOT NULL,
 title text NOT NULL CHECK (length(title) BETWEEN 1 AND 160),
 details jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.health_records TO authenticated;
GRANT ALL ON public.health_records TO service_role;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_records ON public.health_records FOR ALL TO authenticated USING (user_id = auth.uid() AND public.registered_adult()) WITH CHECK (user_id = auth.uid() AND public.registered_adult());
CREATE INDEX records_user_kind ON public.health_records(user_id,kind,record_date DESC);