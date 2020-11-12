import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import {
  LOADING,
  setAuthToken,
  setErrorMsg,
  setMeetLink,
  setUserInfo,
  SET_AUTH_TOKEN,
  SET_ERROR_MSG,
  SET_MEET_LINK,
  SET_USER_INFO,
} from './actions';

const initialState = {
  isLoading: false,
  meetLink: '',
  authToken: '',
  user: { email: '', picture: '' },
};
dayjs.extend(timezone);

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
    case SET_USER_INFO:
      return { ...state, user: payload };
    default:
      return state;
  }
};
const getTimeZone = () => dayjs.tz.guess();
const generateRandomRequestId = () => Math.random().toString(36).substring(7);

export const createMeet = ({
  meetTitle,
  copy,
  fromDate,
  toDate,
  attendees,
}) => async (dispatch, getState) => {
  dispatch({ type: LOADING });

  const { start, end } = meetDuration(30);

  const event = {
    summary: meetTitle || '(No Title)',
    start: {
      dateTime: fromDate || start,
      timeZone: getTimeZone(),
    },
    end: {
      dateTime: toDate || end,
      timeZone: getTimeZone(),
    },
    attendees: attendees.map((attendee) => ({ email: attendee })),
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

    if (copy) {
      copyToClipBoard(hangoutLink);
    }

    dispatch(setMeetLink(hangoutLink));
  } catch {
    console.log('Error occured');
    dispatch(setErrorMsg());
  }
};

export const getUserInfo = () => async (dispatch, getState) => {
  chrome.identity.getAuthToken({ interactive: true }, async function (token) {
    dispatch(setAuthToken(token));

    const info = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
    ).then((res) => res.json());

    dispatch(setUserInfo(info));
  });
};

export function meetDuration(mins) {
  return {
    start: dayjs().toISOString(),
    end: dayjs().add(mins, 'minutes').toISOString(),
  };
}

function copyToClipBoard(hangoutLink) {
  navigator.clipboard
    .writeText(hangoutLink)
    .then(() => {
      console.log('copied');
      // Success!
    })
    .catch((err) => {
      console.log('Something went wrong', err);
    });
}
