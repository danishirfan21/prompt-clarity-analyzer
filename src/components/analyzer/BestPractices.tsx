'use client';

import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { CheckCircle } from 'lucide-react';

export function BestPractices({ practices }: { practices: string[] }) {
  return (
    <Card className="p-6 rounded-2xl bg-white/60 dark:bg-black/30 shadow-xl space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        ✅ Best Practices for Prompt Clarity
      </h3>
      <ul className="space-y-3">
        {practices.map((text, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-1" size={18} />
            <ReactMarkdown
              components={{
                p: ({ node, children }) => (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {children}
                  </p>
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </li>
        ))}
      </ul>
    </Card>
  );
}
