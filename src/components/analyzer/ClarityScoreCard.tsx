'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export function ClarityScoreCard({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedScore((prev) => {
        if (prev < score) return prev + 1;
        clearInterval(interval);
        return score;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [score]);

  const getLabel = () => {
    if (score >= 90) return 'Crystal Clear';
    if (score >= 75) return 'Mostly Clear';
    if (score >= 50) return 'Needs Refinement';
    return 'Ambiguous';
  };

  const getGradient = () => {
    if (score >= 90) return 'from-green-400 to-emerald-500';
    if (score >= 75) return 'from-yellow-400 to-orange-500';
    if (score >= 50) return 'from-orange-400 to-rose-500';
    return 'from-red-400 to-pink-600';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedScore((prev) => {
        if (prev < score) return prev + 1;
        clearInterval(interval);
        return score;
      });
    }, 10);

    if (score >= 85) {
      import('canvas-confetti').then((confetti) =>
        confetti.default({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        })
      );
    }

    return () => clearInterval(interval);
  }, [score]);
  

  return (
    <Card className="relative overflow-hidden bg-white/60 dark:bg-black/30 border-none shadow-xl p-6 rounded-2xl backdrop-blur-sm">
      {score > 90 && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute w-full h-full animate-pulse-slow bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px] opacity-10 blur-sm" />
        </div>
      )}

      {/* Glowing Ring */}
      <div className="flex justify-center items-center relative">
        <div className="w-40 h-40 relative">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGradient()} opacity-30 blur-2xl animate-pulse`}
          />
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="10"
              fill="none"
              stroke="#e5e7eb"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              stroke="url(#grad)"
              strokeDasharray={283}
              strokeDashoffset={283 - (animatedScore / 100) * 283}
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (score / 100) * 283 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">
                {animatedScore}
                <span className="text-lg text-gray-500 dark:text-gray-400">
                  {' '}
                  / 100
                </span>
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1 tracking-wide">
                {getLabel()}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Based on multi-perspective interpretation & divergence analysis
        </p>
      </div>
    </Card>
  );
}
