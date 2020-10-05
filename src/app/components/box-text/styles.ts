import { makeStyles } from '@material-ui/core/styles';

export const useBoxTextEditorStyles = makeStyles((theme) => ({
  boxContainer: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  editButton: {
    flexGrow: 0,
    padding: 6,
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(5)
  }
}));
