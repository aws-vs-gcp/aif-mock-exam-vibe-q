export interface Question {
  id: string;
  title: string;
  content: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface ExamResult {
  userAnswers: UserAnswer[];
  score: number;
  totalQuestions: number;
}