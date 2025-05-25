import React from 'react';
import Link from 'next/link';
import { Question, UserAnswer } from '@/lib/types';

interface ResultSummaryProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  score: number;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ questions, userAnswers, score }) => {
  const percentage = Math.round((score / questions.length) * 100);
  
  const getResultMessage = () => {
    if (percentage >= 90) {
      return '素晴らしい結果です！本番試験に向けて十分な準備ができています。';
    } else if (percentage >= 70) {
      return '良い結果です。もう少し復習して本番試験に臨みましょう。';
    } else if (percentage >= 50) {
      return '基本的な理解はできていますが、さらなる学習が必要です。';
    } else {
      return 'より多くの学習が必要です。基本概念から復習しましょう。';
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">試験結果</h2>
      
      <div className="text-center mb-8">
        <div className="text-5xl font-bold mb-2 text-aws-orange">{score} / {questions.length}</div>
        <div className="text-2xl font-semibold">{percentage}%</div>
        <p className="mt-4 text-lg">{getResultMessage()}</p>
      </div>
      
      <div className="flex justify-center mt-8 space-x-4">
        <Link href="/" className="aws-button-secondary">
          ホームに戻る
        </Link>
        <Link href="/exam" className="aws-button">
          もう一度挑戦する
        </Link>
      </div>
    </div>
  );
};

export default ResultSummary;