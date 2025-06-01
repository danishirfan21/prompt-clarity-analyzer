'use client';

import * as Tooltip from '@radix-ui/react-tooltip';

export function HoverableAmbiguousPrompt({
  originalPrompt,
  ambiguousTerms,
}: {
  originalPrompt: string,
  ambiguousTerms: { term: string, reason: string }[],
}) {
  const highlight = (text: string) => {
    let result = text;
    ambiguousTerms.forEach(({ term, reason }) => {
      const pattern = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(
        pattern,
        `<span class="relative group cursor-help text-orange-600 dark:text-orange-400 underline decoration-dotted">${term}<span class="absolute z-50 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow top-full mt-1">${reason}</span></span>`
      );
    });
    return result;
  };

  return (
    <div
      className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlight(originalPrompt) }}
    />
  );
}
