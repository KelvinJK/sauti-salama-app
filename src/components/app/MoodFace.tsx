// Soft illustrated round faces in the SautiSalama palette (no emoji).
type Face = { fill: string; mouth: string; eyes?: 'dot' | 'closed' | 'happy' | 'wide'; brows?: 'angry' | 'worried' | 'none'; tear?: boolean; blush?: boolean };
const faces: Record<string, Face> = {
  joyful: { fill: 'var(--color-peach, #FFD9C2)', mouth: 'M20 37 Q32 50 44 37 Z', eyes: 'happy', blush: true },
  calm: { fill: 'var(--color-mint, #CFF3E6)', mouth: 'M23 39 Q32 44 41 39', eyes: 'closed' },
  grateful: { fill: 'var(--color-pink, #FBD3E3)', mouth: 'M22 38 Q32 47 42 38', eyes: 'happy', blush: true },
  energized: { fill: '#FFC59E', mouth: 'M21 36 Q32 50 43 36 Z', eyes: 'wide' },
  sensitive: { fill: 'var(--color-lavender, #E6DBFB)', mouth: 'M25 41 Q32 38 39 41', eyes: 'wide', brows: 'worried' },
  confused: { fill: '#E6DBFB', mouth: 'M24 41 Q29 38 32 41 T40 40', eyes: 'dot' },
  tired: { fill: '#DCD3EE', mouth: 'M27 41 L37 41', eyes: 'closed' },
  stressed: { fill: '#FFD2BF', mouth: 'M23 42 L27 39 L32 42 L37 39 L41 42', eyes: 'dot', brows: 'worried' },
  angry: { fill: '#FFB8A0', mouth: 'M24 43 Q32 37 40 43', eyes: 'dot', brows: 'angry' },
  insecure: { fill: '#E9E1F7', mouth: 'M25 42 Q32 39 39 42', eyes: 'dot', brows: 'worried' },
  hurt: { fill: '#D9CCF5', mouth: 'M24 44 Q32 37 40 44', eyes: 'dot', brows: 'worried', tear: true },
  hopeful: { fill: '#FFE3C9', mouth: 'M23 39 Q32 46 41 39', eyes: 'dot', blush: true },
};
const ink = '#35106F';
export function MoodFace({ mood, className = 'h-10 w-10' }: { mood: string; className?: string }) {
  const f = faces[mood] ?? faces['calm']!;
  return <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="29" fill={f.fill} stroke="#7139E8" strokeOpacity="0.25" strokeWidth="2" />
    {f.blush && <><circle cx="18" cy="36" r="4" fill="#FF5A0B" opacity="0.18" /><circle cx="46" cy="36" r="4" fill="#FF5A0B" opacity="0.18" /></>}
    {f.eyes === 'closed' ? <><path d="M19 27 Q23 30 27 27" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M37 27 Q41 30 45 27" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" /></>
      : f.eyes === 'happy' ? <><path d="M19 28 Q23 23 27 28" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M37 28 Q41 23 45 28" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" /></>
      : <><circle cx="23" cy="27" r={f.eyes === 'wide' ? 3.6 : 2.6} fill={ink} /><circle cx="41" cy="27" r={f.eyes === 'wide' ? 3.6 : 2.6} fill={ink} /></>}
    {f.brows === 'angry' && <><path d="M18 19 L27 22" stroke={ink} strokeWidth="2.5" strokeLinecap="round" /><path d="M46 19 L37 22" stroke={ink} strokeWidth="2.5" strokeLinecap="round" /></>}
    {f.brows === 'worried' && <><path d="M18 21 L27 18" stroke={ink} strokeWidth="2.5" strokeLinecap="round" /><path d="M46 21 L37 18" stroke={ink} strokeWidth="2.5" strokeLinecap="round" /></>}
    {f.tear && <path d="M44 31 Q46 36 44 38 Q42 36 44 31 Z" fill="#7139E8" opacity="0.6" />}
    <path d={f.mouth} stroke={ink} strokeWidth="2.5" fill={f.mouth.endsWith('Z') ? '#fff' : 'none'} strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
