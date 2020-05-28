import { makeStyles } from '@material-ui/core/styles';

export const useModalContainerStyles = makeStyles((theme) => ({
  dialogTitle: {
    padding: theme.spacing(4, 4, 2, 4)
  },

  dialogContent: {
    margin: theme.spacing(0, 4),
    padding: theme.spacing(1, 0, 4, 0)
  }
}));
