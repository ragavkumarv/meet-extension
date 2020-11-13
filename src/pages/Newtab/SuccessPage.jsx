import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { copyToClipBoard } from '../Background/meetReducer';

export function SuccessPage({ meetLink }) {
  return (
    <>
      <p>Successfully meeting is created at the below link</p>

      <Tooltip title="Copy" placement="bottom">
        <Chip
          color="primary"
          avatar={
            <Avatar>
              <AssignmentIcon />
            </Avatar>
          }
          label={meetLink}
          clickable
          onClick={() => copyToClipBoard(meetLink)}
        />
      </Tooltip>
    </>
  );
}
