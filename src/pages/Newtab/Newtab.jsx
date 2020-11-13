import DayJsUtils from '@date-io/dayjs';
import { Button, TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SettingsIcon from '@material-ui/icons/Settings';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import { goTo, Router } from 'react-chrome-extension-router';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_MEET, setAuthToken } from '../Background/actions';
import {
  createMeet,
  getUserInfo,
  meetDuration,
} from '../Background/meetReducer';
import DetailedMeetForm from './DetailedMeetForm';
import './Newtab.css';
import './Newtab.scss';
import { SharePage } from './SharePage';
import UserProfilePic from './UserProfilePic';
import Grow from '@material-ui/core/Grow';

const initialGuests = {
  items: [],
  value: '',
  error: null,
};
const defaultMeetDuration = 30; // in mins

const Newtab = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const meetLink = useSelector((state) => state.meetLink);
  const authToken = useSelector((state) => state.authToken);
  const isLoading = useSelector((state) => state.isLoading);
  const [meetTitle, setMeetTitle] = useState('Meeting');
  const [moreOptions, setMoreOptions] = useState(false);
  const [fromDate, handleFromDateChange] = useState();
  const [toDate, handleToDateChange] = useState();
  const userInfo = useSelector((state) => state.user);
  const [guests, setGuests] = useState(initialGuests);
  const status = useSelector((state) => state.status);

  const createMeetOnShortcut = () => {
    window.chrome.runtime.onMessage.addListener(
      (message, sender, sendResponse) => {
        if (message.type === LOAD_MEET) {
          // console.log(meetTitle, authToken);
          goTo(SharePage, { meetTitle });
          dispatch(
            createMeet({
              meetTitle,
              fromDate,
              toDate,
              attendees: guests.items,
              copy: true,
            })
          );
        }
      }
    );
  };

  const handleChangeUser = () => {
    fetch(
      'https://accounts.google.com/o/oauth2/revoke?token=' + authToken
    ).then(() => {
      chrome.identity.removeCachedAuthToken({ token: authToken }, () => {
        dispatch(setAuthToken(null));
        dispatch(getUserInfo());
      });
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    createMeetOnShortcut();
    dispatch(getUserInfo());
  }, []);

  useEffect(() => {
    if (meetLink) setOpen(true);
  }, [meetLink]);

  const toggleMoreOptions = () => {
    console.log(guests);
    setMoreOptions((prev) => !prev);
    setGuests(initialGuests);
    if (moreOptions) {
      handleFromDateChange(null);
      handleToDateChange(null);
    } else {
      const { start, end } = meetDuration(defaultMeetDuration);
      handleFromDateChange(start);
      handleToDateChange(end);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DayJsUtils}>
      <div className="App">
        <Card>
          <CardHeader
            avatar={
              <UserProfilePic
                handleChangeUser={handleChangeUser}
                userInfo={userInfo}
              />
            }
            action={
              <IconButton aria-label="settings">
                <SettingsIcon />
              </IconButton>
            }
            title={userInfo.email}
          />
          <Router>
            <CardContent className="wrapper">
              <TextField
                label="Title"
                type="input"
                value={meetTitle}
                className="form__title"
                onChange={(e) => setMeetTitle(e.target.value)}
              />
              {moreOptions && (
                <Grow in={moreOptions}>
                  <DetailedMeetForm
                    fromDate={fromDate}
                    handleFromDateChange={handleFromDateChange}
                    toDate={toDate}
                    handleToDateChange={handleToDateChange}
                    guests={guests}
                    setGuests={setGuests}
                  />
                </Grow>
              )}
            </CardContent>
            <CardActions>
              <Button color="secondary" onClick={toggleMoreOptions}>
                {!moreOptions ? 'More' : 'Less'} Options
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  goTo(SharePage, { meetTitle });
                  dispatch(
                    createMeet({
                      meetTitle,
                      fromDate,
                      toDate,
                      attendees: guests.items,
                    })
                  );
                }}
                style={{ marginLeft: 'auto' }}
              >
                Meet now
              </Button>
            </CardActions>
          </Router>
        </Card>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        message={meetLink}
      />
    </MuiPickersUtilsProvider>
  );
};

export default Newtab;
