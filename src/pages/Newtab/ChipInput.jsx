import { TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.2),
    },
  },
}));

const ChipInput = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    items: [],
    value: '',
    error: null,
  });

  const handleKeyDown = (evt) => {
    if (['Enter', 'Tab', ','].includes(evt.key)) {
      evt.preventDefault();

      const value = state.value.trim();

      if (value && isValid(value)) {
        setState({
          ...state,
          items: [...state.items, state.value],
          value: '',
        });
      }
    }
  };

  const handleChange = (evt) => {
    setState({
      ...state,
      value: evt.target.value,
      error: null,
    });
  };

  const handleDelete = (item) => {
    setState({ ...state, items: state.items.filter((i) => i !== item) });
  };

  const handlePaste = (evt) => {
    evt.preventDefault();

    const paste = evt.clipboardData.getData('text');
    const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      const toBeAdded = emails.filter((email) => !isInList(email));

      setState({
        ...state,
        items: [...state.items, ...toBeAdded],
      });
    }
  };

  const isValid = (email) => {
    let error = null;
    if (isInList(email)) {
      error = `${email} has already been added.`;
    }
    if (!isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }
    if (error) {
      setState({ ...state, error });
      return false;
    }
    return true;
  };

  const isInList = (email) => {
    return state.items.includes(email);
  };

  const isEmail = (email) => {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  };

  return (
    <>
      <TextField
        className="form__add-guest"
        value={state.value}
        error={!!state.error}
        label="Guests"
        placeholder="Type or paste email addresses"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onPaste={handlePaste}
        helperText={state.error}
      />

      <div className="form__add-guest">
        <div className={classes.root}>
          {state.items.map((item) => (
            <div className="tag-item" key={item}>
              <Chip
                color="primary"
                variant="outlined"
                avatar={<Avatar>{item[0].toUpperCase()}</Avatar>}
                label={item}
                onDelete={() => handleDelete(item)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChipInput;
