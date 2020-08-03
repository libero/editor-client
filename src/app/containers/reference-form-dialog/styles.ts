import { makeStyles } from '@material-ui/core/styles';

export const useReferenceContributorStyles = makeStyles((theme) => ({
  contributorInputFields: {
    display: 'flex',
    zIndex: theme.zIndex.modal + 1,
    alignItems: 'center',
    marginTop: theme.spacing(3),
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
    padding: theme.spacing(0, 1, 0, 2),
    width: 500
  },
  inputField: {
    marginTop: theme.spacing(3),
    '&:first-child': {
      marginTop: 0
    }
  },
  missingFieldsSection: {
    marginTop: theme.spacing(3),
    borderColor: theme.palette.error.main,
  },
  buttonPanel: {
    display: 'flex',
    marginTop: theme.spacing(3),
    '& > *:last-child': {
      marginLeft: theme.spacing(2)
    }
  },
  spacer: {
    flexGrow: 1
  }
}));
