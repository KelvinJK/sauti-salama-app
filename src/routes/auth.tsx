import { DomainLink } from '@/components/DomainLink';
import { useEffect, useState, type FormEvent } from 'react';
import { oauthReturnPath } from '@/lib/oauth-return-path';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Mail, LockKeyhole, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppText } from '@/lib/app-copy';
import { useAppAuth } from '@/components/app/AuthProvider';
import { isAdult } from '@/lib/app-model';
import { AppShell, PageTitle } from '@/components/app/AppShell';
import { appSeo as seo } from '@/lib/seo';
export const Route = createFileRoute('/auth')({ staticData: { sitemap: false }, validateSearch: (s: Record<string, unknown>): { next?: string } => typeof s['next'] === 'string' ? { next: s['next'] } : {}, head: () => seo('Sign in or create an account', 'Secure Sauti Salama accounts for adults aged 18 and older.'), component: Auth });
function Auth() {
  const text = useAppText(); const navigate = useNavigate(); const { user } = useAppAuth();
  const { next: rawNext } = Route.useSearch();
  const next = rawNext ? oauthReturnPath(rawNext) : '';
  const returnUrl = () => next && next !== '/' ? new URL(`/auth?next=${encodeURIComponent(next)}`, window.location.origin).href : `${window.location.origin}/auth`;
  const goOn = async () => { if (next && next !== '/') { window.location.href = next; return; } await navigate({to:'/app/profile'}); };
  useEffect(() => { if (user && next && next !== '/') window.location.href = next; }, [user, next]);
  const [mode, setMode] = useState<'login'|'signup'|'reset'|'verify'>('login');
  const [email,setEmail]=useState(''), [password,setPassword]=useState(''), [birth,setBirth]=useState(''), [code,setCode]=useState('');
  const [accepted,setAccepted]=useState(false), [busy,setBusy]=useState(false), [message,setMessage]=useState(''), [error,setError]=useState('');
  const codeSent = () => { setCode(''); setMode('verify'); setMessage(text(`We sent a 6-digit code to ${email}. Enter it below to confirm your email.`, `Tumetuma msimbo wa tarakimu 6 kwa ${email}. Uweke hapa chini kuthibitisha barua pepe yako.`)); };
  async function resendCode() {
    setError(''); setBusy(true);
    try { const {error}=await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo:returnUrl()}}); if(error) throw error; codeSent(); }
    catch { setError(text('Could not send a new code. Wait a minute and try again.', 'Imeshindikana kutuma msimbo mpya. Subiri dakika moja ujaribu tena.')); }
    finally { setBusy(false); }
  }
  async function submit(e: FormEvent) {
    e.preventDefault(); setMessage(''); setError('');
    if(mode==='signup' && (!isAdult(birth) || !accepted)) { setError(text('You must be 18 or older and accept the terms.', 'Lazima uwe na miaka 18 au zaidi na ukubali masharti.')); return; }
    setBusy(true);
    try {
      if(mode==='reset') { const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`}); if(error) throw error; setMessage(text('If this email has an account, a reset link has been sent.', 'Ikiwa barua pepe hii ina akaunti, kiungo cha kubadili nenosiri kimetumwa.')); }
      else if(mode==='verify') {
        const {error}=await supabase.auth.verifyOtp({email,token:code.trim(),type:'email'});
        if(error) { setError(text('That code is not valid or has expired. Check it or send a new one.', 'Msimbo huo si sahihi au umeisha muda. Hakiki au tuma mpya.')); return; }
        await goOn();
      }
      else if(mode==='signup') { const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:returnUrl()}}); if(error) throw error; if(data.session) await goOn(); else codeSent(); }
      else {
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error?.code==='email_not_confirmed') { await resendCode(); return; }
        if(error) throw error; await goOn();
      }
    } catch { setError(text('Unable to continue. Check your details and try again.', 'Imeshindikana kuendelea. Hakiki taarifa zako ujaribu tena.')); }
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
  return <AppShell><div className="mx-auto max-w-md"><PageTitle title={text(mode==='signup'?'Create your account':mode==='reset'?'Reset your password':mode==='verify'?'Confirm your email':'Welcome back',mode==='signup'?'Fungua akaunti':mode==='reset'?'Badilisha nenosiri':mode==='verify'?'Thibitisha barua pepe':'Karibu tena')} sub={text('Your health information stays private.', 'Taarifa zako za afya ni binafsi.')} />{user ? <div className="space-y-4"><p>{text('You are signed in.', 'Umeingia.')}</p><Button asChild><Link to="/app/profile">{text('Go to my profile','Nenda kwenye wasifu')}<ArrowRight /></Link></Button></div> : <><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-semibold">{text('Email','Barua pepe')}<Input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 h-12" /></label>{mode==='verify' && <label className="block text-sm font-semibold">{text('6-digit code','Msimbo wa tarakimu 6')}<Input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} className="mt-2 h-12 text-center text-2xl tracking-[0.5em]" /></label>}{mode!=='reset' && mode!=='verify' && <label className="block text-sm font-semibold">{text('Password','Nenosiri')}<Input type="password" autoComplete={mode==='signup'?'new-password':'current-password'} minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 h-12" /></label>}{mode==='signup' && <><label className="block text-sm font-semibold">{text('Date of birth (18+)','Tarehe ya kuzaliwa (18+)')}<Input type="date" required value={birth} onChange={e=>setBirth(e.target.value)} className="mt-2 h-12" /></label><label className="flex items-start gap-3 text-sm"><input type="checkbox" required checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1" /><span>{text('I am 18 or older and accept the','Nina miaka 18 au zaidi na nakubali')} <DomainLink destination="site" to="/terms" className="underline text-primary">{text('terms','masharti')}</DomainLink> {text('and','na')} <DomainLink destination="site" to="/privacy" className="underline text-primary">{text('privacy policy','sera ya faragha')}</DomainLink>.</span></label></>}<Button type="submit" disabled={busy} className="h-12 w-full"><Mail />{text(busy?'Please wait…':mode==='signup'?'Create account':mode==='reset'?'Send reset link':mode==='verify'?'Verify and continue':'Sign in',busy?'Subiri…':mode==='signup'?'Fungua akaunti':mode==='reset'?'Tuma kiungo':mode==='verify'?'Thibitisha na uendelee':'Ingia')}</Button></form>{mode==='verify' && <div className="mt-4 flex justify-center"><Button variant="link" disabled={busy} onClick={()=>{void resendCode();}}>{text('Send a new code','Tuma msimbo mpya')}</Button></div>}{(mode==='login'||mode==='signup') && <div className="mt-5 space-y-3 border-t pt-5"><p className="text-xs text-muted-foreground">{text('Social sign-in requires adult registration before personal tools can be used.','Kuingia kupitia huduma nyingine kunahitaji usajili wa mtu mzima kabla ya kutumia zana binafsi.')}</p><Button variant="outline" className="h-12 w-full" disabled={busy} onClick={()=>social('google')}>{text('Continue with Google','Endelea kwa Google')}</Button></div>}<div className="mt-5 flex flex-wrap justify-center gap-2">{mode==='verify' ? <Button variant="link" onClick={()=>{setMode('login');setError('');setMessage('');}}>{text('Back to sign in','Rudi kuingia')}</Button> : <><Button variant="link" onClick={()=>{setMode(mode==='signup'?'login':'signup');setError('');setMessage('');}}>{text(mode==='signup'?'Already have an account? Sign in':'Create account',mode==='signup'?'Una akaunti? Ingia':'Fungua akaunti')}</Button><Button variant="link" onClick={()=>{setMode(mode==='reset'?'login':'reset');setError('');setMessage('');}}>{text(mode==='reset'?'Back to sign in':'Forgot password?',mode==='reset'?'Rudi kuingia':'Umesahau nenosiri?')}</Button></>}</div></>}{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}{message && <p role="status" className="mt-4 rounded-lg bg-mint p-4 text-sm">{message}</p>}<p className="mt-6 flex gap-2 text-xs text-muted-foreground"><LockKeyhole className="h-4 w-4 shrink-0" />{text('Adults 18+ only in this pilot. Education is open to guests.', 'Watu wazima 18+ pekee katika majaribio. Elimu iko wazi kwa wageni.')}</p></div></AppShell>;
}