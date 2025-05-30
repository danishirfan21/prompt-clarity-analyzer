'use client';

import ShellLayout from '@/components/layout/ShellLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { usePromptAnalyzer } from '@/hooks/usePromptAnalyzer';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import botAnimation from '@/assets/ai-bot.json';
import Image from 'next/image';
import robotHead from '@/assets/robot-head.png';

export default function PromptClarityAnalyzer() {
  const [prompt, setPrompt] = useState('');
  const { analyze, result, loading } = usePromptAnalyzer();

  const handleAnalyze = () => {
    if (prompt.trim()) {
      analyze(prompt);
    }
  };

  return (
    <ShellLayout>
      {/* Hero Glow Logo */}
      <div className="relative flex justify-center items-center h-32 mb-2 mt-6">
        <div className="absolute w-32 h-32 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full blur-2xl opacity-40 animate-pulse" />
        <Lottie
          animationData={botAnimation}
          loop
          autoplay
          className="w-24 h-24 relative z-10"
        />
      </div>

      <div className="space-y-6 max-w-2xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-center tracking-tight text-gray-900 dark:text-white">
          Prompt Clarity Analyzer
        </h1>

        <div className="space-y-4">
          <Textarea
            placeholder="Paste your AI agent prompt here..."
            className="min-h-[120px] animate-pulse placeholder:italic"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <Button
            onClick={handleAnalyze}
            disabled={loading || !prompt.trim()}
            className="w-full sm:w-fit transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-xl hover:scale-105 disabled:opacity-40"
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
          <Card>
            <CardContent className="space-y-4 py-6">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
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
                <div className="flex justify-center">
                  <Image
                    src={robotHead}
                    alt="Empty State Illustration"
                    width={64}
                    height={64}
                    className="opacity-80"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                  Welcome to Prompt Clarity Analyzer
                </h2>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Paste your prompt above and click{' '}
                  <span className="font-semibold text-primary">Analyze</span> to
                  get a clarity score, detect ambiguity, and receive improvement
                  suggestions — powered by GPT-4o.
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-red-500">
              <CardContent className="text-red-600 font-medium py-6 text-center">
                {result.error}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analysis Result */}
        {!loading && result && !result.error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-green-500">
              <CardContent className="space-y-4">
                <p className="text-green-700 font-semibold">
                  Analysis complete ✅
                </p>

                {result.clarityScore && (
                  <p>
                    <strong>Clarity Score:</strong> {result.clarityScore}/100
                  </p>
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
                    <ul className="list-disc ml-6">
                      {result.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </ShellLayout>
  );
}
