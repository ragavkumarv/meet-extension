import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import { Button, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import './Newtab.css';
import './Newtab.scss';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

dayjs.extend(timezone);

const Newtab = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [meetLink, setMeetLink] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [meetTitle, setMeetTitle] = useState('Meeting');
  const [moreOptions, setMoreOptions] = useState(true);
  const [userInfo, setUserInfo] = useState({ email: '', picture: '' });

  useEffect(() => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      setAuthToken(token);

      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
      )
        .then((res) => res.json())
        .then((info) => {
          setUserInfo(info);
        });
    });
  }, []);

  const meetNow = () => {
    console.log('meetNow');
    console.log(authToken);

    setMeetLink('Loading');
    const event = {
      summary: meetTitle || '(No Title)',
      start: {
        dateTime: dayjs().toISOString(),
        timeZone: dayjs.tz.guess(),
      },
      end: {
        dateTime: dayjs().add(30, 'minutes').toISOString(),
        timeZone: dayjs.tz.guess(),
      },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
        },
      },
    };

    fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendNotifications=true',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )
      .then((response) => response.json())
      .then(function (data) {
        console.log(data);
        setMeetLink(data.hangoutLink);
      });
  };

  const schedule = () => {
    console.log('schedule');
    console.log(authToken);
    const event = {
      summary: 'Scheduled Meeting',
      start: {
        dateTime: dayjs().toISOString(),
        timeZone: dayjs.tz.guess(),
      },
      end: {
        dateTime: dayjs().add(30, 'minutes').toISOString(),
        timeZone: dayjs.tz.guess(),
      },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
        },
      },
    };

    fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendNotifications=true',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )
      .then((response) => response.json())
      .then(function (data) {
        console.log(data);
        setMeetLink(data.hangoutLink);
      });

    // const validate = () => {
    //   let temp = {};
    //   temp.title = values.title ? '' : ''
    // }
  };

  return (
    <div className="App">
      <header className="wrapper">
        {/* <form className="App-header" noValidate autoComplete="off" error>
          <FormControl>
            <InputLabel>Title</InputLabel>
            <Input
              id="component-error"
              value={meetTitle}
              onChange={(e) => setMeetTitle(e.target.value)}
              aria-describedby="component-error-text"
            />
          </FormControl>
        </form> */}
        {/* <Avatar alt="Remy Sharp" src={userInfo.picture} /> */}
        <Tooltip title={userInfo.email} placement="right">
          <Avatar
            alt="Remy Sharp"
            src={userInfo.picture}
            // src={userInfo.picture}
          />
        </Tooltip>
        {/* <img src={userInfo.picture} alt="user pic" /> */}
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
          {moreOptions ? 'More' : 'Less'} Options
        </Button>
        <Button color="primary" onClick={meetNow}>
          {meetLink === 'Loading' ? <CircularProgress /> : 'Meet now'}
        </Button>
        {/* <p className="form__meet-link">{meetLink || 'Start to Meet'}</p> */}
        <p className="form__meet-link">
          {meetLink !== 'Loading' ? meetLink : ''}
        </p>
      </header>
    </div>
  );
};

export default Newtab;
