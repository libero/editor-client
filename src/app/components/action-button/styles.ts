import { makeStyles } from '@material-ui/core/styles';

export const useActionButtonStyles = makeStyles((theme) => ({
  regularButton: {
    minWidth: 90,
    fontWeight: 600
  },
  containedRedButton: {
    minWidth: 90,
    backgroundColor: theme.palette.error.main,
    fontWeight: 600,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },

  outlinedRedButton: {
    minWidth: 90,
    color: theme.palette.error.main,
    fontWeight: 600,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.dark
    }
  },

  addEntityButton_root: {
    textTransform: 'none',
    fontSize: '0.875rem'
  },

  addEntityButton_icon: {
    marginRight: theme.spacing(0.25),
    '& > *:first-child': {
      fontSize: '0.75rem'
    }
  }
}));
