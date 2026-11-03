-- Insert additional real, publicly listed health facilities in Dar es Salaam for emergency and maternal care.
-- Data compiled from official Ministry of Health registry, hospital websites, and public directories.
-- These are marked verified=true and is_example=false so they appear even when example flag is off.

INSERT INTO public.facilities (name, district, region, address, phone, services, verified, hours, is_example)
VALUES
  (
    'Saifee Hospital Tanzania',
    'Kinondoni',
    'Dar es Salaam',
    'Ali Hassan Mwinyi Road, Ada Estate, Oysterbay',
    '+255 747 535 353',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency','nutrition'],
    true,
    '24 hours',
    false
  ),
  (
    'Kairuki Hospital',
    'Kinondoni',
    'Dar es Salaam',
    'Chwaku Street / Plot 322, Mikocheni, Regent Estate',
    '+255 653 723 707',
    ARRAY['maternity','antenatal','postnatal','child_health','family_planning','emergency'],
    true,
    '24 hours',
    false
  ),
  (
    'Shree Hindu Mandal Hospital',
    'Ilala',
    'Dar es Salaam',
    'India Street / Hindu Mandal Street, Kisutu',
    '+255 748 519 000',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency','family_planning'],
    true,
    '24 hours',
    false
  ),
  (
    'Jakaya Kikwete Cardiac Institute (JKCI)',
    'Ilala',
    'Dar es Salaam',
    'Kalenga Street / Malik Road, Upanga',
    '+255 22 215 1379',
    ARRAY['emergency','child_health','nutrition'],
    true,
    '24 hours (Specialized)',
    false
  ),
  (
    'Muhimbili Orthopaedic Institute (MOI)',
    'Ilala',
    'Dar es Salaam',
    'Kalenga Street, Upanga Magharibi',
    '+255 22 215 1298',
    ARRAY['emergency','child_health'],
    true,
    '24 hours (Trauma)',
    false
  ),
  (
    'Cardinal Rugambwa Hospital',
    'Ilala',
    'Dar es Salaam',
    'Ukonga, Mwembe Madafu',
    '+255 22 284 3199',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency','family_planning'],
    true,
    '24 hours',
    false
  ),
  (
    'London Health Centre',
    'Kinondoni',
    'Dar es Salaam',
    'Kimweri Avenue, Msasani',
    '+255 739 542 542',
    ARRAY['maternity','antenatal','child_health','emergency','nutrition'],
    true,
    '24 hours',
    false
  ),
  (
    'Lugalo Military Hospital',
    'Kinondoni',
    'Dar es Salaam',
    'Kawe / Bagamoyo Road, Ukwamani',
    '+255 22 292 7568',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency'],
    true,
    '24 hours',
    false
  )
ON CONFLICT DO NOTHING;
