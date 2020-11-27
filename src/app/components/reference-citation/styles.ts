import { makeStyles } from '@material-ui/core/styles';

export const useReferenceEditorStyles = makeStyles((theme) => ({
  refSelectionList: {
    width: 450,
    height: 270,
    overflow: 'auto'
  },
  refSelectionListItem: {
    cursor: 'pointer',
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    lineHeight: '24px',
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
  addReferenceIcon: {
    marginTop: theme.spacing(0.25)
  },
  filterField: {
    width: `calc(100% - ${theme.spacing(3)}px)`,
    margin: theme.spacing(1.5, 1.5, 1, 1.5)
  },
  hiddenIcon: {
    visibility: 'hidden'
  },
  refContent: {
    flexGrow: 1
  },
  refTick: {
    alignSelf: 'center',
    flexGrow: 0
  }
}));
