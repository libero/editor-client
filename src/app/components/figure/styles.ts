import { makeStyles } from '@material-ui/core/styles';

export const useFigureEditorStyles = makeStyles((theme) => ({
  figureContainer: {
    display: 'flex',
    alignItems: 'flex-start',

    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
      borderWidth: 1
    }
  },
  figureContent: {
    flexGrow: 1,
    padding: theme.spacing(3, 2, 2, 2),
    margin: theme.spacing(5, 0),
    borderRadius: theme.shape.borderRadius,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderStyle: 'solid',
    borderWidth: '1px'
  },
  deleteButton: {
    flexGrow: 0,
    padding: 6,
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(5)
  },
  inputField: {
    marginBottom: theme.spacing(2.5)
  },
  imageContainer: {
    marginBottom: theme.spacing(2.5),
    position: 'relative'
  },
  uploadImageCta: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: '#929393',
    padding: 10,
    '&:hover': {
      backgroundColor: '#929393'
    },
    '& svg': {
      fill: '#FFFFFF'
    }
  },
  image: {
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
    border: 'solid 1px #C4C4C4'
  }
}));
