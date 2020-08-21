import { makeStyles } from '@material-ui/core/styles';

export const useDropDownStyles = makeStyles((theme) => ({
  button: {
    fontWeight: 600
  },

  menuContainer: {
    zIndex: theme.zIndex.appBar + 1
  }
}));
