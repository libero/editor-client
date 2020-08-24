import { makeStyles } from '@material-ui/core/styles';

export const useReferenceEditorStyles = makeStyles((theme) => ({
  refSelectionList: {
    width: 450,
    height: 270
  },

  refSelectionListItem: {
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    lineHeight: '24px',
    margin: theme.spacing(1.5),
    border: 'solid 1px rgba(0, 0, 0, 0.23)'
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
