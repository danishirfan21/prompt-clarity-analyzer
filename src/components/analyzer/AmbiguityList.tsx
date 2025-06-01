'use client';

import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

type Ambiguity = { term: string; reason: string };

export function AmbiguityList({ terms }: { terms: Ambiguity[] }) {
  if (!terms.length) return null;

  return (
    <Card className="p-6 bg-white/60 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <AlertTriangle className="text-orange-500" size={18} />
        Ambiguous Terms Detected
      </h3>
      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc pl-4">
        {terms.map((item, i) => (
          <li key={i}>
            <strong className="text-orange-600 dark:text-orange-400">
              {item.term}:
            </strong>{' '}
            {item.reason}
          </li>
        ))}
      </ul>
    </Card>
  );
}
