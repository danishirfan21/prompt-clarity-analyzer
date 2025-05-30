import { useState } from 'react';

export interface PromptAnalysisResult {
  clarityScore?: number;
  ambiguities?: string[];
  suggestions?: string[];
  error?: string;
}

export function usePromptAnalyzer() {
  const [result, setResult] = useState<PromptAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (prompt: string) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return { analyze, result, loading };
}
