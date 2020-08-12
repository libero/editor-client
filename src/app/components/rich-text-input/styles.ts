import { makeStyles } from '@material-ui/core/styles';

export const useRichTextInputStyles = makeStyles((theme) => ({
  container: {
    minHeight: 56
  },
  hideToolbar: {
    display: 'none'
  },
  toolbar: {
    background: theme.palette.background.paper,
    position: 'absolute',
    top: -24,
    right: 50,
    zIndex: 1
  },

  errorState: {
    borderColor: theme.palette.error.main,
    '& > label': {
      color: theme.palette.error.main
    },
    '&:hover': {
      borderColor: theme.palette.error.main,
      '& > label': {
        color: theme.palette.error.main
      }
    }
  }
}));
