import { makeStyles } from '@material-ui/core/styles';

export const useAffiliationStyles = makeStyles((theme) => ({
  root: {
    minHeight: theme.spacing(2.75)
  },
  addButton: {
    marginLeft: theme.spacing(1)
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    lineHeight: '24px',
    marginBottom: theme.spacing(1),
    '&:last-of-type': {
      marginBottom: 0
    }
  },
  affiliationInfo: {
    flex: 1
  },
  orderLabel: {
    fontSize: 10,
    lineHeight: '16px',
    paddingRight: 2
  },
  editButton: {
    flexGrow: 0,
    padding: 6,
    marginLeft: theme.spacing(2)
  },
  orcidIcon: {
    width: 16,
    height: 16,
    marginTop: 4,
    display: 'inline',
    verticalAlign: 'top'
  }
}));
