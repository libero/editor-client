import { makeStyles } from '@material-ui/core/styles';

export const useFigureCitationEditorStyles = makeStyles((theme) => ({
  figureSelectionList: {
    width: 380,
    maxHeight: 280,
    overflow: 'auto'
  },
  figureSelectionListItem: {
    cursor: 'pointer',
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    margin: theme.spacing(0, 1.5),
    border: 'solid 1px rgba(0, 0, 0, 0.23)',
    borderBottom: 'none',
    '&:first-child': {
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5)
    },
    '&:last-child': {
      borderBottom: 'solid 1px rgba(0, 0, 0, 0.23)',
      marginBottom: theme.spacing(1.5),
      borderBottomLeftRadius: theme.spacing(0.5),
      borderBottomRightRadius: theme.spacing(0.5)
    }
  },
  clearFilterIcon: {
    cursor: 'pointer'
  },
  filterField: {
    width: `calc(100% - ${theme.spacing(3)}px)`,
    margin: theme.spacing(1.5, 1.5, 1, 1.5),
    '& input': {
      padding: theme.spacing(1.25, 1.75)
    }
  },
  hiddenIcon: {
    visibility: 'hidden'
  },
  figureContent: {
    flexGrow: 1,
    paddingTop: theme.spacing(1)
  },
  figureTick: {
    alignSelf: 'center',
    flexGrow: 0
  }
}));
