import { makeStyles } from '@material-ui/core/styles';

export const useSectionContainerStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    padding: theme.spacing(2, 1, 1, 1.5),
    border: `solid 1px`,
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

  outlinedVariant: {
    borderColor: theme.palette.secondary.dark
  },

  plainVariant: {
    borderColor: 'transparent'
  },

  label: {
    position: 'absolute',
    top: -5,
    left: theme.spacing(1),
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    background: theme.palette.background.paper,
    padding: theme.spacing(0, 0.5)
  },

  focused: {
    borderColor: theme.palette.primary.light,
    '& > label': {
      color: theme.palette.primary.light
    }
  }
}));