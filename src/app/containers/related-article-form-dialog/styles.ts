import { makeStyles } from '@material-ui/core/styles';

export const useRelatedArticleStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 2.5, 0, 2.5)
  },

  inputField: { width: '100%', marginBottom: theme.spacing(3) },

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
