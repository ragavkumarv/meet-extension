import { Button, TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMeet, loadShortCut } from '../Background/index';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  const dispatch = useDispatch();
  const meetLink = useSelector((state) => state.meetLink);
  const authToken = useSelector((state) => state.authToken);
  const [meetTitle, setMeetTitle] = useState('Meeting');
  const [moreOptions, setMoreOptions] = useState(true);
  const [userInfo, setUserInfo] = useState({ email: '', picture: '' });

  useEffect(() => {
    window.chrome.runtime.onMessage.addListener(
      (message, sender, sendResponse) => {
        if (message.type === 'LOAD_MEET') {
          console.log(meetTitle, authToken);
          dispatch(loadMeet({ meetTitle }));
        }
      }
    );

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      dispatch({ type: 'SET_AUTH_TOKEN', payload: token });
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
          <Avatar alt="Remy Sharp" src={userInfo.picture} />
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
          onClick={() => dispatch(loadMeet({ meetTitle }))}
        >
          {meetLink === 'Loading' ? <CircularProgress /> : 'Meet now'}
        </Button>
        {/* <p className="form__meet-link">{meetLink || 'Start to Meet'}</p> */}
        <p className="form__meet-link">{meetLink}</p>
      </header>
    </div>
  );
};

export default Newtab;
