import { makeStyles } from '@material-ui/core/styles';
export const LINK_EDITOR_MAX_WIDTH = 520;

export const useLinkEditorStyles = makeStyles((theme) => ({
  container: {
    maxWidth: LINK_EDITOR_MAX_WIDTH,
    padding: theme.spacing(1.5),
    background: theme.palette.background.paper,
    paddingTop: theme.spacing(2.25),
    display: 'flex',
    alignItems: 'center'
  },

  textField: {
    width: 350,
    height: 40,
    marginRight: theme.spacing(1),
    '& input': {
      padding: 12
    }
  },
  clearTextButton: {
    cursor: 'pointer'
  },

  launchButton: {
    padding: 8,
    marginRight: theme.spacing(1)
  }
}));
