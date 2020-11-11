import { makeStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

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
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: 'solid 1px #C4C4C4'
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
    minHeight: 58,
    display: 'block',
    borderRadius: theme.shape.borderRadius
  },

  addLicenseCta: {
    fontSize: '0.875rem',
    textTransform: 'none',
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1)
  }
}));

export const useFigureLicenseEditorStyles = (theme): Record<string, CSSProperties> => ({
  editorContainer: {
    display: 'flex',
    paddingTop: theme.spacing(2.5)
  },
  editorForm: {
    flexGrow: 1,
    borderRadius: theme.shape.borderRadius,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderStyle: 'solid',
    borderWidth: '1px',
    margin: theme.spacing(0, 1, 0, 0),
    padding: theme.spacing(1.5)
  },
  smallField: {
    width: 150,
    marginRight: theme.spacing(2)
  },
  deleteButton: {
    flexGrow: 0,
    padding: 6,
    alignSelf: 'flex-start'
  },
  spacer: {
    flexGrow: 1
  },
  inputField: {
    marginBottom: theme.spacing(2.5),
    '&:last-child': {
      marginBottom: 0
    }
  },
  fieldsRow: {
    display: 'flex',
    marginBottom: theme.spacing(2.5)
  }
});
