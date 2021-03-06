import { makeStyles } from '@material-ui/core/styles';

export const useBoxTextEditorStyles = makeStyles((theme) => ({
  boxContainer: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  boxText: {
    flexGrow: 1,
    padding: theme.spacing(2),
    margin: theme.spacing(5, 0),
    borderRadius: theme.spacing(0.5),
    backgroundColor: '#FAFAFA',
    boxShadow: '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)'
  },
  editButton: {
    flexGrow: 0,
    padding: 6,
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(5)
  }
}));
