import { makeStyles } from '@material-ui/core/styles';

export const useRelatedArticleStyles = makeStyles((theme) => ({
  addButton: {
    marginLeft: theme.spacing(1)
  },
  list: {
    marginTop: 0,
    marginLeft: theme.spacing(3),
    minHeight: theme.spacing(2.75),
    listStyle: 'disc',
    '& li + li': {
      marginTop: theme.spacing(1)
    }
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-end',
    lineHeight: '24px',
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:last-of-type': {
      marginBottom: 0
    }
  },
  info: {
    flex: 1
  },
  editButton: {
    flexGrow: 0,
    padding: 6,
    marginLeft: theme.spacing(2)
  }
}));
