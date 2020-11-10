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
dayjs.extend(timezone);

const Newtab = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [meetLink, setMeetLink] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [meetTitle, setMeetTitle] = useState('Meeting');
  const [moreOptions, setMoreOptions] = useState(true);

  useEffect(() => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      setAuthToken(token);
    });
  }, []);

  const meetNow = () => {
    console.log('meetNow');
    console.log(authToken);
    setMeetLink('Loading...');
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
      <header>
        <form className="App-header" noValidate autoComplete="off" error>
          <FormControl>
            <InputLabel>Title</InputLabel>
            <Input
              id="component-error"
              value={meetTitle}
              onChange={(e) => setMeetTitle(e.target.value)}
              aria-describedby="component-error-text"
            />
          </FormControl>
        </form>
        <Button
          color="secondary"
          onClick={() => setMoreOptions((prev) => !prev)}
        >
          More Options
        </Button>
        {moreOptions && (
          <div>
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
          </div>
        )}
        <Button color="primary" onClick={meetNow}>
          Meet now
        </Button>
        <p>{meetLink || 'Start to Meet'}</p>
      </header>
    </div>
  );
};

export default Newtab;
