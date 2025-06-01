'use client';

import ShellLayout from '@/components/layout/ShellLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePromptAnalyzer } from '@/hooks/usePromptAnalyzer';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import aiAssistantAnimation from '@/assets/ai-assistant.json';
import { ClarityScoreCard } from '@/components/analyzer/ClarityScoreCard';
import { InterpretationsPanel } from '@/components/analyzer/InterpretationsPanel';
import { RiskWarning } from '@/components/analyzer/RiskWarning';
import { AmbiguityList } from '@/components/analyzer/AmbiguityList';


function TypingHeading({ text }: { text: string }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className="text-3xl font-bold text-center tracking-tight text-gray-900 dark:text-white">
      {display}
    </h1>
  );
}

function TypingEffect({ text }: { text: string }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <li>{display}</li>;
}

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border rounded-xl overflow-hidden bg-white/70 dark:bg-black/30">
      <div
        className="bg-gray-100 dark:bg-gray-800 cursor-pointer px-4 py-2 font-semibold text-sm"
        onClick={() => setOpen(!open)}
      >
        {title} {open ? '▾' : '▸'}
      </div>
      {open && <div className="px-4 py-2 space-y-2">{children}</div>}
    </div>
  );
}

export default function PromptClarityAnalyzer() {
  const [prompt, setPrompt] = useState('');
  const { analyze, result, loading } = usePromptAnalyzer();
  const [visiblePrompt, setVisiblePrompt] = useState('');

  const placeholderOptions = [
    'Rewrite this sales pitch to be more persuasive...',
    'Summarize this meeting transcript for internal docs...',
    'Convert this requirement into a dev-ready prompt...',
  ];
  const buttonTextOptions = [
    '✨ Clarify Prompt',
    '🧠 Analyze Prompt',
    '🔍 Run Check',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [ctaIndex, setCtaIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholderOptions.length);
      setCtaIndex((i) => (i + 1) % buttonTextOptions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = () => {
    if (prompt.trim()) {
      toast.message('Analyzing your prompt...');
      new Howl({ src: ['/sounds/ping.wav'], volume: 0.3 }).play();
      analyze(prompt);
      const el = document.getElementById('results');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function AnimatedBot() {
    return (
      <div className="w-40 mx-auto">
        <Lottie animationData={aiAssistantAnimation} loop={true} />
      </div>
    );
  }

  const handlePromptTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    new Howl({ src: ['/sounds/keystroke.mp3'], volume: 0.1 }).play();
    setVisiblePrompt(newText);
    setTimeout(() => {
      setPrompt(newText);
    }, 300);
  };

  useEffect(() => {
    if (result && !loading && !result.error) {
      // confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      const emojis = ['💡', '🧠', '🤖'];
      for (let i = 0; i < 30; i++) {
        const emoji = document.createElement('div');
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.className = 'absolute text-2xl animate-bounce-slow';
        document.body.appendChild(emoji);
      }

      new Howl({ src: ['/sounds/success.mp3'], volume: 0.3 }).play();
      toast.success('Analysis complete ✅');
    }
    if (result?.error) {
      toast.error('Something went wrong. Try again.');
    }
  }, [loading, result]);

  return (
    <ShellLayout>
      <div className="relative overflow-hidden">
        {/* Animated glowing blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          className="absolute top-[-60px] right-[-40px] w-72 h-72 bg-purple-300 opacity-30 blur-3xl rounded-full z-[-1]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 14 }}
          className="absolute bottom-[-60px] left-[-40px] w-80 h-80 bg-blue-200 opacity-30 blur-3xl rounded-full z-[-1]"
        />

        <div className="space-y-6 max-w-2xl mx-auto py-6">
          <TypingHeading text="Prompt Clarity Analyzer" />

          {/* Input */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden p-[2px] bg-gradient-to-br from-blue-300 to-pink-300 shadow-inner hover:shadow-xl transition-all duration-300">
              <Textarea
                placeholder={placeholderOptions[placeholderIndex]}
                className="min-h-[120px] bg-white/70 backdrop-blur-md text-gray-800 placeholder:text-gray-400 rounded-xl px-4 py-3 border-none focus:outline-none hover:ring-1 hover:ring-blue-400 transition-all"
                value={visiblePrompt}
                onChange={handlePromptTyping}
              />
            </div>

            {/* Feedback while analyzing */}
            {loading && (
              <div className="text-sm text-gray-500 italic animate-pulse text-center">
                🤖 Thinking... polishing your prompt.
              </div>
            )}

            {/* Button */}
            <Button
              onClick={handleAnalyze}
              disabled={loading || !prompt.trim()}
              className="group relative overflow-hidden w-full sm:w-fit px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 ease-in-out hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  buttonTextOptions[ctaIndex]
                )}
              </span>
              <span className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-10 transition" />
            </Button>
          </div>

          {/* Empty State */}
          {!loading && !result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Card className="bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl transition hover:shadow-2xl hover:scale-[1.01]">
                <CardContent className="text-center py-16 space-y-4">
                  <div className="relative flex justify-center items-center">
                    <div className="absolute w-24 h-24 rounded-full bg-purple-300 blur-3xl opacity-30 animate-ping"></div>
                    <AnimatedBot />
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    Welcome to Prompt Clarity Analyzer
                  </h2>
                  <p className="text-sm text-gray-500">
                    Feed me a prompt — I’ll make it crystal clear.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Error State */}
          {!loading && result?.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Card className="bg-red-50 border border-red-200 shadow-md rounded-xl">
                <CardContent className="text-center py-6">
                  <div className="text-3xl mb-2">😓</div>
                  <p className="text-lg font-semibold text-red-600">
                    Something went wrong
                  </p>
                  <p className="text-sm text-red-400 mt-1">
                    Try rephrasing the prompt or refreshing the page.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
          <div id="results" className="space-y-6 mt-10">
            {/* Result */}
            {!loading && result && !result.error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ClarityScoreCard score={result.clarityScore} />
                <InterpretationsPanel
                  junior={result.interpretations.junior}
                  engineer={result.interpretations.engineer}
                  lead={result.interpretations.lead}
                />
                <RiskWarning text={result.riskIfUsed} />
                <AmbiguityList terms={result.ambiguousTerms} />

                {/* <Card className="bg-white/20 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl">
                <CardContent className="space-y-6 p-6">
                  <p className="text-green-700 font-semibold">
                    Analysis complete ✅
                  </p>

                  {result.clarityScore && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold text-lg">
                        🧠 Clarity: {result.clarityScore}/100
                      </span>
                      {result.clarityScore >= 90 && (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full animate-bounce">
                          💎 Crystal Clear
                        </span>
                      )}
                    </div>
                  )}

                  {result.ambiguities?.length > 0 && (
                    <CollapsibleSection title="⚠️ Ambiguities">
                      <ul className="list-disc ml-6">
                        {result.ambiguities.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </CollapsibleSection>
                  )}

                  {result.suggestions?.length > 0 && (
                    <CollapsibleSection title="🛠️ Suggestions for Improvement">
                      <ul className="list-disc ml-6">
                        {result.suggestions.map((s, i) => (
                          <TypingEffect key={i} text={s} />
                        ))}
                      </ul>
                    </CollapsibleSection>
                  )}
                </CardContent>
              </Card> */}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
