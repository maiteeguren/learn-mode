export interface QuestionResponse {
  id: number;
  questionId: number;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface FormProps {
  label: string,
  currentQuestion: Question,
  onKeyDown: () => void,
  className: string,
  onSkip: () => void,
  showAnswer: boolean,
  onSetShowAnswer: () => void
}