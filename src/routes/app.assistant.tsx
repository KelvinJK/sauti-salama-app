import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppText } from '@/lib/app-copy';
import { appSeo as seo } from '@/lib/seo';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import { articles } from '@/lib/content';
import { pregnancyWeeks } from '@/lib/pregnancy-content';

export const Route = createFileRoute('/app/assistant')({ staticData: { sitemap: false }, head: () => seo('Private health questions', 'Prepare health questions privately and browse educational information.'), component: Assistant });

function Assistant(){ 
  const text = useAppText(); 
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  function ask() {
    const q = question.toLowerCase();
    setIsEmergency(false);
    let response = text('This is educational information only, not diagnosis or treatment. Please speak with a health worker for personal advice.','Hii ni taarifa ya elimu tu, si utambuzi wala matibabu. Tafadhali ongea na mhudumu wa afya kwa ushauri binafsi.');

    // Emergency check
    const emergencyWords = ['emergency', 'dharura', 'bleeding heavily', 'damu nyingi', 'severe pain', 'maumivu makali', 'can\'t breathe', 'siwezi kupumua', 'unconscious', 'amezimia'];
    if (emergencyWords.some(w => q.includes(w))) {
      setIsEmergency(true);
      response = text('⚠️ This sounds urgent. Go to the nearest health facility or call emergency services immediately. Do not wait.','⚠️ Hii inaonekana dharura. Nenda kituo cha afya kilicho karibu au piga simu za dharura mara moja. Usisubiri.');
      setAnswer(response);
      return;
    }

    // Match articles
    let matched = false;
    for (const a of articles) {
      const keywords = [a.slug.replace(/-/g, ' '), ...a.title.en.toLowerCase().split(' '), ...a.title.sw.toLowerCase().split(' ')];
      if (keywords.some(k => q.includes(k) && k.length > 3)) {
        response += '\n\n**' + a.title.en + '**\n' + a.summary.en + '\n' + a.body.en.join('\n');
        matched = true;
        break;
      }
    }

    // Match pregnancy weeks
    if (!matched) {
      for (const w of pregnancyWeeks) {
        if (q.includes(`week ${w.week}`) || q.includes(`wiki ${w.week}`) || q.includes(w.title.en.toLowerCase().split(':')[0] ?? w.title.en.toLowerCase())) {
          response += '\n\n**' + w.title.en + '**\n' + w.summary.en + '\nTips: ' + w.tips.en.join('; ');
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      response += '\n\n' + text('I can help with general information about menstrual health, pregnancy, antenatal care, breastfeeding, nutrition, and family planning. Try asking about a specific topic.','Ninaweza kusaidia na taarifa za jumla kuhusu afya ya hedhi, ujauzito, kliniki ya wajawazito, kunyonyesha, lishe, na uzazi wa mpango. Jaribu kuuliza kuhusu mada maalum.');
    }

    setAnswer(response);
  }

  return <>
    <PageTitle title={text('Private assistant','Msaidizi binafsi')} sub={text('Ask health questions privately. Answers are educational only.','Uliza maswali ya afya kwa faragha. Majibu ni ya elimu tu.')} />
    <div className="mb-4 flex items-start gap-3">
      <MessageCircle className="mt-1 h-5 w-5 text-primary" />
      <p className="text-sm text-muted-foreground">{text('Your questions stay on this device. Nothing is sent to a server.','Maswali yako yanabaki kwenye kifaa hiki. Hakuna kinachotumwa kwenye seva.')}</p>
    </div>
    <Textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder={text('e.g. What happens in week 12 of pregnancy? or Antenatal care visits','mf. Kinachotokea wiki 12 ya ujauzito? au Kliniki ya wajawazito')} rows={3} className="mb-3" />
    <Button onClick={ask} disabled={!question.trim()}>{text('Ask privately','Uliza kwa faragha')}</Button>
    {answer && (
      <div className={`mt-6 rounded-lg border p-5 ${isEmergency ? 'border-destructive bg-destructive/5' : 'bg-card'}`}>
        {isEmergency && <AlertTriangle className="mb-2 h-5 w-5 text-destructive" />}
        <p className="whitespace-pre-wrap text-sm">{answer}</p>
      </div>
    )}
    <p className="mt-6 text-xs text-muted-foreground">{text('Always consult a qualified health worker for decisions about your health. In an emergency, go to the nearest facility.','Daima wasiliana na mhudumu wa afya aliyehitimu kwa maamuzi kuhusu afya yako. Katika dharura, nenda kituo kilicho karibu.')}</p>
  </>;
}
