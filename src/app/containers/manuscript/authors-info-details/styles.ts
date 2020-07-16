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
    flexGrow: 0,
    padding: 6
  },
  authorInfoContainer: {
    flex: 1
  },
  authorInfoLine: {
    lineHeight: '24px'
  },
  authorBio: {
    lineHeight: '24px',
    marginTop: theme.spacing(1.5)
  },
  orcidIcon: {
    width: 16,
    height: 16,
    marginTop: 4,
    display: 'inline',
    verticalAlign: 'top'
  }
}));
