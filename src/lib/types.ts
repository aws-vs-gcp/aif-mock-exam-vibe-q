export interface Question {
  id: string;
  title: string;
  content: string;
  options: Option[];
  correctAnswers: string[]; // 複数の正解に対応するため配列に変更
  explanation: string;
  type: QuestionType; // 問題タイプを追加
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE', // 単一選択問題
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE' // 複数選択問題
}

export interface Option {
  id: string;
  text: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[]; // 複数選択に対応するため配列に変更
}

export interface ExamResult {
  userAnswers: UserAnswer[];
  score: number;
  totalQuestions: number;
}