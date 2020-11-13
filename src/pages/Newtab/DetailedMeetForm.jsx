import { KeyboardDateTimePicker } from '@material-ui/pickers';
import React from 'react';
import ChipInput from './ChipInput';
const DetailedMeetForm = ({
  fromDate,
  handleFromDateChange,
  toDate,
  handleToDateChange,
  guests,
  setGuests,
}) => {
  const setting = {
    variant: 'inline',
    ampm: true,
    format: 'MMM DD, YYYY hh:mma',
  };
  return (
    <>
      <KeyboardDateTimePicker
        variant={setting.variant}
        ampm={setting.ampm}
        label="From"
        value={fromDate}
        onChange={handleFromDateChange}
        onError={console.log}
        disablePast
        required
        format={setting.format}
      />
      <KeyboardDateTimePicker
        variant={setting.variant}
        ampm={setting.ampm}
        label="To"
        value={toDate}
        onChange={handleToDateChange}
        onError={console.log}
        disablePast
        required
        format={setting.format}
      />
      <ChipInput state={guests} setState={setGuests} />
    </>
  );
};

export default DetailedMeetForm;
