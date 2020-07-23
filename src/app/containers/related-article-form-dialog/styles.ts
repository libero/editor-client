import { makeStyles } from '@material-ui/core/styles';

export const useRelatedArticleStyles = makeStyles((theme) => ({
  root: {},

  inputField: {
    width: 500,
    marginBottom: theme.spacing(3)
  },

  buttonPanel: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
    '& > *:last-child': {
      marginLeft: theme.spacing(2)
    }
  },

  spacer: {
    flexGrow: 1
  }
}));
