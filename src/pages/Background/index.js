import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

chrome.commands.onCommand.addListener(function (command) {
  console.log('Command:', command);
  if (command === 'create-meeting')
    chrome.runtime.sendMessage({
      type: 'LOAD_MEET',
    });
});

const initialState = { meetLink: '', authToken: '' };

export const meetReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'loading':
      return { ...state, meetLink: 'Loading...' };
    case 'SET_AUTH_TOKEN':
      return { ...state, authToken: action.payload };
    case 'SET_MEET_LINK':
      return { ...state, meetLink: action.payload };
    default:
      return state;
  }
};

export const loadMeet = ({ meetTitle }) => async (dispatch, getState) => {
  dispatch({ type: 'loading' });

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

  const { hangoutLink } = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendNotifications=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getState().authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      return data;
    });

  dispatch({ type: 'SET_MEET_LINK', payload: hangoutLink });
};
