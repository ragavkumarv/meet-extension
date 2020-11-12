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
  return (
    <>
      <KeyboardDateTimePicker
        variant="inline"
        ampm={true}
        label="From"
        value={fromDate}
        onChange={handleFromDateChange}
        onError={console.log}
        disablePast
        required
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
        required
        format="MMM DD, YYYY HH:mma"
      />
      <ChipInput state={guests} setState={setGuests} />
    </>
  );
};

export default DetailedMeetForm;
