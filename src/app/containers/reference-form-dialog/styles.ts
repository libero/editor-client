import { makeStyles } from '@material-ui/core/styles';

export const useReferenceAuthorStyles = makeStyles((theme) => ({
  authorInputFields: {
    display: 'flex',
    zIndex: theme.zIndex.modal + 1,
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    '&:last-of-type': {
      marginBottom: 0
    },
    '& > .drag-handle': {
      cursor: 'grab'
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
    padding: theme.spacing(0, 1),
    width: 500
  },
  inputField: {
    marginBottom: theme.spacing(3)
  },
  buttonPanel: {
    display: 'flex',
    marginTop: theme.spacing(1),
    '& > *:last-child': {
      marginLeft: theme.spacing(2)
    }
  },
  spacer: {
    flexGrow: 1
  }
}));
