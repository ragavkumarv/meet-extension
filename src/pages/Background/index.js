import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import {
  setMeetLink,
  LOADING,
  SET_AUTH_TOKEN,
  SET_MEET_LINK,
  LOAD_MEET,
  SET_ERROR_MSG,
  setErrorMsg,
} from './actions';
dayjs.extend(timezone);

chrome.commands.onCommand.addListener(function (command) {
  console.log('Command:', command);
  if (command === 'create-meeting')
    chrome.runtime.sendMessage({
      type: LOAD_MEET,
    });
});

const initialState = { isLoading: false, meetLink: '', authToken: '' };

export const meetReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOADING:
      return { ...state, isLoading: true };
    case SET_AUTH_TOKEN:
      return { ...state, authToken: payload, isLoading: false };
    case SET_MEET_LINK:
      return { ...state, meetLink: payload, isLoading: false };
    case SET_ERROR_MSG:
      return { ...state, meetLink: payload, isLoading: false };
    default:
      return state;
  }
};

const getTimeZone = () => dayjs.tz.guess();

const generateRandomRequestId = () => Math.random().toString(36).substring(7);

export const createMeet = ({ meetTitle }) => async (dispatch, getState) => {
  dispatch({ type: LOADING });

  const event = {
    summary: meetTitle || '(No Title)',
    start: {
      dateTime: dayjs().toISOString(),
      timeZone: getTimeZone(),
    },
    end: {
      dateTime: dayjs().add(30, 'minutes').toISOString(),
      timeZone: getTimeZone(),
    },
    conferenceData: {
      createRequest: {
        requestId: generateRandomRequestId(),
      },
    },
  };

  try {
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

    dispatch(setMeetLink(hangoutLink));
  } catch {
    console.log('Error occured');
    dispatch(setErrorMsg());
  }
};
