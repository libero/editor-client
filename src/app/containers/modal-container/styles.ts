import { makeStyles } from '@material-ui/core/styles';

export const useModalContainerStyles = makeStyles((theme) => ({
  dialogTitle: {
    padding: theme.spacing(4, 4, 2, 4)
  },

  dialogContent: {
    margin: theme.spacing(0, 1.5, 4, 1.5),
    padding: 0
  }
}));
