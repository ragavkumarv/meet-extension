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
      <WhatsappShareButton title={meetTitle} url={meetLink}>
        <IconButton aria-label="facebook">
          <WhatsappIcon size={32} round={true} />
        </IconButton>
      </WhatsappShareButton>
      <LinkedinShareButton title={meetTitle} url={meetLink}>
        <IconButton aria-label="facebook">
          <LinkedinIcon size={32} round={true} />
        </IconButton>
      </LinkedinShareButton>
      <TwitterShareButton title={meetTitle} url={meetLink}>
        <IconButton aria-label="facebook">
          <TwitterIcon size={32} round={true} />
        </IconButton>
      </TwitterShareButton>
      <PinterestShareButton title={meetTitle} url={meetLink}>
        <IconButton aria-label="facebook">
          <PinterestIcon size={32} round={true} />
        </IconButton>
      </PinterestShareButton>
      <FacebookShareButton title={meetTitle} url={meetLink}>
        <IconButton aria-label="facebook">
          <FacebookIcon size={32} round={true} />
        </IconButton>
      </FacebookShareButton>
    </>
  );
}
