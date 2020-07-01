import { makeStyles } from '@material-ui/core/styles';

export const useRichTextInputStyles = makeStyles((theme) => ({
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
