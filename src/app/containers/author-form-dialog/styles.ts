import { makeStyles } from '@material-ui/core/styles';

export const useAuthorFormStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5, 1.5)
  },

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

  dropDownMenuItem: {
    minHeight: theme.spacing(4)
  },

  affiliatedAuthorInput: {
    flex: 1,
    '& fieldset > legend': {
      maxWidth: 1000
    }
  },

  coiGreyedState: {
    color: theme.palette.text.disabled
  },

  correspondingAuthorCheckbox: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(4)
  },

  deleteButton: {
    height: 32,
    width: 32,
    alignSelf: 'center',
    marginLeft: theme.spacing(1)
  }
}));
