import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Question, UserAnswer, QuestionType } from '@/lib/types';
import { isAnswerCorrect, calculateScore } from '@/lib/utils';

interface ResultSummaryProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  score: number;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ questions, userAnswers, score }) => {
  // utils.tsの共通関数を使用してスコアを計算
  const actualScore = calculateScore(questions, userAnswers);
  const percentage = Math.round((actualScore / questions.length) * 100);
  
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

  // 問題タイプ別の正解数を計算
  const singleChoiceQuestions = questions.filter(q => q.type === QuestionType.SINGLE_CHOICE);
  const multipleChoiceQuestions = questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE);
  
  const singleChoiceCorrect = singleChoiceQuestions.filter(question => {
    const answer = userAnswers.find(a => a.questionId === question.id);
    return answer && isAnswerCorrect(question, answer.selectedOptionIds);
  }).length;
  
  const multipleChoiceCorrect = multipleChoiceQuestions.filter(question => {
    const answer = userAnswers.find(a => a.questionId === question.id);
    return answer && isAnswerCorrect(question, answer.selectedOptionIds);
  }).length;
  
  const handleRetry = () => {
    // ページをリロードして新しい問題セットを取得
    window.location.reload();
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">試験結果</h2>
      
      <div className="text-center mb-8">
        <div className="text-5xl font-bold mb-2 text-aws-orange">{actualScore} / {questions.length}</div>
        <div className="text-2xl font-semibold">{percentage}%</div>
        <p className="mt-4 text-lg">{getResultMessage()}</p>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">単一選択問題</h3>
          <p>{singleChoiceCorrect} / {singleChoiceQuestions.length} 正解</p>
          <p className="text-sm text-gray-600">
            ({Math.round((singleChoiceCorrect / (singleChoiceQuestions.length || 1)) * 100)}%)
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">複数選択問題</h3>
          <p>{multipleChoiceCorrect} / {multipleChoiceQuestions.length} 正解</p>
          <p className="text-sm text-gray-600">
            ({Math.round((multipleChoiceCorrect / (multipleChoiceQuestions.length || 1)) * 100)}%)
          </p>
        </div>
      </div>
      
      <div className="flex justify-center mt-8 space-x-4">
        <Link href="/" className="aws-button-secondary">
          ホームに戻る
        </Link>
        <button onClick={handleRetry} className="aws-button">
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
};

export default ResultSummary;