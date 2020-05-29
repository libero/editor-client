import { makeStyles } from '@material-ui/core/styles';

export const usePromptDialogStyles = makeStyles((theme) => ({
  dialogTitle: {
    padding: theme.spacing(3, 3, 1, 3)
  },
  actionPanel: {
    padding: 0,
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(3),
    '& > *:last-child': {
      marginLeft: theme.spacing(2)
    }
  }
}));
