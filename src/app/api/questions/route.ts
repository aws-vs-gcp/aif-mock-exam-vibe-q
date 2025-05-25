import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Question, QuestionType } from '@/lib/types';

// マークダウンファイルから問題データを読み込む
function loadQuestions(): Question[] {
  try {
    const questionsDirectory = path.join(process.cwd(), 'src/data/questions');
    const filenames = fs.readdirSync(questionsDirectory);
    
    const questions = filenames.map(filename => {
      const filePath = path.join(questionsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // correctAnswersが配列でない場合は配列に変換
      let correctAnswers = data.correctAnswers || data.correctAnswer;
      if (!Array.isArray(correctAnswers)) {
        correctAnswers = [correctAnswers];
      }
      
      // Question インターフェースに合わせて修正
      return {
        id: filename.replace(/\.md$/, ''),
        title: data.title,
        content: content,
        options: data.options,
        correctAnswers: correctAnswers,
        explanation: data.explanation,
        type: data.type || QuestionType.SINGLE_CHOICE
      };
    });
    
    return questions;
  } catch (error) {
    console.error('Error loading questions:', error);
    // ダミーデータを返す
    return getDummyQuestions();
  }
}

// ダミーの問題データ
function getDummyQuestions(): Question[] {
  return [
    {
      id: 'question1',
      title: 'AWS SageMakerの主な機能',
      content: 'AWS SageMakerの主な目的は何ですか？',
      options: [
        { id: 'A', text: 'データベース管理とSQLクエリの実行' },
        { id: 'B', text: '機械学習モデルの構築、トレーニング、デプロイ' },
        { id: 'C', text: 'サーバーレスアプリケーションの開発とデプロイ' },
        { id: 'D', text: 'ブロックチェーンネットワークの作成と管理' }
      ],
      correctAnswers: ['B'],
      explanation: 'AWS SageMakerは、機械学習モデルの構築、トレーニング、デプロイのためのフルマネージドサービスです。',
      type: QuestionType.SINGLE_CHOICE
    },
    {
      id: 'question2',
      title: 'Amazon Rekognitionの機能',
      content: 'Amazon Rekognitionは主にどのような機能を提供するAIサービスですか？',
      options: [
        { id: 'A', text: 'テキスト翻訳と言語検出' },
        { id: 'B', text: '音声認識と文字起こし' },
        { id: 'C', text: '画像と動画の分析と認識' },
        { id: 'D', text: '自然言語処理と感情分析' }
      ],
      correctAnswers: ['C'],
      explanation: 'Amazon Rekognitionは、画像と動画の分析と認識のためのAIサービスです。',
      type: QuestionType.SINGLE_CHOICE
    }
  ];
}

// 問題をランダムに並び替える
function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET() {
  try {
    // 問題データを読み込む
    const questions = loadQuestions();
    
    // 問題をランダムに並び替える
    const shuffledQuestions = shuffleQuestions(questions);
    
    // 最初の10問だけを返す
    const limitedQuestions = shuffledQuestions.slice(0, 10);
    
    return NextResponse.json({ questions: limitedQuestions });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to load questions', questions: getDummyQuestions().slice(0, 10) },
      { status: 200 }
    );
  }
}