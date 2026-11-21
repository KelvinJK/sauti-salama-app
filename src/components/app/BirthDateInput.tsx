import { forwardRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAppText } from '@/lib/app-copy';
import { cn } from '@/lib/utils';

const MONTHS: Array<[string, string]> = [
  ['January', 'Januari'], ['February', 'Februari'], ['March', 'Machi'], ['April', 'Aprili'],
  ['May', 'Mei'], ['June', 'Juni'], ['July', 'Julai'], ['August', 'Agosti'],
  ['September', 'Septemba'], ['October', 'Oktoba'], ['November', 'Novemba'], ['December', 'Desemba'],
];

function daysIn(year: number, month: number) {
  // month is 1-12; a leap year is assumed until the year is chosen, so 29 Feb stays selectable.
  return new Date(Date.UTC(year || 2000, month, 0)).getUTCDate();
}

function split(value: string): [string, string, string] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? [String(Number(m[3])), String(Number(m[2])), m[1]!] : ['', '', ''];
}

type Props = {
  /** ISO date (YYYY-MM-DD), or '' while incomplete. */
  value: string;
  onChange: (value: string) => void;
  /** Youngest allowed age; the year list starts this many years ago. */
  minAge?: number;
  maxAge?: number;
  invalid?: boolean;
  id?: string;
};

const selectClass =
  'h-12 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-8 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/**
 * Day / Month / Year dropdowns. Easier than a calendar picker on phones:
 * the native wheels open straight on the right list and the year list only
 * contains plausible years, newest first.
 */
export const BirthDateInput = forwardRef<HTMLSelectElement, Props>(function BirthDateInput(
  { value, onChange, minAge = 0, maxAge = 120, invalid, id },
  ref,
) {
  const text = useAppText();
  const [[day, month, year], setParts] = useState(() => split(value));

  // Follow outside changes (e.g. a saved profile loading in).
  useEffect(() => {
    const next = split(value);
    if (value && next.join('-') !== [day, month, year].join('-')) setParts(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: maxAge - minAge + 1 }, (_, i) => String(thisYear - minAge - i));
  const maxDay = month ? daysIn(Number(year), Number(month)) : 31;
  const days = Array.from({ length: maxDay }, (_, i) => String(i + 1));

  function update(nextDay: string, nextMonth: string, nextYear: string) {
    // Keep the day valid when the month or year changes (31 → 30, 29 Feb → 28 Feb).
    if (nextDay && nextMonth && Number(nextDay) > daysIn(Number(nextYear), Number(nextMonth))) nextDay = '';
    setParts([nextDay, nextMonth, nextYear]);
    onChange(
      nextDay && nextMonth && nextYear
        ? `${nextYear}-${nextMonth.padStart(2, '0')}-${nextDay.padStart(2, '0')}`
        : '',
    );
  }

  const field = (
    label: string,
    current: string,
    options: Array<[string, string]>,
    set: (v: string) => void,
    first?: boolean,
  ) => (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        ref={first ? ref : undefined}
        id={first ? id : undefined}
        value={current}
        onChange={(e) => set(e.target.value)}
        aria-invalid={invalid && !current ? true : undefined}
        className={cn(selectClass, !current && 'text-muted-foreground', invalid && !current && 'border-destructive')}
      >
        <option value="">{label}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  );

  return (
    <div className="mt-2 grid grid-cols-[1fr_1.6fr_1.3fr] gap-2">
      {field(text('Day', 'Siku'), day, days.map((d) => [d, d]), (d) => update(d, month, year), true)}
      {field(text('Month', 'Mwezi'), month, MONTHS.map(([en, sw], i) => [String(i + 1), text(en, sw)]), (m) => update(day, m, year))}
      {field(text('Year', 'Mwaka'), year, years.map((y) => [y, y]), (y) => update(day, month, y))}
    </div>
  );
});
