import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import { Button } from '@material-ui/core';
import './Newtab.css';
import './Newtab.scss';
import dayjs from 'dayjs';

const Newtab = () => {
  const [dateTime, setDateTime] = useState(new Date());
  let authToken;

  useEffect(() => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      console.log(token);
      authToken = token;
    });
  }, []);

  const meetNow = () => {
    console.log('meetNow');
    const event = {
      summary: 'Meeting',
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
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <Button color="primary" onClick={meetNow}>
            Meet now
          </Button>
          <Button color="secondary">Schedule</Button>
        </div>
      </header>
    </div>
  );
};

export default Newtab;
