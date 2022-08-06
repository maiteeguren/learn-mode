import React, { useState } from 'react';
import './App.css';
import { BUNDLE_QUESTIONS } from '../../constants'
import { Button } from '@material-ui/core';
import { QuestionResponse, Question } from '../../index.types'
import Form from '../Form/index'

function App() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1)
  const currentQuestion: Question = BUNDLE_QUESTIONS.find(question => question.id === currentQuestionId) || BUNDLE_QUESTIONS[0]

  const [answersBundle, setAnswersBundle] = useState<QuestionResponse[]>([])
  const [start, setStart] = useState(false)
  const [error, setError] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)


  const learnModeAlgorithm = (bundle: QuestionResponse[]): number => {
    const remainingQuestions = BUNDLE_QUESTIONS.filter(question => {
      return bundle.filter(answer => answer.questionId === question.id && answer.isCorrect).length < 2
    })

    if (remainingQuestions.length === 0) {
      setFinished(true)
      return 0
    }
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length)
    return remainingQuestions[randomIndex].id
  }

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
      setAnswersBundle(newAnswersBundle)

      if (isCorrect) {
        displayNextQuestion(newAnswersBundle)
        e.target.value = ''
      } else {
        setError(true)
        setTimeout(() => setError(false), 1000)
      }
    }
  }

  const displayNextQuestion = (bundle = answersBundle) => {
    const nextId = learnModeAlgorithm(bundle)
    setCurrentQuestionId(nextId)
    setShowAnswer(false)
  }

  return (
    <div className="App">
      <header className={`modal ${start ? 'close' : ''}`}>
        <h1>Welcome to Learn Mode</h1>
        <p>A study session in learn mode is considered complete when a student has answered each question correctly at least twice.</p>
        <Button variant={'contained'} color={'primary'} onClick={() => {displayNextQuestion(); setStart(true)}} style={{ marginTop: 50 }}>Get Started</Button>
      </header>
      <div className={`modal ${(start && !finished) ? '' : 'close'}`}>
        <Form
          label={currentQuestion?.text}
          currentQuestion={currentQuestion}
          onKeyDown={(e) => handleKeyDown(e)}
          className={`${error ? 'error' : ''}`}
          showAnswer={showAnswer}
          onSetShowAnswer={setShowAnswer}
          onSkip={displayNextQuestion}
        />
      </div>
      <div className={`modal ${finished ? '' : 'close'}`}>
        <h2>Congratulations!</h2>
        <p>You have completed your study session</p>
      </div>
    </div>
  );
}

export default App;
