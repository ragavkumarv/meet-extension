export const LOADING = 'LOADING';
export const LOAD_MEET = 'LOAD_MEET';
export const SET_MEET_LINK = 'SET_MEET_LINK';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_ERROR_MSG = 'SET_ERROR_MSG';

export const setMeetLink = (hangoutLink) => ({
  type: SET_MEET_LINK,
  payload: hangoutLink,
});

export const setAuthToken = (token) => ({
  type: SET_AUTH_TOKEN,
  payload: token,
});

export const setErrorMsg = () => ({
  type: SET_ERROR_MSG,
  payload: 'Please retry after some time',
});
