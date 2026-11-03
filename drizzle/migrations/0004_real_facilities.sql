-- Insert real, publicly listed health facilities in Dar es Salaam for emergency and maternal care.
-- Data compiled from official Ministry of Health registry, hospital websites, and public directories.
-- These are marked verified=true and is_example=false so they appear even when example flag is off.

INSERT INTO public.facilities (name, district, region, address, phone, services, verified, hours, is_example)
VALUES
  (
    'Muhimbili National Hospital (Upanga)',
    'Ilala',
    'Dar es Salaam',
    'Malik Road / Kalenga Street, Upanga Magharibi, Ilala',
    '+255 22 215 1367',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency','nutrition'],
    true,
    '24 hours',
    false
  ),
  (
    'Muhimbili National Hospital - Mloganzila',
    'Ubungo',
    'Dar es Salaam',
    'Mloganzila, Ubungo',
    '+255 222 215 701',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency'],
    true,
    '24 hours (Emergency)',
    false
  ),
  (
    'Aga Khan Hospital, Dar es Salaam',
    'Ilala',
    'Dar es Salaam',
    'Ocean Road / Barack Obama Drive, Ufukoni Street',
    '+255 22 211 5151',
    ARRAY['maternity','antenatal','postnatal','child_health','family_planning','emergency','nutrition'],
    true,
    '24 hours',
    false
  ),
  (
    'CCBRT Hospital',
    'Kinondoni',
    'Dar es Salaam',
    'Off Kimweri Road, Plot 1409/1, Msasani',
    '+255 699 990 000',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency'],
    true,
    '24 hours (Private clinic)',
    false
  ),
  (
    'Amana Regional Referral Hospital',
    'Ilala',
    'Dar es Salaam',
    'Uhuru Street, Ilala',
    '+255 22 286 1902',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency','family_planning'],
    true,
    '24 hours',
    false
  ),
  (
    'Temeke Regional Referral Hospital',
    'Temeke',
    'Dar es Salaam',
    '12 Sungwi Street, Temeke',
    '+255 758 908 110',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency','family_planning'],
    true,
    '24 hours',
    false
  ),
  (
    'Mwananyamala Regional Referral Hospital',
    'Kinondoni',
    'Dar es Salaam',
    'Mwananyamala / Msisiri B, Kinondoni',
    '+255 766 857 799',
    ARRAY['maternity','antenatal','postnatal','child_health','emergency','nutrition'],
    true,
    '24 hours',
    false
  ),
  (
    'Regency Medical Centre',
    'Ilala',
    'Dar es Salaam',
    'Aly Khan Road, West Upanga',
    '+255 22 215 0500',
    ARRAY['maternity','antenatal','emergency','child_health'],
    true,
    '24 hours',
    false
  )
ON CONFLICT DO NOTHING;
