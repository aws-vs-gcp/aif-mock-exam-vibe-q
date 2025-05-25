import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Question, UserAnswer } from './types';

// マークダウンファイルから問題データを読み込む
export function loadQuestions(): Question[] {
  const questionsDirectory = path.join(process.cwd(), 'src/data/questions');
  const filenames = fs.readdirSync(questionsDirectory);
  
  const questions = filenames.map(filename => {
    const filePath = path.join(questionsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      id: filename.replace(/\.md$/, ''),
      title: data.title,
      content: content,
      options: data.options,
      correctAnswer: data.correctAnswer,
      explanation: data.explanation
    };
  });
  
  return questions;
}

// 問題をランダムに並び替える
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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