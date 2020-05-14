import { createMuiTheme } from '@material-ui/core/styles';

import { PaletteOptions } from '@material-ui/core/styles/createPalette';

import constants from './constants.module.scss';

export const palette = {
  primary: {
    main: constants['primary-main'],
    contrastText: constants['primary-contrast-text']
  },
  secondary: {
    main: constants['secondary-main']
  },
  text: {
    primary: constants['text-primary'],
    secondary: constants['text-secondary']
  }
} as PaletteOptions;

export const theme = createMuiTheme({
  palette
});
