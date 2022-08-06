export interface QuestionResponse {
  id: number;
  questionId: number;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface FormProps {
  label: string,
  currentQuestion: Question,
  onKeyDown: (e: any) => void,
  className: string,
  onSkip: () => void,
  showAnswer: boolean,
  onSetShowAnswer: (): boolean => void