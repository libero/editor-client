import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core';

export const makeProsemirrorStyles = makeStyles((theme) => ({
  keywordsEditor: {
    padding: theme.spacing(0.5, 1, 1, 1),
    border: `solid 1px`,
    borderColor: theme.palette.secondary.dark,
    borderRadius: theme.spacing(0.5),
    boxSizing: 'border-box',
    '&:focus': {
      outline: 'none',
      borderColor: theme.palette.primary.light,
      '&>legend': {
        color: theme.palette.primary.main
      }
    }
  },

  label: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0, 0.5)
  },

  keywordsSection: {
    display: 'flex',
    flexFlow: 'wrap',
    cursor: 'text'
  },

  newKeywordEditor: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0.5, 0.5, 1.5),
    '& .ProseMirror': {
      flex: 1
    }
  }
}));

export const useKeywordStyles = makeStyles((theme) => ({
  keyword: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    whiteSpace: 'nowrap',
    margin: theme.spacing(0.25, 0.5),
    fontSize: '0.9rem',
    padding: theme.spacing(0.5, 0.5, 0.5, 1.5),
    borderRadius: 16,
    '&.focused': {
      background: 'transparent',
      color: theme.palette.text.primary
    }
  },

  deleteIcon: {
    WebkitTapHighlightColor: 'transparent',
    color: fade(theme.palette.primary.contrastText, 0.7),
    height: 20,
    width: 20,
    cursor: 'pointer',
    '&:hover, &:active, &:focus': {
      color: theme.palette.primary.contrastText
    }
  }
}));
