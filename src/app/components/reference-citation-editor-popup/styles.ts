import { makeStyles } from '@material-ui/core/styles';

export const useReferenceEditorStyles = makeStyles((theme) => ({
  refSelectionList: {
    width: 450,
    height: 270,
    overflow: 'auto'
  },
  refSelectionListItem: {
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    lineHeight: '24px',
    margin: theme.spacing(0, 1.5),
    border: 'solid 1px rgba(0, 0, 0, 0.23)',
    borderBottom: 'none',
    '&:last-child': {
      borderBottom: 'solid 1px rgba(0, 0, 0, 0.23)',
      marginBottom: theme.spacing(1.5)
    }
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
