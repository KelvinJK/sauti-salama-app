import { useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Save, Trash2, LockKeyhole, Plus, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useAppText } from '@/lib/app-copy';
import { useI18n } from '@/lib/i18n';
import { listRecords, saveRecord, deleteRecord, readProfile } from '@/lib/app.functions';
import type { RecordKind } from '@/lib/app-model';
import { useAppAuth } from './AuthProvider';
import { PageTitle } from './AppShell';

export function RecordPage({ kind, title, subtitle }: { kind: RecordKind; title: [string, string]; subtitle: [string, string] }) {
  const text = useAppText();
  const { lang } = useI18n();
  const { user, loading } = useAppAuth();
  const fetchRecords = useServerFn(listRecords), fetchProfile = useServerFn(readProfile), save = useServerFn(saveRecord), remove = useServerFn(deleteRecord);
  const profile = useQuery({ queryKey: ['profile', user?.id], queryFn: () => fetchProfile(), enabled: !!user });
  const registered = !!profile.data?.terms_accepted_at && !!profile.data?.birth_date;
  const records = useQuery({ queryKey: ['records', user?.id, kind], queryFn: () => fetchRecords({ data: { kind } }), enabled: !!user && registered });
  const children = useQuery({ queryKey: ['records', user?.id, 'child'], queryFn: () => fetchRecords({ data: { kind: 'child' } }), enabled: !!user && registered && kind === 'growth' });
  const [date, setDate] = useState('');
  const [entryTitle, setEntryTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('');
  const [bleeding, setBleeding] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [childId, setChildId] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const symptomOptions = [['cramps', 'Cramps', 'Maumivu ya tumbo'], ['headache', 'Headache', 'Maumivu ya kichwa'], ['fatigue', 'Fatigue', 'Uchovu'], ['bloating', 'Bloating', 'Kuvimba tumbo']] as const;
  async function submit(e: FormEvent) {
    e.preventDefault(); setError('');
    if (!date || (kind !== 'cycle' && !entryTitle.trim())) { setError(text('Complete the date and title.', 'Jaza tarehe na kichwa.')); return; }
    setBusy(true);
    try {
      await save({ data: { kind, record_date: date, title: kind === 'cycle' ? 'Daily cycle log' : entryTitle, details: { notes, ...(kind === 'cycle' ? { mood, bleeding, symptoms } : {}), ...(kind === 'growth' ? { child_id: childId, weight: Number(weight), height: Number(height) } : {}) } } });
      await records.refetch(); setEntryTitle(''); setNotes('');
      toast.success(text('Saved privately', 'Imehifadhiwa kwa faragha'));
    } catch { setError(text('Not saved. Check your details and try again.', 'Haijahifadhiwa. Hakiki taarifa na ujaribu tena.')); }
    finally { setBusy(false); }
  }
  async function deleteOne(id: string) {
    if (!window.confirm(text('Delete this record permanently?', 'Futa kumbukumbu hii kabisa?'))) return;
    setBusy(true);
    try { await remove({ data: { id } }); await records.refetch(); toast.success(text('Record deleted', 'Kumbukumbu imefutwa')); }
    catch { setError(text('Could not delete. Please try again.', 'Imeshindikana kufuta. Jaribu tena.')); }
    finally { setBusy(false); }
  }
  return <><PageTitle title={text(...title)} sub={text(...subtitle)} />
    {kind === 'pregnancy' && <div className="mb-6 flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/app/antenatal">{text('Antenatal planner', 'Mpango wa kliniki')}</Link></Button><Button asChild variant="outline"><Link to="/app/postnatal">{text('Postnatal care', 'Baada ya kujifungua')}</Link></Button><Button asChild variant="ghost"><Link to="/app/learn">{text('Pregnancy education', 'Elimu ya ujauzito')}</Link></Button></div>}
    {kind === 'child' && <Button asChild variant="outline" className="mb-6"><Link to="/app/growth"><Plus />{text('Growth measurements', 'Vipimo vya ukuaji')}</Link></Button>}
    <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="h-4 w-4" />{text('Private records · only you can access them', 'Kumbukumbu binafsi · wewe tu unaweza kuzifikia')}</div>
    {loading || (user && profile.isPending) ? <p role="status">{text('Loading your private space…', 'Inapakia nafasi yako binafsi…')}</p> : !user || !registered ? <div className="mb-8 border-y py-6"><h2 className="text-lg font-bold">{text(!user ? 'Your private space starts here' : 'Complete your adult registration', !user ? 'Nafasi yako binafsi inaanza hapa' : 'Kamilisha usajili wa mtu mzima')}</h2><p className="my-3 text-muted-foreground">{text('Personal records are available to registered adults aged 18 and older.', 'Kumbukumbu binafsi ni kwa watu waliosajiliwa wenye miaka 18 na zaidi.')}</p><Button asChild><Link to={user ? '/app/profile' : '/auth'}>{text(user ? 'Complete profile' : 'Sign in or create account', user ? 'Kamilisha wasifu' : 'Ingia au fungua akaunti')}</Link></Button><Button asChild variant="ghost" className="ml-2"><Link to="/app/learn">{text('Read health information', 'Soma taarifa za afya')}</Link></Button></div> : null}
    {profile.isError && <p role="alert" className="text-destructive">{text('Profile could not load.', 'Wasifu haukupakiwa.')} <Button onClick={() => profile.refetch()} variant="link">{text('Retry', 'Jaribu tena')}</Button></p>}
    <div className="grid items-start gap-10 lg:grid-cols-2">
      {kind === 'cycle' && <section className="rounded-lg border bg-card p-4"><Calendar mode="single" selected={date ? new Date(`${date}T12:00:00`) : undefined} onSelect={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : '')} modifiers={{ logged: (records.data ?? []).map(r => new Date(`${r.record_date}T12:00:00`)) }} modifiersClassNames={{ logged: 'bg-pink font-bold' }} formatters={{ formatCaption: d => d.toLocaleDateString(lang === 'sw' ? 'sw-TZ' : 'en-TZ', { month: 'long', year: 'numeric' }) }} className="mx-auto w-full max-w-sm [--cell-size:2.5rem]" /><p className="mt-3 text-sm text-muted-foreground">{text('Logged days are highlighted. No fertility predictions are made.', 'Siku zilizorekodiwa zimeonyeshwa. Hakuna utabiri wa uzazi.')}</p></section>}
      <form onSubmit={submit} className="space-y-5">
        <h2 className="text-xl font-bold">{text(kind === 'child' ? 'Add a child profile' : 'New record', kind === 'child' ? 'Ongeza wasifu wa mtoto' : 'Kumbukumbu mpya')}</h2>
        <fieldset disabled={!registered || !user || busy} className="space-y-5 disabled:opacity-60">
          <label className="block text-sm font-semibold">{text(kind === 'child' ? 'Date of birth' : 'Date', kind === 'child' ? 'Tarehe ya kuzaliwa' : 'Tarehe')}<Input type="date" required value={date} onChange={e => setDate(e.target.value)} className="mt-2 h-11" /></label>
          {kind !== 'cycle' && <label className="block text-sm font-semibold">{text(kind === 'child' ? 'Child’s name' : kind === 'pregnancy' ? 'Journey name' : 'Title', kind === 'child' ? 'Jina la mtoto' : kind === 'pregnancy' ? 'Jina la safari' : 'Kichwa')}<Input required maxLength={160} value={entryTitle} onChange={e => setEntryTitle(e.target.value)} className="mt-2 h-11" /></label>}
          {kind === 'cycle' && <><label className="block text-sm font-semibold">{text('Mood', 'Hisia')}<select className="mt-2 h-11 w-full rounded-md border bg-background px-3" value={mood} onChange={e => setMood(e.target.value)}><option value="">{text('Choose mood', 'Chagua hisia')}</option>{[['happy','Happy','Furaha'],['calm','Calm','Utulivu'],['low','Low','Huzuni'],['anxious','Anxious','Wasiwasi']].map(([v,en,sw]) => <option key={v} value={v}>{text(en ?? '', sw ?? '')}</option>)}</select></label><label className="block text-sm font-semibold">{text('Bleeding', 'Damu')}<select className="mt-2 h-11 w-full rounded-md border bg-background px-3" value={bleeding} onChange={e => setBleeding(e.target.value)}><option value="">{text('Choose flow', 'Chagua kiasi')}</option>{[['none','None','Hakuna'],['light','Light','Kidogo'],['medium','Medium','Wastani'],['heavy','Heavy','Nyingi']].map(([v,en,sw]) => <option key={v} value={v}>{text(en ?? '',sw ?? '')}</option>)}</select></label><div><p className="mb-2 text-sm font-semibold">{text('Symptoms', 'Dalili')}</p><div className="flex flex-wrap gap-3">{symptomOptions.map(([value,en,sw]) => <label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={symptoms.includes(value)} onChange={e => setSymptoms(old => e.target.checked ? [...old,value] : old.filter(v => v !== value))} />{text(en,sw)}</label>)}</div></div></>}
          {kind === 'growth' && <><label className="block text-sm font-semibold">{text('Child', 'Mtoto')}<select required value={childId} onChange={e => setChildId(e.target.value)} className="mt-2 h-11 w-full rounded-md border bg-background px-3"><option value="">{text('Choose a child', 'Chagua mtoto')}</option>{children.data?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>{children.data?.length === 0 && <Button asChild variant="link"><Link to="/app/children">{text('Add a child first', 'Ongeza mtoto kwanza')}</Link></Button>}<div className="grid grid-cols-2 gap-4"><label className="text-sm font-semibold">{text('Weight (kg)', 'Uzito (kg)')}<Input type="number" step="0.01" min="0.01" max="300" required value={weight} onChange={e => setWeight(e.target.value)} className="mt-2 h-11" /></label><label className="text-sm font-semibold">{text('Height (cm)', 'Urefu (cm)')}<Input type="number" step="0.1" min="0.1" max="250" required value={height} onChange={e => setHeight(e.target.value)} className="mt-2 h-11" /></label></div></>}
          <label className="block text-sm font-semibold">{text('Notes', 'Maelezo')}<Textarea value={notes} onChange={e => setNotes(e.target.value)} maxLength={10000} rows={4} className="mt-2" /></label>
          <Button type="submit" className="h-11 w-full">{busy ? <LoaderCircle className="animate-spin" /> : <Save />}{text(busy ? 'Saving…' : 'Save privately', busy ? 'Inahifadhi…' : 'Hifadhi kwa faragha')}</Button>
        </fieldset>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>
    </div>
    {registered && <section className="mt-10 border-t pt-7"><h2 className="mb-5 text-xl font-bold">{text('Your records', 'Kumbukumbu zako')}</h2>{records.isPending ? <p role="status">{text('Loading…', 'Inapakia…')}</p> : records.isError ? <p role="alert">{text('Could not load records.', 'Kumbukumbu hazikupakiwa.')}<Button variant="link" onClick={() => records.refetch()}>{text('Retry', 'Jaribu tena')}</Button></p> : !records.data?.length ? <p className="text-muted-foreground">{text('No records yet.', 'Bado hakuna kumbukumbu.')}</p> : <ul className="divide-y">{records.data.map(r => {
      const details = r.details && typeof r.details === 'object' && !Array.isArray(r.details) ? r.details : {};
      return <li key={r.id} className="flex items-start justify-between gap-4 py-5"><div><p className="text-xs text-muted-foreground">{r.record_date}</p><h3 className="mt-1 font-bold">{kind === 'cycle' ? text('Daily cycle log','Kumbukumbu ya mzunguko') : r.title}</h3>{details['mood'] && <p className="mt-2 text-sm">{text('Mood','Hisia')}: {String(details['mood'])} · {text('Flow','Damu')}: {String(details['bleeding'] || '—')}</p>}{details['weight'] && <p className="mt-2 text-sm">{String(details['weight'])} kg · {String(details['height'])} cm</p>}{details['notes'] && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">{String(details['notes'])}</p>}</div><Button variant="ghost" size="icon" disabled={busy} aria-label={text('Delete record','Futa kumbukumbu')} onClick={() => deleteOne(r.id)}><Trash2 className="text-destructive" /></Button></li>;
    })}</ul>}<p className="mt-4 text-xs text-muted-foreground">{text('Showing up to 200 recent records. Your profile export includes all records.', 'Inaonyesha kumbukumbu 200 za karibuni. Upakuaji wa wasifu unajumuisha zote.')}</p></section>}
  </>;
}