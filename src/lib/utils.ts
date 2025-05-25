import { Question, UserAnswer, QuestionType } from './types';

// 正答率を計算する
export function calculateScore(questions: Question[], userAnswers: UserAnswer[]): number {
  let correctCount = 0;
  
  userAnswers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    // 単一選択問題の場合
    if (question.type === QuestionType.SINGLE_CHOICE) {
      if (
        answer.selectedOptionIds.length === 1 && 
        question.correctAnswers.includes(answer.selectedOptionIds[0])
      ) {
        correctCount++;
      }
    } 
    // 複数選択問題の場合
    else if (question.type === QuestionType.MULTIPLE_CHOICE) {
      // 選択した回答と正解が完全に一致する場合のみ正解
      const selectedSet = new Set(answer.selectedOptionIds);
      const correctSet = new Set(question.correctAnswers);
      
      if (
        selectedSet.size === correctSet.size && 
        [...selectedSet].every(id => correctSet.has(id))
      ) {
        correctCount++;
      }
    }
  });
  
  return correctCount;
}

// 問題が正解かどうかを判定する
export function isAnswerCorrect(question: Question, selectedOptionIds: string[]): boolean {
  if (question.type === QuestionType.SINGLE_CHOICE) {
    return (
      selectedOptionIds.length === 1 && 
      question.correctAnswers.includes(selectedOptionIds[0])
    );
  } else {
    const selectedSet = new Set(selectedOptionIds);
    const correctSet = new Set(question.correctAnswers);
    
    return (
      selectedSet.size === correctSet.size && 
      [...selectedSet].every(id => correctSet.has(id))
    );
  }
}