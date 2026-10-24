import { z } from 'zod';

export const facilityServices = ['maternity', 'antenatal', 'postnatal', 'family_planning', 'child_health', 'nutrition', 'emergency'] as const;
export type FacilityService = (typeof facilityServices)[number];

export const facilityServiceCopy: Record<FacilityService, { en: string; sw: string }> = {
  maternity: { en: 'Maternity & delivery', sw: 'Wakunga na kujifungua' },
  antenatal: { en: 'Antenatal clinic', sw: 'Kliniki ya ujauzito' },
  postnatal: { en: 'Postnatal care', sw: 'Huduma baada ya kujifungua' },
  family_planning: { en: 'Family planning', sw: 'Uzazi wa mpango' },
  child_health: { en: 'Child health', sw: 'Afya ya mtoto' },
  nutrition: { en: 'Nutrition support', sw: 'Msaada wa lishe' },
  emergency: { en: 'Emergency care', sw: 'Huduma za dharura' },
};

export const facilitySchema = z.object({
  name: z.string().trim().min(1).max(160),
  district: z.string().trim().min(1).max(80),
  region: z.string().trim().min(1).max(80),
  address: z.string().trim().max(240).default(''),
  phone: z.string().trim().max(40).default(''),
  services: z.array(z.enum(facilityServices)).min(1).max(facilityServices.length),
  verified: z.boolean(),
});

export type Facility = z.infer<typeof facilitySchema> & { id: string; created_at: string };

export function formatPhoneHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : '';
}
