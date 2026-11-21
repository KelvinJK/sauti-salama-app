import { DomainLink } from '@/components/DomainLink';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { oauthReturnPath } from '@/lib/oauth-return-path';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { saveProfile } from '@/lib/app.functions';
import { useI18n } from '@/lib/i18n';
import { Mail, LockKeyhole, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppText } from '@/lib/app-copy';
import { useAppAuth } from '@/components/app/AuthProvider';
import { isAdult } from '@/lib/app-model';
import { AppShell, PageTitle } from '@/components/app/AppShell';
import { BirthDateInput } from '@/components/app/BirthDateInput';
import { appSeo as seo } from '@/lib/seo';
export const Route = createFileRoute('/auth')({ staticData: { sitemap: false }, validateSearch: (s: Record<string, unknown>): { next?: string } => typeof s['next'] === 'string' ? { next: s['next'] } : {}, head: () => seo('Sign in or create an account', 'Secure Sauti Salama accounts for adults aged 18 and older.'), component: Auth });
function Auth() {
  const text = useAppText(); const navigate = useNavigate(); const { user } = useAppAuth();
  const { next: rawNext } = Route.useSearch();
  const next = rawNext ? oauthReturnPath(rawNext) : '';
  const returnUrl = () => next && next !== '/' ? new URL(`/auth?next=${encodeURIComponent(next)}`, window.location.origin).href : `${window.location.origin}/auth`;
  const { lang } = useI18n(); const save = useServerFn(saveProfile);
  // The sign-up form already collects name, birth date and consent, and keeps them in the
  // account's metadata. Once the email is confirmed, write them to the profile so the person
  // goes straight in instead of filling the same details again. Works even if they confirm
  // on another device, because it reads the metadata, not this page's state.
  const completeProfile = async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getUser();
      const m = (data.user?.user_metadata ?? {}) as { display_name?: string; birth_date?: string; language?: string; terms_accepted?: boolean };
      if (!m.display_name || !m.birth_date || !m.terms_accepted || !isAdult(m.birth_date)) return false;
      await save({ data: { display_name: m.display_name, birth_date: m.birth_date, language: m.language === 'sw' ? 'sw' : 'en', acceptTerms: true } });
      return true;
    } catch { return false; }
  };
  const goOn = async () => {
    if (next && next !== '/') { window.location.href = next; return; }
    const ready = await completeProfile();
    await navigate({ to: ready ? '/app/home' : '/app/profile' });
  };
  useEffect(() => { if (user && next && next !== '/') window.location.href = next; }, [user, next]);
  const [mode, setMode] = useState<'login'|'signup'|'reset'|'verify'>('login');
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [password,setPassword]=useState(''), [birth,setBirth]=useState(''), [code,setCode]=useState('');
  const [accepted,setAccepted]=useState(false), [busy,setBusy]=useState(false), [message,setMessage]=useState(''), [error,setError]=useState('');
  // Which field the current error is about, so it can be highlighted and brought into view.
  // Set when sign-up finds the email already registered, to offer "Sign in" / "Reset password" right there.
  const [exists,setExists]=useState(false);
  const [badField,setBadField]=useState<''|'name'|'email'|'password'|'birth'|'terms'|'code'>('');
  const refs = { name: useRef<HTMLInputElement>(null), email: useRef<HTMLInputElement>(null), password: useRef<HTMLInputElement>(null), birth: useRef<HTMLSelectElement>(null), terms: useRef<HTMLInputElement>(null), code: useRef<HTMLInputElement>(null) };
  const alertRef = useRef<HTMLDivElement>(null);
  // Bring any new error into view: on phones it is otherwise easy to miss.
  useEffect(() => { if (error) alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [error]);
  const fail = (field: typeof badField, en: string, sw: string) => {
    setBadField(field); setError(text(en, sw));
    if (field) refs[field].current?.focus({ preventScroll: true });
  };
  // Our own checks replace the browser's built-in ones, which many Android browsers block silently.
  function invalid(): boolean {
    if (mode==='signup' && !name.trim()) { fail('name','Enter your name.','Weka jina lako.'); return true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { fail('email','Enter a valid email address.','Weka barua pepe sahihi.'); return true; }
    if (mode==='verify' && !/^\d{6}$/.test(code)) { fail('code','Enter the 6-digit code from the email.','Weka msimbo wa tarakimu 6 kutoka kwenye barua pepe.'); return true; }
    if ((mode==='login'||mode==='signup') && password.length < 8) { fail('password','Your password needs at least 8 characters.','Nenosiri linahitaji angalau herufi 8.'); return true; }
    if (mode==='signup') {
      if (!birth) { fail('birth','Choose your day, month and year of birth.','Chagua siku, mwezi na mwaka wa kuzaliwa.'); return true; }
      if (!isAdult(birth)) { fail('birth','Sauti Salama accounts are for adults aged 18 and older.','Akaunti za Sauti Salama ni za watu wazima wenye miaka 18 au zaidi.'); return true; }
      if (!accepted) { fail('terms','Tick the box to accept the terms and privacy policy.','Weka alama kwenye kisanduku kukubali masharti na sera ya faragha.'); return true; }
    }
    return false;
  }
  const switchMode = (next: typeof mode) => { setMode(next); setError(''); setMessage(''); setBadField(''); setExists(false); };
  const codeSent = () => { setCode(''); setMode('verify'); setMessage(text(`We sent a 6-digit code to ${email}. Enter it below to confirm your email.`, `Tumetuma msimbo wa tarakimu 6 kwa ${email}. Uweke hapa chini kuthibitisha barua pepe yako.`)); };
  async function resendCode() {
    setError(''); setBusy(true);
    try { const {error}=await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo:returnUrl()}}); if(error) throw error; codeSent(); }
    catch { setError(text('Could not send a new code. Wait a minute and try again.', 'Imeshindikana kutuma msimbo mpya. Subiri dakika moja ujaribu tena.')); }
    finally { setBusy(false); }
  }
  async function submit(e: FormEvent) {
    e.preventDefault(); setMessage(''); setError(''); setBadField(''); setExists(false);
    if (invalid()) return;
    setBusy(true);
    try {
      if(mode==='reset') { const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`}); if(error) throw error; setMessage(text('If this email has an account, a reset link has been sent.', 'Ikiwa barua pepe hii ina akaunti, kiungo cha kubadili nenosiri kimetumwa.')); }
      else if(mode==='verify') {
        const {error}=await supabase.auth.verifyOtp({email,token:code.trim(),type:'email'});
        if(error) { setError(text('That code is not valid or has expired. Check it or send a new one.', 'Msimbo huo si sahihi au umeisha muda. Hakiki au tuma mpya.')); return; }
        await goOn();
      }
      else if(mode==='signup') { const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:returnUrl(),data:{display_name:name.trim().slice(0,80),birth_date:birth,language:lang,terms_accepted:true}}}); if(error) throw error;
        // With "Confirm email" on, Supabase hides existing accounts by returning a user with no identities instead of an error.
        if(data.user && data.user.identities?.length===0) { setExists(true); setError(text('This email already has a Sauti Salama account. Sign in instead, or reset your password if you forgot it.','Barua pepe hii tayari ina akaunti ya Sauti Salama. Ingia badala yake, au badilisha nenosiri ikiwa umelisahau.')); return; }
        if(data.session) await goOn(); else codeSent(); }
      else {
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error?.code==='email_not_confirmed') { await resendCode(); return; }
        if(error) throw error; await goOn();
      }
    } catch (err) {
      const status = (err as { status?: number } | null)?.status;
      const code = (err as { code?: string } | null)?.code;
      if (code === 'user_already_exists' || code === 'email_exists') { setExists(true); setError(text('This email already has a Sauti Salama account. Sign in instead, or reset your password if you forgot it.','Barua pepe hii tayari ina akaunti ya Sauti Salama. Ingia badala yake, au badilisha nenosiri ikiwa umelisahau.')); }
      else if (code === 'weak_password') { fail('password','Choose a stronger password: at least 8 characters, mixing letters and numbers.','Chagua nenosiri imara zaidi: angalau herufi 8, changanya herufi na namba.'); }
      else if (status === 429) setError(text('Too many attempts. Wait a minute and try again.', 'Majaribio mengi mno. Subiri dakika moja ujaribu tena.'));
      else setError(text('Unable to continue. Check your details and try again.', 'Imeshindikana kuendelea. Hakiki taarifa zako ujaribu tena.'));
    }
    finally{setBusy(false);}
  }
  async function social(provider: 'google') {
    setError(''); setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: returnUrl() },
      });
      if (error) throw error;
    } catch {
      setError(text('Sign-in was not completed. Please try again.', 'Kuingia hakukukamilika. Jaribu tena.'));
    } finally { setBusy(false); }
  }
  const bad = (f: typeof badField) => badField === f ? 'border-destructive focus-visible:ring-destructive' : '';
  const title = text(
    mode==='signup'?'Create your account':mode==='reset'?'Reset your password':mode==='verify'?'Confirm your email':'Welcome back',
    mode==='signup'?'Fungua akaunti':mode==='reset'?'Badilisha nenosiri':mode==='verify'?'Thibitisha barua pepe':'Karibu tena',
  );
  const submitLabel = text(
    busy?'Please wait…':mode==='signup'?'Create account':mode==='reset'?'Send reset link':mode==='verify'?'Verify and continue':'Sign in',
    busy?'Subiri…':mode==='signup'?'Fungua akaunti':mode==='reset'?'Tuma kiungo':mode==='verify'?'Thibitisha na uendelee':'Ingia',
  );
  return <AppShell><div className="mx-auto max-w-md">
    <PageTitle title={title} sub={text('Your health information stays private.', 'Taarifa zako za afya ni binafsi.')} />
    {user ? <div className="space-y-4"><p>{text('You are signed in.', 'Umeingia.')}</p><Button asChild><Link to="/app/profile">{text('Go to my profile','Nenda kwenye wasifu')}<ArrowRight /></Link></Button></div> : <>
      {/* noValidate: our own checks show a clear message instead of the browser silently blocking the tap. */}
      <form onSubmit={submit} noValidate className="space-y-5">
        {mode==='signup' && <label className="block text-sm font-semibold">{text('Your name','Jina lako')}
          <Input ref={refs.name} autoComplete="name" autoCapitalize="words" maxLength={80} value={name} onChange={e=>setName(e.target.value)} aria-invalid={badField==='name' || undefined} className={`mt-2 h-12 text-base ${bad('name')}`} />
          <span className="mt-1 block text-xs font-normal text-muted-foreground">{text('How we greet you in the app. A first name or nickname is fine.','Jinsi tutakavyokusalimia kwenye programu. Jina la kwanza au la utani linatosha.')}</span>
        </label>}
        <label className="block text-sm font-semibold">{text('Email','Barua pepe')}
          <Input ref={refs.email} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={email} onChange={e=>setEmail(e.target.value)} aria-invalid={badField==='email' || undefined} className={`mt-2 h-12 text-base ${bad('email')}`} />
        </label>
        {mode==='verify' && <label className="block text-sm font-semibold">{text('6-digit code','Msimbo wa tarakimu 6')}
          <Input ref={refs.code} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} aria-invalid={badField==='code' || undefined} className={`mt-2 h-12 text-center text-2xl tracking-[0.5em] ${bad('code')}`} />
        </label>}
        {mode!=='reset' && mode!=='verify' && <label className="block text-sm font-semibold">{text('Password','Nenosiri')}
          <Input ref={refs.password} type="password" autoComplete={mode==='signup'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} aria-invalid={badField==='password' || undefined} className={`mt-2 h-12 text-base ${bad('password')}`} />
          {mode==='signup' && <span className="mt-1 block text-xs font-normal text-muted-foreground">{text('At least 8 characters.','Angalau herufi 8.')}</span>}
        </label>}
        {mode==='signup' && <>
          <fieldset>
            <legend className="text-sm font-semibold">{text('Date of birth','Tarehe ya kuzaliwa')}</legend>
            <p className="text-xs text-muted-foreground">{text('You must be 18 or older.','Lazima uwe na miaka 18 au zaidi.')}</p>
            <BirthDateInput ref={refs.birth} value={birth} onChange={v=>{setBirth(v); if (badField==='birth') { setBadField(''); setError(''); }}} minAge={18} invalid={badField==='birth'} />
          </fieldset>
          {/* The whole row is tappable, and the box itself is larger than the browser default. */}
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${badField==='terms' ? 'border-destructive' : 'border-border'}`}>
            <input ref={refs.terms} type="checkbox" checked={accepted} onChange={e=>{setAccepted(e.target.checked); if (badField==='terms') { setBadField(''); setError(''); }}} className="mt-0.5 h-5 w-5 shrink-0 accent-primary" />
            <span>{text('I am 18 or older and accept the','Nina miaka 18 au zaidi na nakubali')} <DomainLink destination="site" to="/terms" className="underline text-primary">{text('terms','masharti')}</DomainLink> {text('and','na')} <DomainLink destination="site" to="/privacy" className="underline text-primary">{text('privacy policy','sera ya faragha')}</DomainLink>.</span>
          </label>
        </>}
        {/* Errors and confirmations sit right above the button, where the person is looking. */}
        {error && <div ref={alertRef} role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive">
          <p>{error}</p>
          {exists && <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={()=>switchMode('login')}>{text('Sign in with this email','Ingia kwa barua pepe hii')}</Button>
            <Button type="button" size="sm" variant="outline" onClick={()=>switchMode('reset')}>{text('Reset password','Badilisha nenosiri')}</Button>
          </div>}
        </div>}
        {message && <p role="status" className="rounded-lg bg-mint p-4 text-sm">{message}</p>}
        <Button type="submit" disabled={busy} className="h-12 w-full text-base"><Mail />{submitLabel}</Button>
      </form>
      {mode==='verify' && <div className="mt-4 flex justify-center"><Button variant="link" disabled={busy} onClick={()=>{void resendCode();}}>{text('Send a new code','Tuma msimbo mpya')}</Button></div>}
      {(mode==='login'||mode==='signup') && <div className="mt-5 space-y-3 border-t pt-5"><p className="text-xs text-muted-foreground">{text('Social sign-in requires adult registration before personal tools can be used.','Kuingia kupitia huduma nyingine kunahitaji usajili wa mtu mzima kabla ya kutumia zana binafsi.')}</p><Button variant="outline" className="h-12 w-full" disabled={busy} onClick={()=>social('google')}>{text('Continue with Google','Endelea kwa Google')}</Button></div>}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {mode==='verify'
          ? <Button variant="link" onClick={()=>switchMode('login')}>{text('Back to sign in','Rudi kuingia')}</Button>
          : <>
            <Button variant="link" onClick={()=>switchMode(mode==='signup'?'login':'signup')}>{text(mode==='signup'?'Already have an account? Sign in':'Create account',mode==='signup'?'Una akaunti? Ingia':'Fungua akaunti')}</Button>
            <Button variant="link" onClick={()=>switchMode(mode==='reset'?'login':'reset')}>{text(mode==='reset'?'Back to sign in':'Forgot password?',mode==='reset'?'Rudi kuingia':'Umesahau nenosiri?')}</Button>
          </>}
      </div>
    </>}
    <p className="mt-6 flex gap-2 text-xs text-muted-foreground"><LockKeyhole className="h-4 w-4 shrink-0" />{text('Adults 18+ only in this pilot. Education is open to guests.', 'Watu wazima 18+ pekee katika majaribio. Elimu iko wazi kwa wageni.')}</p>
  </div></AppShell>;
}