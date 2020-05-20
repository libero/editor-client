import { makeStyles } from '@material-ui/core/styles';

export const useAuthorsListStyles = makeStyles((theme) => ({
  sortableContainer: {
    display: 'flex'
  },
  chip: {
    marginRight: theme.spacing(1),
    '&:last-child': {
      marginRight: 0
    }
  },
  chipLabel: {
    fontSize: '0.9rem'
  }
}));
