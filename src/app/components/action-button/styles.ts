import { makeStyles } from '@material-ui/core/styles';

export const useActionButtonStyles = makeStyles((theme) => ({
  containedRedButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText
  },

  outlinedRedButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
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
