import { makeStyles } from '@material-ui/core/styles';

export const useAffiliationStyles = makeStyles((theme) => ({
  addButton: {
    marginLeft: theme.spacing(1)
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    lineHeight: '24px',
    marginTop: theme.spacing(1),
    '&:first-child': {
      marginTop: 0
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
