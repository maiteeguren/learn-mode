import React, { useState } from 'react';
import './App.css';
import { BUNDLE_QUESTIONS } from '../../constants'
import { Button } from '@material-ui/core';
import { QuestionResponse } from '../../index.types'
import Form from '../Form/index'

function App() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1)
  const currentQuestion = BUNDLE_QUESTIONS.find(question => question.id === currentQuestionId)

  const [answersBundle, setAnswersBundle] = useState<QuestionResponse[]>([])
  const [start, setStart] = useState(false)
  const [error, setError] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const getCorrectAnswers = (questionId: number) => {
    return answersBundle.filter(answer => answer.questionId === questionId && answer.isCorrect).length >= 2
  }
  
  const learnModeAlgorithm = () => {
    const remainingQuestions = BUNDLE_QUESTIONS.filter(question => !getCorrectAnswers(question.id))
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length)
    if (remainingQuestions.length === 0) {
      setFinished(true)
      return 0
    } else {
      return remainingQuestions[randomIndex].id
    }
  }

  const validateAnswer = (answer: string) => {
    const formatAnswer = answer.toLowerCase().replace(" ", "")
    const formatCurrentAnswer = currentQuestion?.answer.toLowerCase().replace(" ", "")
    return (formatAnswer === formatCurrentAnswer)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement
    if (e.key === 'Enter') {
      const isCorrect = validateAnswer(target.value)

      const answer: QuestionResponse = {
        id: answersBundle.length,
        questionId: currentQuestion.id,
        isCorrect
      }

      setAnswersBundle([...answersBundle, answer])

      if (isCorrect) {
        const nextId = learnModeAlgorithm()
        console.log('nextId', nextId)
        setCurrentQuestionId(nextId)
        setShowAnswer(false)
        e.target.value = ''
      } else {
        setError(true)
        setTimeout(() => setError(false), 1000)
      }
    }
  }

  const handleStart = () => {
    const randomIndex = Math.floor(Math.random() * BUNDLE_QUESTIONS.length)
    setCurrentQuestionId(BUNDLE_QUESTIONS[randomIndex].id)
    if (start) return
    setStart(true)
    setFinished(false)
  }

  return (
    <div className="App">
      <header className={`question-modal ${start ? 'close' : ''}`} style={{ textAlign: 'center' }}>
        <h1>Welcome to Learn Mode</h1>
        <p>A study session in learn mode is considered complete when a student has answered each question correctly at least twice.</p>
        <Button variant={'contained'} color={'primary'} onClick={handleStart} style={{ marginTop: 50 }}>Get Started</Button>
      </header>
      <div className={`question-modal ${(start && !finished) ? '' : 'close'}`}>
        <Form
          label={currentQuestion?.text || ''}
          currentQuestion={currentQuestion}
          onKeyDown={(e) => handleKeyDown(e)}
          className={`${error ? 'error' : ''}`}
          showAnswer={showAnswer}
          onSetShowAnswer={setShowAnswer}
          onSkip={handleStart}
        />
      </div>
      {finished && (
        <div className={`question-modal`} style={{ textAlign: 'center' }}>
          <h2>Congratulations!</h2>
          <p>You have completed your study session</p>
        </div>
      )}
    </div>
  );
}

export default App;
