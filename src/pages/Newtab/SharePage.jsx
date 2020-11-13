import { Button } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import React from 'react';
import { goBack } from 'react-chrome-extension-router';
import { useSelector } from 'react-redux';
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
import SuccessOrError from './SuccessOrError';
import './SharePage.scss';
import Collapse from '@material-ui/core/Collapse';

export function SharePage({ meetTitle }) {
  const meetLink = useSelector((state) => state.meetLink);
  const status = useSelector((state) => state.status);
  const hoverShadow = 'MuiButtonBase-root MuiIconButton-root';
  const size = 32;
  const round = true;
  const resetButtonStyle = false;
  return (
    <>
      <CardContent className="content">
        <SuccessOrError status={status} />
        <Button color="secondary" onClick={goBack}>
          Go Back
        </Button>
      </CardContent>
      {status === 'success' && (
        <Collapse in={status === 'success'}>
          <CardActions>
            <WhatsappShareButton
              className={hoverShadow}
              title={meetTitle}
              url={meetLink}
              resetButtonStyle={resetButtonStyle}
            >
              <WhatsappIcon size={size} round={round} />
            </WhatsappShareButton>
            <LinkedinShareButton
              className={hoverShadow}
              resetButtonStyle={resetButtonStyle}
              title={meetTitle}
              url={meetLink}
            >
              <LinkedinIcon size={size} round={round} />
            </LinkedinShareButton>
            <TwitterShareButton
              className={hoverShadow}
              resetButtonStyle={resetButtonStyle}
              title={meetTitle}
              url={meetLink}
            >
              <TwitterIcon size={size} round={round} />
            </TwitterShareButton>
            <PinterestShareButton
              className={hoverShadow}
              resetButtonStyle={resetButtonStyle}
              title={meetTitle}
              url={meetLink}
            >
              <PinterestIcon size={size} round={round} />
            </PinterestShareButton>
            <FacebookShareButton
              className={hoverShadow}
              resetButtonStyle={resetButtonStyle}
              title={meetTitle}
              url={meetLink}
            >
              <FacebookIcon size={size} round={round} />
            </FacebookShareButton>
          </CardActions>
        </Collapse>
      )}
    </>
  );
}
