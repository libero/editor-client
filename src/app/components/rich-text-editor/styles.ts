import { makeStyles } from '@material-ui/core/styles';

export const useRichTextEditorStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(1, 1.5, 1.5, 1.5),
    border: `solid 1px`,
    borderColor: theme.palette.secondary.dark,
    borderRadius: theme.spacing(0.5),
    boxSizing: 'border-box'
  },

  label: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0, 0.5)
  },

  focused: {
    borderColor: theme.palette.primary.light,
    '& > legend': {
      color: theme.palette.primary.light
    }
  }
}));
