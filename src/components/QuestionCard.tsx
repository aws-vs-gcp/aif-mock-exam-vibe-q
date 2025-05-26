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
      if (selectedOptionIds.includes(optionId)) {
        // 選択済みの場合は選択解除
        newSelectedOptionIds = selectedOptionIds.filter(id => id !== optionId);
      } else if (selectedOptionIds.length < 2) {
        // 未選択かつ2つ未満の選択がある場合は追加
        newSelectedOptionIds = [...selectedOptionIds, optionId];
      } else {
        // 既に2つ選択されている場合は何もしない
        return;
      }
    } else {
      // 単一選択問題の場合
      newSelectedOptionIds = [optionId];
    }

    onAnswerSelected(question.id, newSelectedOptionIds);
  };

  const getOptionClassName = (optionId: string) => {
    const baseClass = 'option-button';
    const classes = [baseClass];
    
    if (showResults) {
      // 結果表示モードの場合
      if (question.correctAnswers.includes(optionId)) {
        classes.push('correct');
      } else if (selectedOptionIds.includes(optionId)) {
        classes.push('incorrect');
      }
    } else if (selectedOptionIds.includes(optionId)) {
      // 通常モードで選択されている場合
      classes.push('selected');
    }
    
    // 複数選択問題で選択上限に達している場合の無効化スタイル
    if (isMultipleChoice && 
        selectedOptionIds.length >= 2 && 
        !selectedOptionIds.includes(optionId) && 
        !showResults) {
      classes.push('opacity-50 cursor-not-allowed');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="question-card">
      {/* 出題画面ではタイトルを表示しない */}
      {showResults && (
        <h3 className="text-xl font-semibold mb-4">{question.title}</h3>
      )}
      
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
          <div className="mb-2">
            <span className="font-bold">あなたの回答: </span>
            {selectedOptionIds.length > 0 ? selectedOptionIds.join(', ') : '未回答'}
          </div>
          <h4 className="font-bold mb-2">解説:</h4>
          <ReactMarkdown>{question.explanation}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;