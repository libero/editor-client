import { makeStyles } from '@material-ui/core/styles';

export const useAuthorFormStyles = makeStyles((theme) => ({
  root: {},

  inputField: {
    marginBottom: theme.spacing(3)
  },

  buttonPanel: {
    display: 'flex',
    marginTop: theme.spacing(1),
    '& > *:last-child': {
      marginLeft: theme.spacing(2)
    }
  },

  spacer: {
    flexGrow: 1
  },

  affiliatedAuthorRow: {
    display: 'flex',
    marginTop: theme.spacing(3),
    '&:first-child': {
      marginTop: 0
    }
  },

  affiliatedAuthorInput: {
    flex: 1,
    '& fieldset > legend': {
      maxWidth: 1000
    }
  },

  deleteButton: {
    height: 32,
    width: 32,
    alignSelf: 'center',
    marginLeft: theme.spacing(1)
  }
}));
