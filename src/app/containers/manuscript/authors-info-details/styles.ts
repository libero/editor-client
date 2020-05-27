import { makeStyles } from '@material-ui/core/styles';

export const useAuthorsDetailsListStyles = makeStyles((theme) => ({
  addAuthorButton: {
    marginLeft: theme.spacing(1)
  }
}));

export const useAuthorDetailStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(3),
    '&:first-of-type': {
      marginTop: theme.spacing(0)
    }
  },
  editButton: {
    flexGrow: 0
  },
  authorInfoLine: {
    lineHeight: '24px'
  },
  orcidIcon: {
    width: 16,
    height: 16,
    marginTop: 4,
    display: 'inline',
    verticalAlign: 'top'
  }
}));
