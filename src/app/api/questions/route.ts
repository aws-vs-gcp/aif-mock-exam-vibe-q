import { NextResponse } from 'next/server';
import { loadQuestions, shuffleQuestions } from '@/lib/utils';

export async function GET() {
  try {
    // 問題データを読み込む
    const questions = loadQuestions();
    
    // 問題をランダムに並び替える
    const shuffledQuestions = shuffleQuestions(questions);
    
    return NextResponse.json({ questions: shuffledQuestions });
  } catch (error) {
    console.error('Error loading questions:', error);
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    );
  }
}