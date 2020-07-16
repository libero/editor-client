import { makeStyles } from '@material-ui/core/styles';

export const useReferencesListStyles = makeStyles((theme) => ({
  list: {
    marginLeft: theme.spacing(3),
    marginTop: 0,
    listStyleType: 'disc',
    '& li + li': {
      marginTop: theme.spacing(3)
    }
  }
}));

export const useReferencesListItemStyles = makeStyles((theme) => ({
  listItem: {
    paddingLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-start'
  },
  content: {
    flexGrow: 1,
    lineHeight: '24px',
    paddingRight: theme.spacing(3)
  },
  editButton: {
    flexGrow: 0,
    padding: 6
  }
}));
