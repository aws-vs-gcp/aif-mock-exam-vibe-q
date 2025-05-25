import { Question, UserAnswer } from './types';

// 正答率を計算する
export function calculateScore(questions: Question[], userAnswers: UserAnswer[]): number {
  let correctCount = 0;
  
  userAnswers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedOptionId) {
      correctCount++;
    }
  });
  
  return correctCount;
}