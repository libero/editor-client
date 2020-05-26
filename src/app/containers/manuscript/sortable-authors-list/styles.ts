import { makeStyles } from '@material-ui/core/styles';

export const useAuthorsListStyles = makeStyles((theme) => ({
  sortableContainer: {
    display: 'flex'
  },
  chip: {
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    '&:last-child': {
      marginRight: 0
    },
    '& > .drag-handle': {
      cursor: 'grab'
    }
  },
  chipLabel: {
    fontSize: '0.9rem',
    paddingLeft: 0
  }
}));
