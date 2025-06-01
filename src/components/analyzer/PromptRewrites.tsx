'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePromptAnalyzer } from '@/hooks/usePromptAnalyzer';

export function PromptRewrites({
  rewrites,
}: {
  rewrites: { beginner: string; engineer: string; precise: string };
}) {
  const { analyze, loading } = usePromptAnalyzer();

  const handleReanalyze = (prompt: string) => {
    if (loading) return;
    analyze(prompt);
    const el = document.getElementById('results');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="p-6 space-y-4 rounded-2xl bg-white/60 dark:bg-black/30 backdrop-blur-md shadow-xl">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        ✍️ Suggested Rewrites
      </h3>
      {Object.entries(rewrites).map(([type, text]) => (
        <div
          key={type}
          className="p-4 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">
              {type.replace('-', ' ')} Prompt
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReanalyze(text)}
              disabled={loading}
            >
              Re-analyze
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
            {text}
          </p>
        </div>
      ))}
    </Card>
  );
}
