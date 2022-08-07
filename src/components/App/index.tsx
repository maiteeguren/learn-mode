import React, { useState, useEffect } from 'react';
import './index.css';
import { BUNDLE_QUESTIONS } from '../../constants'
import { Button } from '@material-ui/core';
import { QuestionResponse, Question } from '../../index.types'
import Flashcard from '../Flashcard/index'

function App() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1)
  const currentQuestion: Question = BUNDLE_QUESTIONS.find(question => question.id === currentQuestionId) || BUNDLE_QUESTIONS[0]

  const [answersBundle, setAnswersBundle] = useState<QuestionResponse[]>([])
  const [start, setStart] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const generateRandomNumber = (limit: number): number => Math.floor(Math.random() * limit)

  useEffect(() => {
    displayNextQuestion()
  }, [answersBundle]);

  const learnModeAlgorithm = (skip = false): number => {
    // If the last submitted answer is correct, or if user wants to skip
    if (answersBundle[answersBundle.length - 1]?.isCorrect || skip) {
      const remainingQuestions = BUNDLE_QUESTIONS.filter(question => {
        return answersBundle.filter(answer => answer.questionId === question.id && answer.isCorrect).length < 2
      })
  
      if (remainingQuestions.length === 0) {
        setFinished(true)
        return currentQuestionId
      }

      let randomIndex = generateRandomNumber(remainingQuestions.length)
      let randomQuestionId = remainingQuestions[randomIndex].id
  
      // Check if the question was recently answered
      if (remainingQuestions.length > 2) {
        const latestQuestions = answersBundle.map(answer => answer.questionId).slice(-2)
        while (latestQuestions.includes(randomQuestionId)) {
          randomIndex = generateRandomNumber(remainingQuestions.length)
          randomQuestionId = remainingQuestions[randomIndex].id
        }
      }
      return randomQuestionId
    }
    // else, return current question
    return currentQuestionId
  }

  const displayNextQuestion = (skip = false) => {
    const nextId = learnModeAlgorithm(skip)
    setCurrentQuestionId(nextId)
    setShowAnswer(false)
  }

  return (
    <div className="App">
      <header className={`modal text-center ${start ? 'close' : ''}`}>
        <h1>Welcome to Learn Mode</h1>
        <p>A study session in learn mode is considered complete when a student has answered each question correctly at least twice.</p>
        <Button variant={'contained'} color={'primary'} onClick={() => {displayNextQuestion(); setStart(true)}} style={{ marginTop: 50 }}>Get Started</Button>
      </header>
      <div className={`modal ${(start && !finished) ? '' : 'close'}`}>
        <Flashcard
          label={currentQuestion?.text}
          currentQuestion={currentQuestion}
          showAnswer={showAnswer}
          onSetShowAnswer={setShowAnswer}
          onSkip={() => displayNextQuestion(true)}
          onSetAnswersBundle={setAnswersBundle}
          answersBundle={answersBundle}
        />
      </div>
      <div className={`modal text-center ${finished ? '' : 'close'}`}>
        <h2>Congratulations!</h2>
        <p>You have completed your study session</p>
      </div>
    </div>
  );
}

export default App;
