'use client';

import { useState, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import ResultSummary from '@/components/ResultSummary';
import { Question, UserAnswer } from '@/lib/types';
import { calculateScore } from '@/lib/utils';

// クライアントサイドでの問題データ取得のためのダミー関数
// 実際のデータはAPIルートから取得します
async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch('/api/questions');
  const data = await response.json();
  return data.questions;
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

  const handleAnswerSelected = (questionId: string, optionIds: string[]) => {
    const existingAnswerIndex = userAnswers.findIndex(
      (answer) => answer.questionId === questionId
    );

    let updatedAnswers: UserAnswer[];
    
    if (existingAnswerIndex !== -1) {
      updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = {
        questionId,
        selectedOptionIds: optionIds,
      };
    } else {
      updatedAnswers = [...userAnswers, { questionId, selectedOptionIds: optionIds }];
    }
    
    setUserAnswers(updatedAnswers);
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
    // 採点する
    const calculatedScore = calculateScore(questions, userAnswers);
    setScore(calculatedScore);
    setExamCompleted(true);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(
    (answer) => currentQuestion && answer.questionId === currentQuestion.id
  );
  
  // 実際に回答した問題の数をカウント
  const answeredQuestionsCount = questions.filter(q => 
    userAnswers.some(a => a.questionId === q.id)
  ).length;
  const allQuestionsAnswered = answeredQuestionsCount === questions.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl">問題を読み込んでいます...</div>
      </div>
    );
  }

  if (examCompleted) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8 text-center">AWS Certified AI Practitioner 模擬試験</h1>
        <ResultSummary 
          questions={questions} 
          userAnswers={userAnswers} 
          score={score} 
        />
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">解答と解説</h2>
          {questions.map((question, index) => {
            // 各問題に対する回答を探す
            const answer = userAnswers.find(a => a.questionId === question.id);
            
            return (
              <div key={question.id} className="mb-8">
                <div className="text-sm text-gray-500 mb-2">問題 {index + 1}</div>
                <QuestionCard
                  question={question}
                  userAnswer={answer}
                  onAnswerSelected={() => {}} // 結果表示時は選択できないようにする
                  showResults={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
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