import { makeStyles } from '@material-ui/core/styles';

export const useAuthorFormStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 2.5, 0, 2.5)
  },

  inputField: {
    marginBottom: theme.spacing(2.5)
  },

  buttonPanel: {
    display: 'flex',
    marginTop: theme.spacing(4),
    '& > *:last-child': {
      marginLeft: theme.spacing(2)
    }
  },

  spacer: {
    flexGrow: 1
  },

  authorAffiliationRow: {
    display: 'flex',
    marginTop: theme.spacing(2.5),
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
    marginBottom: theme.spacing(1.25)
  },

  deleteButton: {
    height: 32,
    width: 32,
    alignSelf: 'center',
    marginLeft: theme.spacing(1)
  }
}));
