import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt, context } = await req.json();

  const schemaString = context
    ? `APP CONTEXT (available to agent):\n${context}\n\n`
    : '';

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are an AI assistant evaluating the clarity of a user instruction intended for an AI-powered QA automation agent. The agent may or may not have access to app context (screens, routes, element IDs). Your job is to simulate how three QA personas interpret the prompt, detect ambiguity, and recommend improvements.`,
    },
    {
      role: 'user',
      content: `${schemaString}USER PROMPT: ${prompt}

TASKS:
1. Simulate 3 QA personas interpreting this prompt:
   - Junior QA Tester
   - Automation Engineer
   - Senior QA Lead

   Each persona should include:
   - What they think the steps are
   - What assumptions they make
   - What they consider success

2. Analyze if there is divergence in their understanding. If yes, explain where.

3. Assign a Clarity Score from 0–100:
   - 100 = Clear and specific, no assumptions
   - 80–99 = Mostly clear but minor gaps
   - 60–79 = Some ambiguity
   - <60 = Major vagueness or misalignment

4. Highlight ambiguous or underdefined terms in the original prompt, even if the context helps resolve them.

5. Rewrite the prompt in 3 clearer ways:
   - Beginner-friendly
   - QA Engineer-level
   - High-precision automation prompt

6. List 3 best practices for writing clearer QA prompts.

7. Bonus: Mention what could go wrong if this prompt is used as-is (e.g. silent failures, skipped validations).

Output format:
{
  "clarityScore": number,
  "interpretations": { "junior": string, "engineer": string, "lead": string },
  "divergenceAnalysis": string,
  "ambiguousTerms": [ { "term": string, "reason": string } ],
  "rewrites": { "beginner": string, "engineer": string, "precise": string },
  "bestPractices": string[],
  "riskIfUsed": string
}
`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.2,
    });

    const response = completion.choices[0].message?.content;
    return NextResponse.json(JSON.parse(response || '{}'));
  } catch (error) {
    console.error('[OPENAI_ERROR]', error);
    return NextResponse.json({ error: 'Failed to analyze prompt.' }, { status: 500 });
  }
}
