import { Link } from '@tanstack/react-router';
import { EyeOff, Phone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useAppText } from '@/lib/app-copy';
import { EMERGENCY_NUMBER } from '@/lib/device-vault';
import { useVault } from './VaultProvider';

export function QuickExit() {
  const { lock } = useVault(); const text = useAppText();
  return <Button variant="outline" className="min-h-11 rounded-full" onClick={() => { lock(); window.location.replace('https://www.google.com'); }}><EyeOff className="size-4" />{text('Quick exit', 'Ondoka haraka')}</Button>;
}
export function UrgentHelpBanner() {
  const text = useAppText(); const [open, setOpen] = useState(false);
  const signs = [['Heavy bleeding','Kutokwa damu nyingi'],['Severe headache or blurred vision','Maumivu makali ya kichwa au kuona ukungu'],['Fits or convulsions','Kifafa au degedege'],['High fever','Homa kali'],['Baby moving less than usual','Mtoto kucheza kidogo kuliko kawaida'],['Severe abdominal pain','Maumivu makali ya tumbo']] as const;
  return <><Button variant="ghost" className="mb-6 h-auto w-full justify-start gap-4 whitespace-normal rounded-lg bg-pink p-4 text-left" onClick={() => setOpen(true)}><span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><Phone /></span><span><span className="block font-bold">{text('Urgent help','Msaada wa dharura')}</span><span className="block text-sm font-normal">{text('Danger signs, emergency call, nearest care','Dalili hatari, simu ya dharura, huduma karibu')}</span></span></Button><Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom" className="mx-auto max-h-[90dvh] max-w-2xl overflow-y-auto rounded-t-lg p-6"><SheetHeader><SheetTitle>{text('Urgent help','Msaada wa dharura')}</SheetTitle><SheetDescription>{text('If you or your baby may be in danger, get help now.','Ikiwa wewe au mtoto wako mnaweza kuwa hatarini, pata msaada sasa.')}</SheetDescription></SheetHeader><ul className="my-5 list-disc space-y-2 pl-5">{signs.map(([en,sw]) => <li key={en}>{text(en,sw)}</li>)}</ul><p className="mb-4 text-sm font-semibold text-muted-foreground">{text('Clinically reviewed: pending','Ukaguzi wa kitabibu: unasubiri')}</p><div className="flex flex-col gap-3"><Button asChild><a href={`tel:${EMERGENCY_NUMBER}`}><Phone />{text('Call','Piga')} {EMERGENCY_NUMBER}</a></Button><Button asChild variant="outline"><Link to="/app/find-care" onClick={() => setOpen(false)}>{text('Find the nearest facility','Tafuta kituo kilicho karibu')}</Link></Button><Button variant="ghost" onClick={() => setOpen(false)}>{text('Close','Funga')}</Button></div></SheetContent></Sheet></>;
}