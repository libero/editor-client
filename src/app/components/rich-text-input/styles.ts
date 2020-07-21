import { makeStyles } from '@material-ui/core/styles';

export const useRichTextInputStyles = makeStyles((theme) => ({
  container: {
    minHeight: 56,
    '&:hover': {
      borderColor: theme.palette.text.primary
    }
  },
  hideToolbar: {
    display: 'none'
  },
  toolbar: {
    background: theme.palette.background.paper,
    position: 'absolute',
    top: -24,
    right: 50,
    zIndex: 1
  }
}));
