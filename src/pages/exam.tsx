import { useState, useEffect } from 'react';
import Head from 'next/head';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import ResultSummary from '@/components/ResultSummary';
import { Question, UserAnswer } from '@/lib/types';
import { calculateScore } from '@/lib/utils';

// クライアントサイドでの問題データ取得
async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch('/api/questions');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    // デモ用のダミーデータを返す
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
}

export default function ExamPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswerSelected = (questionId: string, optionId: string) => {
    const existingAnswerIndex = userAnswers.findIndex(
      (answer) => answer.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = {
        questionId,
        selectedOptionId: optionId,
      };
      setUserAnswers(updatedAnswers);
    } else {
      setUserAnswers([...userAnswers, { questionId, selectedOptionId: optionId }]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    const calculatedScore = calculateScore(questions, userAnswers);
    setScore(calculatedScore);
    setExamCompleted(true);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(
    (answer) => currentQuestion && answer.questionId === currentQuestion.id
  );
  const answeredQuestionsCount = userAnswers.length;
  const allQuestionsAnswered = answeredQuestionsCount === questions.length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-xl">問題を読み込んでいます...</div>
        </div>
      </div>
    );
  }

  if (examCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Head>
          <title>結果 | AWS Certified AI Practitioner 模擬試験</title>
        </Head>
        <h1 className="text-3xl font-bold mb-8 text-center">AWS Certified AI Practitioner 模擬試験</h1>
        <ResultSummary 
          questions={questions} 
          userAnswers={userAnswers} 
          score={score} 
        />
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">解答と解説</h2>
          {questions.map((question, index) => (
            <div key={question.id} className="mb-8">
              <div className="text-sm text-gray-500 mb-2">問題 {index + 1}</div>
              <QuestionCard
                question={question}
                userAnswer={userAnswers.find(a => a.questionId === question.id)}
                onAnswerSelected={handleAnswerSelected}
                showResults={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Head>
        <title>試験中 | AWS Certified AI Practitioner 模擬試験</title>
      </Head>
      <h1 className="text-3xl font-bold mb-8 text-center">AWS Certified AI Practitioner 模擬試験</h1>
      
      <ProgressBar current={answeredQuestionsCount} total={questions.length} />
      
      {currentQuestion && (
        <div className="mb-4 text-sm text-gray-500">
          問題 {currentQuestionIndex + 1} / {questions.length}
        </div>
      )}
      
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          userAnswer={currentAnswer}
          onAnswerSelected={handleAnswerSelected}
          showResults={false}
        />
      )}
      
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`aws-button-secondary ${
            currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          前の問題
        </button>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            className="aws-button"
          >
            次の問題
          </button>
        ) : (
          <button
            onClick={handleSubmitExam}
            disabled={!allQuestionsAnswered}
            className={`aws-button ${
              !allQuestionsAnswered ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            採点する
          </button>
        )}
      </div>
      
      {!allQuestionsAnswered && currentQuestionIndex === questions.length - 1 && (
        <div className="mt-4 text-amber-600 text-sm">
          すべての問題に解答してから採点してください。
          {questions.length - answeredQuestionsCount}問が未回答です。
        </div>
      )}
    </div>
  );
}