import React from 'react';
import { SvgIcon } from '@material-ui/core';
import { useIconStyles } from 'app/containers/manuscript/icon-styles';

export const SubscriptIcon: React.FC<{}> = () => {
  return (
    <SvgIcon>
      <g>
        <rect fill="none" height="24" width="24" />
        <path d="M22,18h-2v1h3v1h-4v-2c0-0.55,0.45-1,1-1h2v-1h-3v-1h3c0.55,0,1,0.45,1,1v1C23,17.55,22.55,18,22,18z M5.88,18h2.66 l3.4-5.42h0.12l3.4,5.42h2.66l-4.65-7.27L17.81,4h-2.68l-3.07,4.99h-0.12L8.85,4H6.19l4.32,6.73L5.88,18z" />
      </g>
    </SvgIcon>
  );
};

export const SuperscriptIcon: React.FC<{}> = () => {
  const classes = useIconStyles();
  return (
    <SvgIcon classes={{ root: classes.superscriptIcon }}>
      <g>
        <rect fill="none" height="24" width="24" x="0" y="0" />
        <path d="M22,7h-2v1h3v1h-4V7c0-0.55,0.45-1,1-1h2V5h-3V4h3c0.55,0,1,0.45,1,1v1C23,6.55,22.55,7,22,7z M5.88,20h2.66l3.4-5.42h0.12 l3.4,5.42h2.66l-4.65-7.27L17.81,6h-2.68l-3.07,4.99h-0.12L8.85,6H6.19l4.32,6.73L5.88,20z" />
      </g>
    </SvgIcon>
  );
};

export const OrcidIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <SvgIcon version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 256 256" classes={{ root: className }}>
      <path
        style={{ fill: '#A6CE39' }}
        d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"
      />
      <g>
        <path style={{ fill: '#FFFFFF' }} d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z" />
        <path
          style={{ fill: '#FFFFFF' }}
          d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5
    c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"
        />
        <path
          style={{ fill: '#FFFFFF' }}
          d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1
    C84.2,46.7,88.7,51.3,88.7,56.8z"
        />
      </g>
    </SvgIcon>
  );
};
