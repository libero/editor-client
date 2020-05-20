import { makeStyles } from '@material-ui/core/styles';

export const useAddEntityBtnStyles = makeStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0, 0.5),
    fontSize: '0.75rem'
  },

  icon: {
    marginRight: theme.spacing(0.25),
    '& > *:first-child': {
      fontSize: '0.75rem'
    }
  }
}));
