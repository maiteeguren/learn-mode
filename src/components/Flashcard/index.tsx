import React, {useState} from 'react';
import { Button, TextField } from '@material-ui/core';
import { FormProps, QuestionResponse } from '../../index.types'

function Flashcard({ label, currentQuestion, onSkip, showAnswer, onSetShowAnswer, onSetAnswersBundle, answersBundle }: FormProps) {
  const [error, setError] = useState(false)

  const validateAnswer = (answer: string): boolean => {
    const formatAnswer = answer.toLowerCase().replace(" ", "")
    const formatCurrentAnswer = currentQuestion?.answer.toLowerCase().replace(" ", "")
    return (formatAnswer === formatCurrentAnswer)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter') {
      const isCorrect = validateAnswer(e.target.value)

      const answer: QuestionResponse = {
        id: answersBundle.length,
        questionId: currentQuestion.id,
        isCorrect
      }

      const newAnswersBundle = [...answersBundle, answer]
      onSetAnswersBundle(newAnswersBundle)

      if (isCorrect) {
        e.target.value = ''
      } else {
        setError(true)
        setTimeout(() => setError(false), 1000)
      }
    }
  }

  return (
    <>
      <TextField
        id="standard-basic"
        label={label}
        helperText={showAnswer ? currentQuestion?.answer : ''}
        variant="standard"
        fullWidth
        onKeyDown={(e) => handleKeyDown(e)}
        className={`${error ? 'error' : ''}`}
        />
      <div style={{ paddingTop: 50, display: 'flex', justifyContent: 'space-between'}}>
        <Button color={'primary'} onClick={() => onSetShowAnswer(true)}>Show Answer</Button>
        <Button variant={'contained'} color={'primary'} onClick={onSkip}>Skip</Button>
      </div>
    </>
  );
}

export default Flashcard;
