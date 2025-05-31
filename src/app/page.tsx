'use client';

import ShellLayout from '@/components/layout/ShellLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePromptAnalyzer } from '@/hooks/usePromptAnalyzer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import robotHead from '@/assets/robot-head.png';  
import confetti from 'canvas-confetti';
import { Howl } from 'howler';


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
      setDisplay((prev) => text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [text]);

  return <li>{display}</li>;
}


export default function PromptClarityAnalyzer() {
  const [prompt, setPrompt] = useState('');
  const { analyze, result, loading } = usePromptAnalyzer();
  const [visiblePrompt, setVisiblePrompt] = useState(''); // this is shown in the UI

  const handleAnalyze = () => {
    if (prompt.trim()) {
      const ping = new Howl({
        src: ['/sounds/ping.wav'],
        volume: 0.3,
      });
      ping.play();

      analyze(prompt);
    }
  };

  const handlePromptTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    // 1. Play keystroke sound
    const key = new Howl({
      src: ['/sounds/keystroke.mp3'],
      volume: 0.1,
    });
    key.play();

    // 2. Smooth delayed typing buffer
    setVisiblePrompt(newText); // shows in textarea
    setTimeout(() => {
      setPrompt(newText); // updates the "actual" input used for analysis
    }, 300); // adjust delay as needed
  };
  

  useEffect(() => {
    if (result && !loading && !result.error) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      const successSound = new Howl({
        src: ['/sounds/success.mp3'],
        volume: 0.3,
      });
      successSound.play(); // 🔊 reward sound
    }
  }, [loading, result]);

  const playHoverSound = () => {
    const hover = new Howl({
      src: ['/sounds/hover.mp3'],
      volume: 0.15,
    });
    hover.play();
  };

  return (
    <ShellLayout>
      {/* Hero Glow Logo */}
      <div className="relative overflow-hidden">
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

          <div className="space-y-4">
            <div className="p-[1px] rounded-xl bg-gradient-to-br from-purple-400/50 to-pink-400/50">
              <Textarea
                placeholder="Paste your AI agent prompt here..."
                className="min-h-[120px] bg-white/70 backdrop-blur-md text-gray-700 placeholder:italic w-full p-4 rounded-xl border-none outline-none"
                value={visiblePrompt}
                onChange={handlePromptTyping}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              onMouseEnter={playHoverSound}
              disabled={loading || !prompt.trim()}
              className="relative overflow-hidden w-full sm:w-fit px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-br from-blue-500 to-purple-600 hover:from-purple-500 hover:to-pink-500 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out before:absolute before:inset-0 before:bg-white/20 before:blur-lg before:opacity-0 hover:before:opacity-10"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </Button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="text-center text-sm text-gray-500 italic animate-pulse">
              🤖 Thinking about your prompt...
            </div>
          )}

          {/* Empty state */}
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
                    <div className="absolute w-20 h-20 rounded-full bg-purple-300 blur-3xl opacity-20 animate-ping"></div>
                    <Image
                      src={robotHead}
                      alt="Robot"
                      width={64}
                      height={64}
                      className="z-10 opacity-90"
                    />
                  </div>

                  <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                    Welcome to Prompt Clarity Analyzer
                  </h2>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    🧠 Nothing analyzed yet
                  </h2>
                  <p className="text-sm text-gray-500">
                    Feed me a prompt — I’ll make it crystal clear.
                  </p>
                </CardContent>
              </Card>

              {/* Animated background bubble */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 10 }}
                className="absolute top-[-40px] right-[-40px] w-72 h-72 bg-indigo-100 rounded-full opacity-30 blur-3xl z-[-1]"
              />
            </motion.div>
          )}

          {/* Error */}
          {!loading && result?.error && (
            <Card className="bg-red-50 border-red-300 shadow-sm">
              <CardContent className="text-red-700 font-medium py-6 text-center space-y-2">
                <p>🚨 Something went wrong.</p>
                <p className="text-sm text-red-500">
                  Try rephrasing the prompt or refreshing the page.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Analysis Result */}
          {!loading && result && !result.error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-muted-foreground italic px-1">
                <TypingEffect text="Analyzing structure, clarity, and ambiguity..." />
              </p>

              <Card className="bg-white/20 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl">
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-green-700 font-semibold">
                      Analysis complete ✅
                    </p>
                    {result.clarityScore >= 90 && (
                      <div className="text-2xl animate-pulse">🤖🎉</div>
                    )}
                    {result.clarityScore < 90 && (
                      <div className="text-2xl animate-pulse">🤖🧐</div>
                    )}
                  </div>

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
                    <div>
                      <strong>Ambiguities:</strong>
                      <ul className="list-disc ml-6">
                        {result.ambiguities.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.suggestions?.length > 0 && (
                    <div>
                      <strong>Suggestions for Improvement:</strong>
                      <ul className="list-disc ml-6 space-y-1">
                        {result.suggestions.map((s, i) => (
                          <TypingEffect key={i} text={s} />
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </ShellLayout>
  );
}
