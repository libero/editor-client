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

  selectLabel: {
    background: theme.palette.background.paper,
    padding: theme.spacing(0, 0.5)
  },

  articleTypeGreyed: {
    color: theme.palette.text.disabled
  },

  spacer: {
    flexGrow: 1
  }
}));
