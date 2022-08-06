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

  const generateRandomNumber = (limit: number): number => Math.floor(Math.random() * limit)

  const learnModeAlgorithm = (bundle: QuestionResponse[]): number => {
    const remainingQuestions = BUNDLE_QUESTIONS.filter(question => {
      return bundle.filter(answer => answer.questionId === question.id && answer.isCorrect).length < 2
    })

    if (remainingQuestions.length === 0) {
      setFinished(true)
      return 0
    }
    let randomIndex = generateRandomNumber(remainingQuestions.length)
    let randomQuestionId = remainingQuestions[randomIndex].id

    // Check if the question was recently answered
    if (remainingQuestions.length > 2) {
      const latestQuestions = bundle.map(answer => answer.questionId).slice(-2)
      while (latestQuestions.includes(randomQuestionId)) {
        randomIndex = generateRandomNumber(remainingQuestions.length)
        randomQuestionId = remainingQuestions[randomIndex].id
      }
    }
    return randomQuestionId
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

  const displayNextQuestion = (bundle: QuestionResponse[]) => {
    const nextId = learnModeAlgorithm(bundle)
    setCurrentQuestionId(nextId)
    setShowAnswer(false)
  }

  return (
    <div className="App">
      <header className={`modal ${start ? 'close' : ''}`}>
        <h1>Welcome to Learn Mode</h1>
        <p>A study session in learn mode is considered complete when a student has answered each question correctly at least twice.</p>
        <Button variant={'contained'} color={'primary'} onClick={() => {displayNextQuestion(answersBundle); setStart(true)}} style={{ marginTop: 50 }}>Get Started</Button>
      </header>
      <div className={`modal ${(start && !finished) ? '' : 'close'}`}>
        <Form
          label={currentQuestion?.text}
          currentQuestion={currentQuestion}
          onKeyDown={(e) => handleKeyDown(e)}
          className={`${error ? 'error' : ''}`}
          showAnswer={showAnswer}
          onSetShowAnswer={setShowAnswer}
          onSkip={() => displayNextQuestion(answersBundle)}
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
