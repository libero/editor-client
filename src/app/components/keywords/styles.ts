import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core';

export const makeKeywordContainerStyles = makeStyles((theme) => ({
  keywordsEditor: {
    padding: theme.spacing(0.5, 1, 1, 1),
    border: `solid 1px`,
    borderColor: theme.palette.secondary.dark,
    borderRadius: theme.spacing(0.5),
    boxSizing: 'border-box',
    '&:focus': {
      outline: 'none',
      borderColor: theme.palette.primary.light,
      '& > legend': {
        color: theme.palette.primary.main
      }
    }
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
    whiteSpace: 'nowrap',
    margin: theme.spacing(0.25, 1, 0.25, 0),
    fontSize: '0.9rem',
    padding: theme.spacing(0.5, 0.5, 0.5, 1.5),
    borderRadius: 16,

    '& .ProseMirror': {
      color: theme.palette.primary.contrastText
    },

    '&.focused': {
      background: 'transparent',
      '& .ProseMirror': {
        color: theme.palette.text.primary
      }
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
