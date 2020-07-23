import { makeStyles } from '@material-ui/core/styles';

export const useSelectComponentStyles = makeStyles((theme) => ({
  selectLabel: {
    background: theme.palette.background.paper,
    padding: theme.spacing(0, 0.5)
  },

  blankOptionSelected: {
    color: theme.palette.text.disabled
  }
}));
