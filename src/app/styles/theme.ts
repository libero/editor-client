import { createMuiTheme } from '@material-ui/core/styles';

import { PaletteOptions } from '@material-ui/core/styles/createPalette';

import constants from './constants.module.scss';

export const palette = {
  primary: {
    main: constants['primary-main'],
    contrastText: constants['primary-contrast-text']
  },
  secondary: {
    main: constants['secondary-main'],
    contrastText: constants['text-secondary']
  },
  error: {
    main: constants['error']
  },
  text: {
    primary: constants['text-primary'],
    secondary: constants['text-secondary']
  }
} as PaletteOptions;

export const theme = createMuiTheme({
  palette,
  typography: {
    fontFamily: constants['font-family'],
    h1: {
      fontSize: 36,
      fontWeight: 600
    },
    h2: {
      fontSize: 26,
      fontWeight: 600
    },
    h3: {
      fontSize: 22,
      fontWeight: 600
    },
    h4: {
      fontSize: 20,
      fontWeight: 600
    },
    h5: {
      fontSize: 18,
      fontWeight: 600
    },
    h6: {
      fontSize: 16,
      fontWeight: 600
    }
  },
  overrides: {
    MuiButton: {
      outlinedSecondary: {
        color: constants['text-secondary']
      }
    }
  }
});
