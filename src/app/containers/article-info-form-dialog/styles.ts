import { makeStyles } from '@material-ui/core/styles';

export const useArticleInfoFormStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 2.5, 0, 2.5)
  },

  inputField: {
    marginBottom: theme.spacing(2.5)
  },

  copyrightStatement: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },

  buttonPanel: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(4),
    '& > *:last-child': {
      marginLeft: theme.spacing(2)
    }
  },
  spacer: {
    flexGrow: 1
  }
}));
