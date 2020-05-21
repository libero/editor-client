import { makeStyles } from '@material-ui/core/styles';

export const useModalContainerStyles = makeStyles((theme) => ({
  dialogTitle: {
    margin: theme.spacing(4, 4, 2, 4),
    padding: 0
  },

  dialogContent: {
    margin: theme.spacing(0, 4),
    padding: theme.spacing(1, 0, 4, 0)
  }
}));
