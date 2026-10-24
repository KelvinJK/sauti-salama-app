ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS hours text NOT NULL DEFAULT '';
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS is_example boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public.facilities.is_example IS 'Pilot test listing; hidden in the app when the example-facilities flag is off.';