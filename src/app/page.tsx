'use client';

import ShellLayout from '@/components/layout/ShellLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function PromptClarityAnalyzer() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzePrompt = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ error: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShellLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Prompt Clarity Analyzer
        </h1>

        <Textarea
          placeholder="Paste your AI agent prompt here..."
          className="min-h-[120px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button onClick={analyzePrompt} disabled={loading || !prompt.trim()}>
          {loading ? <Loader2 className="animate-spin" /> : 'Analyze'}
        </Button>

        {result && (
          <Card>
            <CardContent className="space-y-4">
              {result.error && <p className="text-red-500">{result.error}</p>}
              {result.clarityScore && (
                <p>
                  <strong>Clarity Score:</strong> {result.clarityScore}/100
                </p>
              )}
              {result.ambiguities && (
                <div>
                  <strong>Ambiguities:</strong>
                  <ul className="list-disc ml-6">
                    {result.ambiguities.map((a: string, i: number) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.suggestions && (
                <div>
                  <strong>Suggestions for Improvement:</strong>
                  <ul className="list-disc ml-6">
                    {result.suggestions.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ShellLayout>
  );
}
