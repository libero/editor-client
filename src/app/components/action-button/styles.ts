import { makeStyles } from '@material-ui/core/styles';

export const useActionButtonStyles = makeStyles((theme) => ({
  regularButton: {
    fontWeight: 600
  },
  containedRedButton: {
    backgroundColor: theme.palette.error.main,
    fontWeight: 600,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },

  outlinedRedButton: {
    color: theme.palette.error.main,
    fontWeight: 600,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.dark
    }
  },

  addEntityButton_root: {
    textTransform: 'none',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0, 0.5),
    fontSize: '0.75rem'
  },

  addEntityButton_icon: {
    marginRight: theme.spacing(0.25),
    '& > *:first-child': {
      fontSize: '0.75rem'
    }
  }
}));
