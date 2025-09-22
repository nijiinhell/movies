import { NextRequest, NextResponse } from 'next/server';
import { performAiSearch } from '@/lib/ai-matcher';

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const results = performAiSearch(prompt);
  return NextResponse.json({ prompt, results });
}
