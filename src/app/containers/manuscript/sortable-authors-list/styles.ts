import { makeStyles } from '@material-ui/core/styles';

export const useAuthorsListStyles = makeStyles((theme) => ({
  sortableContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    userSelect: 'none'
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    '&:last-child': {
      marginRight: 0
    },
    '& > .drag-handle': {
      cursor: 'grab',
      opacity: 0.5
    }
  },
  chipLabel: {
    textOverflow: 'unset',
    overflow: 'unset',
    fontSize: '0.9rem',
    paddingLeft: 0
  },
  addAuthorButton: {
    marginLeft: theme.spacing(1)
  }
}));
