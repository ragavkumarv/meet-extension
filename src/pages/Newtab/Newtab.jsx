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
import { SharePage } from './SharePage';
import UserProfilePic from './UserProfilePic';
import Grow from '@material-ui/core/Grow';
import './Newtab.scss';
import { DEFAULT_MEET_DURATION, REVOKE_URL } from '../Background/globalConst';
import DuoIcon from '@material-ui/icons/Duo';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const initialGuests = {
  items: [],
  value: '',
  error: null,
};

const Newtab = () => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.authToken);
  const userInfo = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [meetTitle, setMeetTitle] = useState('Meeting');
  const [moreOptions, setMoreOptions] = useState(false);
  const [fromDate, handleFromDateChange] = useState();
  const [toDate, handleToDateChange] = useState();
  const [guests, setGuests] = useState(initialGuests);
  const [errorMsg, setErrorMsg] = useState('');

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
    fetch(`${REVOKE_URL}${authToken}`).then(() => {
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

  const toggleMoreOptions = () => {
    console.log(guests);
    setMoreOptions((prev) => !prev);
    setGuests(initialGuests);
    if (moreOptions) {
      handleFromDateChange(null);
      handleToDateChange(null);
    } else {
      const { start, end } = meetDuration(DEFAULT_MEET_DURATION);
      handleFromDateChange(start);
      handleToDateChange(end);
    }
  };

  const createMeeting = () => {
    // Validations
    if (new Date(fromDate) > new Date(toDate)) {
      setErrorMsg('From Date is Greater');
      setOpen(true);
      return;
    }

    // Shows first Loader -> Success or Error
    goTo(SharePage, { meetTitle });
    dispatch(
      createMeet({
        meetTitle,
        fromDate,
        toDate,
        attendees: guests.items,
      })
    );
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
              <Button
                startIcon={
                  !moreOptions ? <ExpandMoreIcon /> : <ExpandLessIcon />
                }
                color="secondary"
                onClick={toggleMoreOptions}
              >
                {!moreOptions ? 'More' : 'Less'} Options
              </Button>
              <Button
                startIcon={<DuoIcon />}
                color="primary"
                onClick={createMeeting}
                style={{ marginLeft: 'auto' }}
              >
                Meet
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
        message={errorMsg}
      />
    </MuiPickersUtilsProvider>
  );
};

export default Newtab;
