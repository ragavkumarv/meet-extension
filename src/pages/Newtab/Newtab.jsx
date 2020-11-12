import DayJsUtils from '@date-io/dayjs';
import { Button, TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_MEET, setAuthToken } from '../Background/actions';
import {
  createMeet,
  getUserInfo,
  meetDuration,
} from '../Background/meetReducer';
import ChipInput from './ChipInput';
import DetailedMeetForm from './DetailedMeetForm';
import SwitchUserIcon from './SwitchUserIcon';
import './Newtab.css';
import './Newtab.scss';

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

  const createMeetOnShortcut = () => {
    window.chrome.runtime.onMessage.addListener(
      (message, sender, sendResponse) => {
        if (message.type === LOAD_MEET) {
          console.log(meetTitle, authToken);
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
              <div onClick={handleChangeUser} style={{ cursor: 'pointer' }}>
                <Tooltip title="Switch account" placement="right">
                  <Badge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    badgeContent={<SwitchUserIcon />}
                  >
                    <Avatar alt="Profile Pic" src={userInfo.picture} />
                  </Badge>
                </Tooltip>
              </div>
            }
            action={
              <IconButton aria-label="settings">
                <SettingsIcon />
              </IconButton>
            }
            title={userInfo.email}
          />
          <CardContent className="wrapper">
            <TextField
              label="Title"
              type="input"
              value={meetTitle}
              className="form__title"
              onChange={(e) => setMeetTitle(e.target.value)}
              // className={classes.textField}
            />
            {moreOptions && (
              <DetailedMeetForm
                fromDate={fromDate}
                handleFromDateChange={handleFromDateChange}
                toDate={toDate}
                handleToDateChange={handleToDateChange}
                guests={guests}
                setGuests={setGuests}
              />
            )}
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
          </CardContent>
          <CardActions>
            <Button color="secondary" onClick={toggleMoreOptions}>
              {!moreOptions ? 'More' : 'Less'} Options
            </Button>
            <Button
              color="primary"
              onClick={() =>
                dispatch(
                  createMeet({
                    meetTitle,
                    fromDate,
                    toDate,
                    attendees: guests.items,
                  })
                )
              }
              style={{ marginLeft: 'auto' }}
            >
              {isLoading ? <CircularProgress /> : 'Meet now'}
            </Button>
          </CardActions>
        </Card>
      </div>
    </MuiPickersUtilsProvider>
  );
};

export default Newtab;
