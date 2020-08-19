import { makeStyles } from '@material-ui/core/styles';

export const useReferenceContributorStyles = makeStyles((theme) => ({
  contributorInputFields: {
    display: 'flex',
    zIndex: theme.zIndex.modal + 1,
    marginTop: theme.spacing(2.5),
    alignItems: 'center',
    '&:first-child': {
      marginTop: theme.spacing(0)
    },
    '& > .drag-handle': {
      cursor: 'grab',
      width: 10,
      height: 16,
      marginRight: theme.spacing(0.75),
      marginLeft: -1 * theme.spacing(2),
      zIndex: 1
    }
  },
  lastName: {
    marginRight: theme.spacing(1.5)
  },
  menuButton: {
    height: 32,
    width: 32,
    alignSelf: 'center',
    marginLeft: theme.spacing(1)
  }
}));

export const useReferenceFormStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 2.5, 0, 2),
    marginLeft: theme.spacing(0.5),
    width: 500
  },
  inputField: {
    marginTop: theme.spacing(2.5),
    '&:first-child': {
      marginTop: 0
    }
  },
  missingFieldsSection: {
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2)
  },
  missingFieldsMessage: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3)
  },
  missingFieldsRow: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  missingField: {
    flexGrow: 1
  },
  deleteButton: {
    height: 32,
    width: 32,
    alignSelf: 'center',
    marginLeft: theme.spacing(1)
  },
  buttonPanel: {
    display: 'flex',
    marginTop: theme.spacing(4),
    '& > *:last-child': {
      marginLeft: theme.spacing(2)
    }
  },
  spacer: {
    flexGrow: 1
  }
}));
