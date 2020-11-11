import { Button, TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMeet, loadShortCut } from '../Background/index';
import { setAuthToken, LOAD_MEET } from '../Background/actions';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  const dispatch = useDispatch();
  const meetLink = useSelector((state) => state.meetLink);
  const authToken = useSelector((state) => state.authToken);
  const isLoading = useSelector((state) => state.isLoading);
  const [meetTitle, setMeetTitle] = useState('Meeting');
  const [moreOptions, setMoreOptions] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', picture: '' });

  const createMeetOnShortcut = () => {
    window.chrome.runtime.onMessage.addListener(
      (message, sender, sendResponse) => {
        if (message.type === LOAD_MEET) {
          console.log(meetTitle, authToken);
          dispatch(createMeet({ meetTitle }));
        }
      }
    );
  };

  useEffect(() => {
    createMeetOnShortcut();

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      dispatch(setAuthToken(token));
      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
      )
        .then((res) => res.json())
        .then((info) => {
          setUserInfo(info);
        });
    });
  }, []);

  return (
    <div className="App">
      <header className="wrapper">
        <Tooltip title={userInfo.email} placement="right">
          <Avatar alt="Profile Pic" src={userInfo.picture} />
        </Tooltip>
        <TextField
          label="Title"
          type="input"
          value={meetTitle}
          className="form__title"
          onChange={(e) => setMeetTitle(e.target.value)}
          // className={classes.textField}
        />
        {moreOptions && (
          <>
            <TextField
              id="datetime-local"
              label="From"
              type="datetime-local"
              defaultValue="2017-05-24T10:30"
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="datetime-local"
              label="To"
              type="datetime-local"
              defaultValue="2018-05-24T10:30"
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </>
        )}
        <Button
          color="secondary"
          onClick={() => setMoreOptions((prev) => !prev)}
        >
          {!moreOptions ? 'More' : 'Less'} Options
        </Button>
        <Button
          color="primary"
          onClick={() => dispatch(createMeet({ meetTitle }))}
        >
          {isLoading ? <CircularProgress /> : 'Meet now'}
        </Button>
        <p className="form__meet-link">{meetLink}</p>
      </header>
    </div>
  );
};

export default Newtab;
