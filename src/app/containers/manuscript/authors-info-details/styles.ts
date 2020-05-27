import { makeStyles } from '@material-ui/core/styles';

export const useAuthorsDetailsListStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1.5),
    '& > *': {
      marginTop: theme.spacing(3)
    },
    '& > *:first-child': {
      marginTop: theme.spacing(0)
    }
  }
}));

export const useAuthorDetailStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start'
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
