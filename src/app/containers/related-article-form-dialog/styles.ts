import { makeStyles } from '@material-ui/core/styles';

export const useRelatedArticleStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    padding: theme.spacing(1, 2.5, 0, 2.5)
  },

  inputField: {
    width: '100%',
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
  }
}));
