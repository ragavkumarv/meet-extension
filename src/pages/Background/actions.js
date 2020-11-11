export const SET_MEET_LINK = 'SET_MEET_LINK';
export const LOADING = 'LOADING';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const LOAD_MEET = 'LOAD_MEET';

export const setMeetLink = (hangoutLink) => ({
  type: SET_MEET_LINK,
  payload: hangoutLink,
});

export const setAuthToken = (token) => ({
  type: SET_AUTH_TOKEN,
  payload: token,
});
