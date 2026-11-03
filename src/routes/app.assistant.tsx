import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppText } from '@/lib/app-copy';
import { appSeo as seo } from '@/lib/seo';
import { MessageCircle } from 'lucide-react';
import { articles } from '@/lib/content';

export const Route = createFileRoute('/app/assistant')({ staticData: { sitemap: false }, head: () => seo('Private health questions', 'Prepare health questions privately and browse educational information.'), component: Assistant });

function Assistant(){ 
  const text = useAppText(); 
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  function ask() {
    const q = question.toLowerCase();
    let response = text('This is educational information only, not diagnosis or treatment. Please speak with a health worker for personal advice.','Hii ni taarifa ya elimu tu, si utambuzi wala matibabu. Tafadhali ongea na mhudumu wa afya kwa ushauri binafsi.');
    for (const a of articles) {
      if (q.includes(a.slug.split('-')[0]) || a.title.en.toLowerCase().split(' ').some(w => q.includes(w))) {
        response += '\n\n' + a.summary.en + '\n' + a.body.en.join(' ');
        break;
      }
    }
    if (q.includes('emergency') || q.includes('dharura') || q.includes('bleeding') || q.includes('damu nyingi')) {
      response = text('If you have heavy bleeding, severe pain, or other danger signs, go to the nearest health facility immediately.','Ikiwa una damu nyingi, maumivu makali, au dalili nyingine za hatari, nenda kituo cha afya kilicho karibu mara moja.');
    }
    setAnswer(response);
  }

  return <>
    <PageTitle title={text('Private assistant','Msaidizi binafsi')} sub={text('Ask health questions privately. Answers are educational only.','Uliza maswali ya afya kwa faragha. Majibu ni ya elimu tu.')} />
    <div className="mb-4 flex items-start gap-3">
      <MessageCircle className="mt-1 h-5 w-5 text-primary" />
      <p className="text-sm text-muted-foreground">{text('Your questions stay on this device. Nothing is sent to a server.','Maswali yako yanabaki kwenye kifaa hiki. Hakuna kinachotumwa kwenye seva.')}</p>
    </div>
    <Textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder={text('Type your question...','Andika swali lako...')} rows={3} className="mb-3" />
    <Button onClick={ask} disabled={!question.trim()}>{text('Ask privately','Uliza kwa faragha')}</Button>
    {answer && <div className="mt-6 rounded-lg border bg-card p-5"><p className="whitespace-pre-wrap text-sm">{answer}</p></div>}
    <p className="mt-6 text-xs text-muted-foreground">{text('Always consult a qualified health worker for decisions about your health.','Daima wasiliana na mhudumu wa afya aliyehitimu kwa maamuzi kuhusu afya yako.')}</p>
  </>;
}
