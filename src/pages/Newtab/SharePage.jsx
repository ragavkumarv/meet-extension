import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

export function SharePage({ meetTitle, meetLink }) {
  return (
    <>
      <WhatsappShareButton
        className="MuiButtonBase-root MuiIconButton-root"
        title={meetTitle}
        url={meetLink}
        resetButtonStyle={false}
      >
        <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>
      <LinkedinShareButton
        className="MuiButtonBase-root MuiIconButton-root"
        resetButtonStyle={false}
        title={meetTitle}
        url={meetLink}
      >
        <LinkedinIcon size={32} round={true} />
      </LinkedinShareButton>
      <TwitterShareButton
        className="MuiButtonBase-root MuiIconButton-root"
        resetButtonStyle={false}
        title={meetTitle}
        url={meetLink}
      >
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      <PinterestShareButton
        className="MuiButtonBase-root MuiIconButton-root"
        resetButtonStyle={false}
        title={meetTitle}
        url={meetLink}
      >
        <PinterestIcon size={32} round={true} />
      </PinterestShareButton>
      <FacebookShareButton
        className="MuiButtonBase-root MuiIconButton-root"
        resetButtonStyle={false}
        title={meetTitle}
        url={meetLink}
      >
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
    </>
  );
}
