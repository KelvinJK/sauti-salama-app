REVOKE EXECUTE ON FUNCTION public.create_app_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_adult_profile() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_app_profile() TO service_role;
GRANT EXECUTE ON FUNCTION public.validate_adult_profile() TO service_role;