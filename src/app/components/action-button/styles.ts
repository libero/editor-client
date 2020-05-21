import { makeStyles } from '@material-ui/core/styles';

export const useActionButtonStyles = makeStyles((theme) => ({
  containedRedButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText
  },

  outlinedRedButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
  }
}));
