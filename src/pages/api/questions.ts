import { NextApiRequest, NextApiResponse } from 'next';
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
      
      return {
        id: filename.replace(/\.md$/, ''),
        title: data.title,
        content: content,
        options: data.options,
        correctAnswers: data.correctAnswers,
        explanation: data.explanation,
        type: data.type
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
  // 単一選択問題（4問）
  const singleChoiceQuestions: Question[] = [
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
    },
    {
      id: 'question3',
      title: 'Amazon Bedrockの特徴',
      content: 'Amazon Bedrockは何を提供するAWSサービスですか？',
      options: [
        { id: 'A', text: 'クラウドネイティブデータベースサービス' },
        { id: 'B', text: 'フルマネージド型の生成AIサービス' },
        { id: 'C', text: 'サーバーレスコンピューティングプラットフォーム' },
        { id: 'D', text: 'コンテナオーケストレーションサービス' }
      ],
      correctAnswers: ['B'],
      explanation: 'Amazon Bedrockは、複数のプロバイダーの基盤モデル（FM）にアクセスできるフルマネージド型の生成AIサービスです。',
      type: QuestionType.SINGLE_CHOICE
    },
    {
      id: 'question4',
      title: 'Amazon Translateの主な用途',
      content: 'Amazon Translateサービスの主な用途は何ですか？',
      options: [
        { id: 'A', text: '画像内のテキスト認識' },
        { id: 'B', text: '音声からテキストへの変換' },
        { id: 'C', text: '複数言語間のテキスト翻訳' },
        { id: 'D', text: 'テキストからの感情分析' }
      ],
      correctAnswers: ['C'],
      explanation: 'Amazon Translateは、高品質で費用対効果の高い言語翻訳サービスで、複数言語間のテキスト翻訳を提供します。',
      type: QuestionType.SINGLE_CHOICE
    }
  ];

  // 複数選択問題（6問）
  const multipleChoiceQuestions: Question[] = [
    {
      id: 'question5',
      title: 'Amazon AIサービスの特徴',
      content: 'Amazon AIサービスの特徴として正しいものを2つ選んでください。',
      options: [
        { id: 'A', text: 'すべてのAIサービスは独自のモデルをトレーニングする必要がある' },
        { id: 'B', text: '事前トレーニング済みのモデルを使用できる' },
        { id: 'C', text: 'APIを通じて簡単に利用できる' },
        { id: 'D', text: 'すべてのサービスはオンプレミスでのみ利用可能' }
      ],
      correctAnswers: ['B', 'C'],
      explanation: 'Amazon AIサービスは、事前トレーニング済みのモデルを提供し、APIを通じて簡単に利用できるという特徴があります。',
      type: QuestionType.MULTIPLE_CHOICE
    },
    {
      id: 'question6',
      title: 'Amazon Comprehendの機能',
      content: 'Amazon Comprehendが提供する機能として正しいものを2つ選んでください。',
      options: [
        { id: 'A', text: '感情分析' },
        { id: 'B', text: '画像認識' },
        { id: 'C', text: 'エンティティ抽出' },
        { id: 'D', text: '音声合成' }
      ],
      correctAnswers: ['A', 'C'],
      explanation: 'Amazon Comprehendは、自然言語処理（NLP）サービスで、感情分析とエンティティ抽出などの機能を提供します。',
      type: QuestionType.MULTIPLE_CHOICE
    },
    {
      id: 'question7',
      title: 'AWS AIサービスの責任共有モデル',
      content: 'AWS AIサービスの責任共有モデルについて正しい説明を2つ選んでください。',
      options: [
        { id: 'A', text: 'AWSはインフラストラクチャのセキュリティを担当する' },
        { id: 'B', text: '顧客はデータの品質と整合性に責任を持つ' },
        { id: 'C', text: 'AWSがすべてのセキュリティ責任を負う' },
        { id: 'D', text: '顧客はハードウェアの保守に責任を持つ' }
      ],
      correctAnswers: ['A', 'B'],
      explanation: 'AWS責任共有モデルでは、AWSがインフラストラクチャのセキュリティを担当し、顧客はデータの品質と整合性に責任を持ちます。',
      type: QuestionType.MULTIPLE_CHOICE
    },
    {
      id: 'question8',
      title: 'Amazon Lexの主な用途',
      content: 'Amazon Lexの主な用途として正しいものを2つ選んでください。',
      options: [
        { id: 'A', text: 'チャットボットの構築' },
        { id: 'B', text: '画像認識システムの開発' },
        { id: 'C', text: '会話型インターフェースの作成' },
        { id: 'D', text: 'ドキュメントからのデータ抽出' }
      ],
      correctAnswers: ['A', 'C'],
      explanation: 'Amazon Lexは、チャットボットや会話型インターフェースを構築するためのサービスです。',
      type: QuestionType.MULTIPLE_CHOICE
    },
    {
      id: 'question9',
      title: 'Amazon Pollyの機能',
      content: 'Amazon Pollyの機能として正しいものを2つ選んでください。',
      options: [
        { id: 'A', text: 'テキストを自然な音声に変換する' },
        { id: 'B', text: '画像内のテキストを認識する' },
        { id: 'C', text: '複数の言語とアクセントをサポートする' },
        { id: 'D', text: '音声からテキストへの変換を行う' }
      ],
      correctAnswers: ['A', 'C'],
      explanation: 'Amazon Pollyは、テキストを自然な音声に変換するサービスで、複数の言語とアクセントをサポートしています。',
      type: QuestionType.MULTIPLE_CHOICE
    },
    {
      id: 'question10',
      title: 'Amazon Textractの主な機能',
      content: 'Amazon Textractの主な機能として正しいものを2つ選んでください。',
      options: [
        { id: 'A', text: 'ドキュメントからテキストを抽出する' },
        { id: 'B', text: '音声を認識して文字に変換する' },
        { id: 'C', text: 'フォームやテーブルからデータを抽出する' },
        { id: 'D', text: 'テキストを複数の言語に翻訳する' }
      ],
      correctAnswers: ['A', 'C'],
      explanation: 'Amazon Textractは、ドキュメントからテキストを抽出し、フォームやテーブルからデータを抽出するサービスです。',
      type: QuestionType.MULTIPLE_CHOICE
    }
  ];

  return [...singleChoiceQuestions, ...multipleChoiceQuestions];
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // 問題データを読み込む
      const questions = loadQuestions();
      
      // 問題をランダムに並び替える
      const shuffledQuestions = shuffleQuestions(questions);
      
      res.status(200).json({ questions: shuffledQuestions });
    } catch (error) {
      console.error('Error in API handler:', error);
      res.status(200).json({ 
        questions: getDummyQuestions(),
        error: 'Failed to load questions, using dummy data'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}