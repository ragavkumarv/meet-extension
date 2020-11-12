import { Button, TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_MEET, setAuthToken } from '../Background/actions';
import {
  createMeet,
  getUserInfo,
  meetDuration,
} from '../Background/meetReducer';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import dayjs from 'dayjs';
import DayJsUtils from '@date-io/dayjs';
// import DateFnsUtils from '@date-io/date-fns';
import Snackbar from '@material-ui/core/Snackbar';
import ChipInput from './ChipInput';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const meetLink = useSelector((state) => state.meetLink);
  const authToken = useSelector((state) => state.authToken);
  const isLoading = useSelector((state) => state.isLoading);
  const [meetTitle, setMeetTitle] = useState('Meeting');
  const [moreOptions, setMoreOptions] = useState(false);
  const { start, end } = meetDuration(30);
  const [fromDate, handleFromDateChange] = useState(start);
  const [toDate, handleToDateChange] = useState(end);
  const userInfo = useSelector((state) => state.user);

  const createMeetOnShortcut = () => {
    window.chrome.runtime.onMessage.addListener(
      (message, sender, sendResponse) => {
        if (message.type === LOAD_MEET) {
          console.log(meetTitle, authToken);
          dispatch(createMeet({ meetTitle, copy: true }));
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
                    badgeContent={
                      <SwapHorizIcon
                        style={{
                          backgroundColor: '#FFFF',
                          borderRadius: '50%',
                          boxShadow:
                            '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
                        }}
                      />
                    }
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
            <ChipInput />
            {moreOptions && (
              <>
                <KeyboardDateTimePicker
                  variant="inline"
                  ampm={true}
                  label="From"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  onError={console.log}
                  disablePast
                  format="MMM DD, YYYY HH:mma"
                />
                <KeyboardDateTimePicker
                  variant="inline"
                  ampm={true}
                  label="To"
                  value={toDate}
                  onChange={handleToDateChange}
                  onError={console.log}
                  disablePast
                  format="MMM DD, YYYY HH:mma"
                />
              </>
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
            <Button
              color="secondary"
              onClick={() => setMoreOptions((prev) => !prev)}
            >
              {!moreOptions ? 'More' : 'Less'} Options
            </Button>
            <Button
              color="primary"
              onClick={() => dispatch(createMeet({ meetTitle }))}
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
