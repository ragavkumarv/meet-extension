import { Button, TextField } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import React, { useState } from 'react';
import { goBack } from 'react-chrome-extension-router';

export default function DefaultOptions() {
  const [state, setstate] = useState(
    localStorage.getItem('DEFAULT_MEET_DURATION') || 30
  );
  return (
    <>
      <TextField
        label="Default duration"
        type="input"
        value={state}
        className="form__title"
        onChange={(e) => {
          setstate(e.target.value);
          localStorage.setItem('DEFAULT_MEET_DURATION', e.target.value);
        }}
      />

      <Button
        color="primary"
        onClick={goBack}
        startIcon={<KeyboardBackspaceIcon />}
      >
        Go Back
      </Button>
    </>
  );
}
