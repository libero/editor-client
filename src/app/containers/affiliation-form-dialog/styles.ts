import { makeStyles } from '@material-ui/core/styles';

export const useAffiliationFormStyles = makeStyles((theme) => ({
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
  }
}));
