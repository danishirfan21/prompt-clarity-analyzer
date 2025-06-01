'use client';

import { Card } from '@/components/ui/card';

export function InterpretationsPanel({
  junior,
  engineer,
  lead,
}: {
  junior: string;
  engineer: string;
  lead: string;
}) {
  const personas = [
    { title: 'Junior QA Tester', content: junior },
    { title: 'Automation Engineer', content: engineer },
    { title: 'Senior QA Lead', content: lead },
  ];

  return (
    <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-black/30 rounded-2xl shadow-xl space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        🧠 Prompt Interpretations
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {personas.map((p) => (
          <div
            key={p.title}
            className="bg-white/80 dark:bg-black/40 p-4 rounded-xl shadow-inner"
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {p.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {p.content}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
