import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Question } from '@/lib/types';

// マークダウンファイルから問題データを読み込む
function loadQuestions(): Question[] {
  try {
    const questionsDirectory = path.join(process.cwd(), 'src/data/questions');
    const filenames = fs.readdirSync(questionsDirectory);
    
    const questions = filenames.map(filename => {
      const filePath = path.join(questionsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        id: filename.replace(/\.md$/, ''),
        title: data.title,
        content: content,
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation
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
      correctAnswer: 'B',
      explanation: 'AWS SageMakerは、機械学習モデルの構築、トレーニング、デプロイのためのフルマネージドサービスです。'
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
      correctAnswer: 'C',
      explanation: 'Amazon Rekognitionは、画像と動画の分析と認識のためのAIサービスです。'
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
    
    return NextResponse.json({ questions: shuffledQuestions });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to load questions', questions: getDummyQuestions() },
      { status: 200 }
    );
  }
}