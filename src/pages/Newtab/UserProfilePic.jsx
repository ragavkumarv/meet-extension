import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import SwitchUserIcon from './SwitchUserIcon';

export default function UserProfilePic({ handleChangeUser, userInfo }) {
  return (
    <div
      onClick={handleChangeUser}
      style={{
        cursor: 'pointer',
      }}
    >
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
  );
}
