import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Question, UserAnswer } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  userAnswer: UserAnswer | undefined;
  onAnswerSelected: (questionId: string, optionId: string) => void;
  showResults: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerSelected,
  showResults
}) => {
  const handleOptionClick = (optionId: string) => {
    if (!showResults) {
      onAnswerSelected(question.id, optionId);
    }
  };

  const getOptionClassName = (optionId: string) => {
    let className = 'option-button';
    
    if (showResults) {
      if (optionId === question.correctAnswer) {
        className += ' correct';
      } else if (userAnswer?.selectedOptionId === optionId && optionId !== question.correctAnswer) {
        className += ' incorrect';
      }
    } else if (userAnswer?.selectedOptionId === optionId) {
      className += ' selected';
    }
    
    return className;
  };

  return (
    <div className="question-card">
      <h3 className="text-xl font-semibold mb-4">{question.title}</h3>
      <div className="mb-6">
        <ReactMarkdown>{question.content}</ReactMarkdown>
      </div>
      
      <div className="options">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={getOptionClassName(option.id)}
            onClick={() => handleOptionClick(option.id)}
            disabled={showResults}
          >
            <span className="font-medium">{option.id}.</span> {option.text}
          </button>
        ))}
      </div>
      
      {showResults && (
        <div className="mt-6 p-4 bg-gray-50 rounded border-l-4 border-aws-orange">
          <h4 className="font-bold mb-2">解説:</h4>
          <ReactMarkdown>{question.explanation}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;