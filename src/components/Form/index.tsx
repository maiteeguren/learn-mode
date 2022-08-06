import React from 'react';
import {Button, TextField} from '@material-ui/core';
import { FormProps } from '../../index.types'

function Form({ label, currentQuestion, onKeyDown, className, onSkip, showAnswer, onSetShowAnswer }: FormProps) {
  return (
    <>
      <TextField
        id="standard-basic"
        label={label}
        helperText={showAnswer ? currentQuestion?.answer : ''}
        variant="standard"
        fullWidth
        onKeyDown={onKeyDown}
        className={className}
      />
      <div style={{ paddingTop: 50, display: 'flex', justifyContent: 'space-between'}}>
        <Button color={'primary'} onClick={() => onSetShowAnswer(true)}>Show Answer</Button>
        <Button variant={'contained'} color={'primary'} onClick={onSkip}>Skip</Button>
      </div>
    </>
  );
}

export default Form;
