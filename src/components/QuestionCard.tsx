import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Question, UserAnswer, QuestionType } from '@/lib/types';
import { isAnswerCorrect } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  userAnswer: UserAnswer | undefined;
  onAnswerSelected: (questionId: string, optionIds: string[]) => void;
  showResults: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerSelected,
  showResults
}) => {
  const isMultipleChoice = question.type === QuestionType.MULTIPLE_CHOICE;
  const selectedOptionIds = userAnswer?.selectedOptionIds || [];

  const handleOptionClick = (optionId: string) => {
    if (showResults) return;

    let newSelectedOptionIds: string[];

    if (isMultipleChoice) {
      // 複数選択問題の場合
      if (selectedOptionIds.includes(optionId)) {
        // すでに選択されている場合は選択を解除
        newSelectedOptionIds = selectedOptionIds.filter(id => id !== optionId);
      } else {
        // 選択されていない場合は、すでに2つ選択されていなければ追加
        if (selectedOptionIds.length < 2) {
          newSelectedOptionIds = [...selectedOptionIds, optionId];
        } else {
          // すでに2つ選択されている場合は何もしない
          return;
        }
      }
    } else {
      // 単一選択問題の場合は選択肢を置き換え
      newSelectedOptionIds = [optionId];
    }

    onAnswerSelected(question.id, newSelectedOptionIds);
  };

  const getOptionClassName = (optionId: string) => {
    let className = 'option-button';
    
    if (showResults) {
      if (question.correctAnswers.includes(optionId)) {
        className += ' correct';
      } else if (selectedOptionIds.includes(optionId)) {
        className += ' incorrect';
      }
    } else if (selectedOptionIds.includes(optionId)) {
      className += ' selected';
    }
    
    // 複数選択問題で、すでに2つ選択されていて、この選択肢が選択されていない場合は無効化
    if (isMultipleChoice && selectedOptionIds.length >= 2 && !selectedOptionIds.includes(optionId) && !showResults) {
      className += ' opacity-50 cursor-not-allowed';
    }
    
    return className;
  };

  return (
    <div className="question-card">
      <h3 className="text-xl font-semibold mb-4">{question.title}</h3>
      
      <div className="mb-2 text-sm font-medium text-gray-600">
        {isMultipleChoice ? '複数選択問題（正解を2つ選択）' : '単一選択問題（正解を1つ選択）'}
      </div>
      
      <div className="mb-6">
        <ReactMarkdown>{question.content}</ReactMarkdown>
      </div>
      
      <div className="options">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={getOptionClassName(option.id)}
            onClick={() => handleOptionClick(option.id)}
            disabled={showResults || (isMultipleChoice && selectedOptionIds.length >= 2 && !selectedOptionIds.includes(option.id))}
          >
            <span className="font-medium">{option.id}.</span> {option.text}
          </button>
        ))}
      </div>
      
      {isMultipleChoice && !showResults && (
        <div className="mt-2 text-sm text-gray-500">
          選択中: {selectedOptionIds.length}/2
        </div>
      )}
      
      {showResults && (
        <div className="mt-6 p-4 bg-gray-50 rounded border-l-4 border-aws-orange">
          <div className="mb-2">
            <span className="font-bold">正解: </span>
            {question.correctAnswers.join(', ')}
          </div>
          <h4 className="font-bold mb-2">解説:</h4>
          <ReactMarkdown>{question.explanation}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;