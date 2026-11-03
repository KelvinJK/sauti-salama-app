// Soft illustrated round faces that adapt to light and dark mode.
type Face = { fill: string; mouth: string; eyes?: 'dot' | 'closed' | 'happy' | 'wide'; brows?: 'angry' | 'worried' | 'none'; tear?: boolean; blush?: boolean };
const faces: Record<string, Face> = {
  joyful: { fill: 'var(--mood-joyful, #FFD9C2)', mouth: 'M20 37 Q32 50 44 37 Z', eyes: 'happy', blush: true },
  calm: { fill: 'var(--mood-calm, #CFF3E6)', mouth: 'M23 39 Q32 44 41 39', eyes: 'closed' },
  grateful: { fill: 'var(--mood-grateful, #FBD3E3)', mouth: 'M22 38 Q32 47 42 38', eyes: 'happy', blush: true },
  energized: { fill: 'var(--mood-energized, #FFC59E)', mouth: 'M21 36 Q32 50 43 36 Z', eyes: 'wide' },
  sensitive: { fill: 'var(--mood-sensitive, #E6DBFB)', mouth: 'M25 41 Q32 38 39 41', eyes: 'wide', brows: 'worried' },
  confused: { fill: 'var(--mood-confused, #E6DBFB)', mouth: 'M24 41 Q29 38 32 41 T40 40', eyes: 'dot' },
  tired: { fill: 'var(--mood-tired, #DCD3EE)', mouth: 'M27 41 L37 41', eyes: 'closed' },
  stressed: { fill: 'var(--mood-stressed, #FFD2BF)', mouth: 'M23 42 L27 39 L32 42 L37 39 L41 42', eyes: 'dot', brows: 'worried' },
  angry: { fill: 'var(--mood-angry, #FFB8A0)', mouth: 'M24 43 Q32 37 40 43', eyes: 'dot', brows: 'angry' },
  insecure: { fill: 'var(--mood-insecure, #E9E1F7)', mouth: 'M25 42 Q32 39 39 42', eyes: 'dot', brows: 'worried' },
  hurt: { fill: 'var(--mood-hurt, #D9CCF5)', mouth: 'M24 44 Q32 37 40 44', eyes: 'dot', brows: 'worried', tear: true },
  hopeful: { fill: 'var(--mood-hopeful, #FFE3C9)', mouth: 'M23 39 Q32 46 41 39', eyes: 'dot', blush: true },
};
export function MoodFace({ mood, className = "", size = 40 }: { mood: string; className?: string; size?: number }) {
  const f = faces[mood] ?? faces['calm']!;
  return <svg viewBox="0 0 64 64" className={`mood-face ${className}`} style={{ width: size, height: size }} aria-hidden="true">
    <circle cx="32" cy="32" r="29" fill={f.fill} stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" />
    {f.blush && <><circle cx="18" cy="36" r="4" fill="var(--mood-blush, #FF5A0B)" opacity="0.35" /><circle cx="46" cy="36" r="4" fill="var(--mood-blush, #FF5A0B)" opacity="0.35" /></>}
    {f.eyes === 'closed' ? <><path d="M19 27 Q23 30 27 27" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" /><path d="M37 27 Q41 30 45 27" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" /></>
      : f.eyes === 'happy' ? <><path d="M19 28 Q23 23 27 28" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" /><path d="M37 28 Q41 23 45 28" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" /></>
      : <><circle cx="23" cy="27" r={f.eyes === 'wide' ? 3.8 : 2.8} fill="currentColor" /><circle cx="41" cy="27" r={f.eyes === 'wide' ? 3.8 : 2.8} fill="currentColor" /></>}
    {f.brows === 'angry' && <><path d="M18 19 L27 22" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><path d="M46 19 L37 22" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></>}
    {f.brows === 'worried' && <><path d="M18 21 L27 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><path d="M46 21 L37 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></>}
    {f.tear && <path d="M44 31 Q46 36 44 38 Q42 36 44 31 Z" fill="currentColor" opacity="0.7" />}
    <path d={f.mouth} stroke="currentColor" strokeWidth="2.6" fill={f.mouth.endsWith('Z') ? 'var(--mood-mouth-fill, #fff)' : 'none'} strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
