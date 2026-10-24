import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Save, Trash2, LockKeyhole, Plus, LoaderCircle } from 'lucide-react';
import { MoodFace } from './MoodFace';
import { moods } from '@/lib/moods';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useAppText } from '@/lib/app-copy';
import { useI18n } from '@/lib/i18n';
import type { RecordKind } from '@/lib/app-model';
import { CHECK_IN_TITLE } from '@/lib/device-vault';
import { symptomOptions } from '@/lib/moods';
import { PageTitle } from './AppShell';
import { usePrivateRecords } from './usePrivateRecords';
import { MoodPicker } from './MoodPicker';
import { TrackTabs } from './TrackTabs';
import { UrgentHelpBanner } from './Safety';
import { ComingSoon } from './ComingSoon';

export function RecordPage({ kind, title, subtitle, initialMood = '', view = 'both' }: { kind: RecordKind; title: [string,string]; subtitle: [string,string]; initialMood?: string; view?: 'both'|'list'|'form' }) {
  const text = useAppText(); const { lang } = useI18n(); const navigate = useNavigate();
  const records = usePrivateRecords(kind), children = usePrivateRecords('child');
  const [date,setDate] = useState(''), [entryTitle,setEntryTitle] = useState(''), [notes,setNotes] = useState(''), [mood,setMood] = useState(initialMood), [bleeding,setBleeding] = useState('');
  const [symptoms,setSymptoms] = useState<string[]>([]), [childId,setChildId] = useState(''), [weight,setWeight] = useState(''), [height,setHeight] = useState('');
  const [busy,setBusy] = useState(false), [error,setError] = useState('');
  useEffect(() => { setDate(format(new Date(),'yyyy-MM-dd')); }, []);
  useEffect(() => { if (initialMood) { setMood(initialMood); setEntryTitle(text('Mood note','Maelezo ya hisia')); } }, [initialMood]);
  const maternal = kind === 'pregnancy' || kind === 'antenatal' || kind === 'postnatal';
  const rows = records.rows.filter(r => r.title !== CHECK_IN_TITLE).sort((a,b) => b.record_date.localeCompare(a.record_date) || (b.created_at ?? '').localeCompare(a.created_at ?? ''));
  const showForm = view !== 'list', showList = view !== 'form';
  const moodLabel = (id: string) => { const m = moods.find(x => x[0] === id); return m ? text(m[1], m[2]) : id; };
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      await records.saveOne({ kind, record_date: date, title: kind === 'cycle' ? 'Daily cycle log' : entryTitle, details: { notes, mood, ...(kind === 'cycle' ? { bleeding,symptoms } : {}), ...(kind === 'growth' ? { child_id:childId,weight:Number(weight),height:Number(height) } : {}) } });
      setEntryTitle(''); setNotes('');
      toast.success(text(records.user ? 'Saved privately' : 'Saved on this device',records.user ? 'Imehifadhiwa kwa faragha' : 'Imehifadhiwa kwenye kifaa hiki'));
      if (view === 'form' && kind === 'journal') await navigate({ to: '/app/journal' });
    } catch (e) { setError(e instanceof Error ? e.message : text('Not saved. Check your details and try again.','Haijahifadhiwa. Hakiki taarifa na ujaribu tena.')); }
    finally { setBusy(false); }
  }
  async function deleteOne(id: string) {
    if (!window.confirm(text('Delete this record permanently?','Futa kumbukumbu hii kabisa?'))) return;
    try { await records.deleteOne(id); toast.success(text('Record deleted','Kumbukumbu imefutwa')); }
    catch { setError(text('Could not delete. Please retry.','Imeshindikana kufuta. Jaribu tena.')); }
  }
  return <>{maternal && <UrgentHelpBanner />}{(kind === 'cycle' || kind === 'journal') && <TrackTabs />}<PageTitle title={text(...title)} sub={text(...subtitle)} />
    {maternal ? <><div className="mb-6 flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/app/antenatal">{text('Antenatal planner','Mpango wa kliniki')}</Link></Button><Button asChild variant="outline"><Link to="/app/postnatal">{text('Postnatal care','Baada ya kujifungua')}</Link></Button></div><ComingSoon /></> : <>
    {kind === 'child' && <Button asChild variant="outline" className="mb-6"><Link to="/app/growth"><Plus />{text('Growth measurements','Vipimo vya ukuaji')}</Link></Button>}
    <p className="mb-5 flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="size-4" />{text(records.user ? 'Private account records' : 'Records stay on this device only',records.user ? 'Kumbukumbu binafsi za akaunti' : 'Kumbukumbu zinabaki kwenye kifaa hiki tu')}</p>
    {records.loading && <p role="status" className="mb-4">{text('Loading your private space…','Inapakia nafasi yako binafsi…')}</p>}
    {records.error && <div role="alert" className="mb-4"><p>{text('Your private space could not load. Please retry.','Nafasi yako binafsi haikupakiwa. Jaribu tena.')}</p><Button variant="outline" onClick={records.retry}>{text('Retry','Jaribu tena')}</Button></div>}
    {!records.canSave && !records.loading && <div className="mb-6 border-y py-5"><p>{text('Complete your adult registration to save account records.','Kamilisha usajili wa mtu mzima kuhifadhi kumbukumbu za akaunti.')}</p><Button asChild className="mt-3"><Link to="/app/profile">{text('Complete profile','Kamilisha wasifu')}</Link></Button></div>}
    {records.needsPin && !records.unlocked && records.vault.configured ? <section className="border-y py-8"><LockKeyhole className="mb-3 size-9 text-primary" /><h2 className="mb-4 text-xl font-bold">{text('Your records are locked','Kumbukumbu zako zimefungwa')}</h2><Button onClick={() => { void records.vault.ensureKey().catch(() => undefined); }}>{text('Unlock with PIN','Fungua kwa PIN')}</Button></section> : <>
    {view === 'list' && kind === 'journal' && <Button asChild className="mb-6 h-11"><Link to="/app/journal/new"><Plus />{text('New entry','Ingizo jipya')}</Link></Button>}
    {showForm && <div className="grid min-w-0 items-start gap-8 lg:grid-cols-2">
      {kind === 'cycle' && <section className="min-w-0 rounded-lg border bg-card p-3"><Calendar mode="single" weekStartsOn={1} selected={date ? new Date(`${date}T12:00:00`) : undefined} onSelect={d => setDate(d ? format(d,'yyyy-MM-dd') : '')} modifiers={{ logged:rows.map(r => new Date(`${r.record_date}T12:00:00`)), period:rows.filter(r => r.details['bleeding'] && r.details['bleeding'] !== 'none').map(r => new Date(`${r.record_date}T12:00:00`)) }} modifiersClassNames={{ logged:'ring-1 ring-primary rounded-md',period:'bg-pink rounded-md' }} classNames={{ today:'rounded-full bg-primary text-primary-foreground [&_button]:rounded-full [&_button]:bg-primary [&_button]:text-primary-foreground',outside:'text-muted-foreground opacity-40' }} formatters={{ formatCaption:d => d.toLocaleDateString(lang === 'sw' ? 'sw-TZ':'en-TZ',{month:'long',year:'numeric'}), formatWeekdayName:d => ['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()] ?? '' }} className="mx-auto w-full max-w-sm [--cell-size:2.5rem]" /><div className="mt-4 flex flex-wrap gap-4 text-xs"><span className="flex items-center gap-2"><span className="size-3 rounded-full bg-primary" />{text('Today','Leo')}</span><span className="flex items-center gap-2"><span className="size-3 rounded bg-pink" />{text('Period day','Siku ya hedhi')}</span><span className="flex items-center gap-2"><span className="size-3 rounded border border-primary" />{text('Logged day','Siku iliyorekodiwa')}</span></div><p className="mt-3 text-xs text-muted-foreground">{text('No fertility predictions.','Hakuna utabiri wa uzazi.')}</p></section>}
      <form onSubmit={submit} className="min-w-0 space-y-5">
        <h2 className="text-xl font-bold">{text(kind === 'child' ? 'Add a child profile':'New record',kind === 'child' ? 'Ongeza wasifu wa mtoto':'Kumbukumbu mpya')}</h2>
        <fieldset disabled={!records.canSave || busy} className="min-w-0 space-y-5 disabled:opacity-60">
          <label className="block text-sm font-semibold">{text(kind === 'child' ? 'Date of birth':'Date',kind === 'child' ? 'Tarehe ya kuzaliwa':'Tarehe')}<Input type="date" required value={date} onChange={e => setDate(e.target.value)} className="mt-2 h-11" /></label>
          {kind !== 'cycle' && <label className="block text-sm font-semibold">{text(kind === 'child' ? 'Child’s name':'Title',kind === 'child' ? 'Jina la mtoto':'Kichwa')}<Input required maxLength={160} value={entryTitle} onChange={e => setEntryTitle(e.target.value)} className="mt-2 h-11" /></label>}
          {(kind === 'cycle' || kind === 'journal') && <div className="min-w-0"><p className="text-sm font-semibold">{text('Mood','Hisia')}</p><MoodPicker value={mood} onChange={setMood} /></div>}
          {kind === 'cycle' && <><div><p className="mb-2 text-sm font-semibold">{text('Bleeding','Damu')}</p><div role="radiogroup" aria-label={text('Bleeding','Damu')} className="flex flex-wrap gap-2">{([['none','None','Hakuna'],['light','Light','Kidogo'],['medium','Medium','Wastani'],['heavy','Heavy','Nyingi']] as const).map(([v,en,sw]) => <Button type="button" key={v} role="radio" aria-checked={bleeding === v} variant={bleeding === v ? 'default':'outline'} className="min-h-11 rounded-full" onClick={() => setBleeding(old => old === v ? '' : v)}>{text(en,sw)}</Button>)}</div></div><div><p className="mb-2 text-sm font-semibold">{text('Symptoms','Dalili')}</p><div className="flex flex-wrap gap-2">{symptomOptions.map(([value,en,sw]) => <Button type="button" key={value} variant={symptoms.includes(value) ? 'default':'outline'} aria-pressed={symptoms.includes(value)} className="min-h-11 rounded-full" onClick={() => setSymptoms(old => old.includes(value) ? old.filter(v => v !== value):[...old,value])}>{text(en,sw)}</Button>)}</div></div></>}
          {kind === 'growth' && <><label className="block text-sm font-semibold">{text('Child','Mtoto')}<select required value={childId} onChange={e => setChildId(e.target.value)} className="mt-2 h-11 w-full rounded-md border bg-background px-3"><option value="">{text('Choose a child','Chagua mtoto')}</option>{children.rows.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>{children.rows.length === 0 && <Button asChild variant="link"><Link to="/app/children">{text('Add a child first','Ongeza mtoto kwanza')}</Link></Button>}<div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">{text('Weight (kg)','Uzito (kg)')}<Input type="number" step="0.01" min="0.01" max="300" required value={weight} onChange={e => setWeight(e.target.value)} className="mt-2 h-11" /></label><label className="text-sm font-semibold">{text('Height (cm)','Urefu (cm)')}<Input type="number" step="0.1" min="0.1" max="250" required value={height} onChange={e => setHeight(e.target.value)} className="mt-2 h-11" /></label></div></>}
          <label className="block text-sm font-semibold">{text('Notes','Maelezo')}<Textarea value={notes} onChange={e => setNotes(e.target.value)} maxLength={10000} rows={4} className="mt-2" /></label>
          <Button type="submit" className="h-11 w-full">{busy ? <LoaderCircle className="animate-spin" />:<Save />}{text(busy ? 'Saving…':'Save privately',busy ? 'Inahifadhi…':'Hifadhi kwa faragha')}</Button>
        </fieldset>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>
    </div>}
    {showList && <section className={showForm ? "mt-10 border-t pt-7" : ""}><h2 className="mb-5 text-xl font-bold">{text(kind === 'journal' ? 'Your entries' : 'Your records',kind === 'journal' ? 'Maingizo yako' : 'Kumbukumbu zako')}</h2>{!rows.length ? <p className="text-muted-foreground">{text(kind === 'journal' ? 'No entries yet' : 'No records yet.',kind === 'journal' ? 'Bado hakuna maingizo' : 'Bado hakuna kumbukumbu.')}</p>:<ul className="divide-y">{rows.map(r => <li key={r.id} className="flex items-start justify-between gap-4 py-5"><div className="min-w-0"><p className="text-xs text-muted-foreground">{r.record_date}</p><h3 className="mt-1 break-words font-bold">{r.title}</h3>{!!r.details['mood'] && <p className="mt-2 flex items-center gap-2 text-sm"><MoodFace mood={String(r.details['mood'])} className="h-7 w-7" />{moodLabel(String(r.details['mood']))}</p>}{!!r.details['weight'] && <p>{String(r.details['weight'])} kg · {String(r.details['height'])} cm</p>}{!!r.details['notes'] && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">{String(r.details['notes'])}</p>}</div><Button variant="ghost" size="icon" className="min-h-11 min-w-11 shrink-0" aria-label={text('Delete record','Futa kumbukumbu')} onClick={() => deleteOne(r.id)}><Trash2 className="text-destructive" /></Button></li>)}</ul>}</section>}</>}
    </>}
  </>;
}
