import { makeStyles } from '@material-ui/core/styles';

export const useSectionContainerStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    padding: theme.spacing(1.5, 1, 1, 1),
    border: `solid 1px`,
    borderColor: theme.palette.secondary.dark,
    borderRadius: theme.spacing(0.5),
    boxSizing: 'border-box',
    '&:focus': {
      outline: 'none',
      borderColor: theme.palette.primary.light,
      '& > legend': {
        color: theme.palette.primary.main
      }
    }
  },
  label: {
    position: 'absolute',
    top: -5,
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    background: theme.palette.background.paper,
    padding: theme.spacing(0, 0.5)
  }
}));
