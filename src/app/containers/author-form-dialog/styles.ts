import { makeStyles } from '@material-ui/core/styles';

export const useAuthorFormStyles = makeStyles((theme) => ({
  root: {},

  inputField: {
    marginBottom: theme.spacing(2)
  },

  buttonPanel: {
    display: 'flex',
    marginTop: theme.spacing(1),
    '& > *:last-child': {
      marginLeft: theme.spacing(1)
    }
  },

  spacer: {
    flexGrow: 1
  },

  deleteButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
  }
}));
