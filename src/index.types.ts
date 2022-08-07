export interface QuestionResponse {
  id: number;
  questionId: number;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  answer: string;
}

export interface FormProps {
  label: string,
  currentQuestion: Question,
  onSkip: () => void,
  showAnswer: boolean,
  onSetShowAnswer: React.Dispatch<React.SetStateAction<boolean>>,
  onSetAnswersBundle: React.Dispatch<React.SetStateAction<QuestionResponse[]>>,
  answersBundle: QuestionResponse[]
}