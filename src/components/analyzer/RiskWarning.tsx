'use client';

import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function RiskWarning({ text }: { text: string }) {
  return (
    <Card className="p-5 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-xl">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-yellow-500 mt-1" />
        <div>
          <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
            ⚠️ Risk if Used As-Is
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
            {text}
          </p>
        </div>
      </div>
    </Card>
  );
}
