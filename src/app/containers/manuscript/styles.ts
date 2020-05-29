import { makeStyles } from '@material-ui/core/styles';

const tocWidth = 240;

export const useManuscriptStyles = makeStyles((theme) => ({
  content: {
    maxWidth: 700 + tocWidth,
    boxSizing: 'border-box',
    width: '100%',
    padding: theme.spacing(2),
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: tocWidth + theme.spacing(2)
    },
    '& > *': {
      marginTop: 24
    },
    '& > *:first-child': {
      marginTop: 0
    }
  },
  toolbarPlaceholder: {
    ...theme.mixins.toolbar
  }
}));

export const useToolbarStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${tocWidth}px)`
    }
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: {
    ...theme.mixins.toolbar
  }
}));

export const useOutlinePanelStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: tocWidth
    }
  },
  drawerPaper: {
    width: tocWidth
  },
  toolbarPlaceholder: {
    ...theme.mixins.toolbar,
    display: 'flex',
    'flex-grow': 1,
    'max-height': '64px',
    'align-items': 'flex-start',
    'padding-left': '16px',
    'flex-direction': 'column',
    'justify-content': 'center'
  },
  title: {
    color: 'rgba(0,0,0,0.54)',
    'margin-bottom': 4,
    'font-size': '20px',
    'font-weight': '500',
    'line-height': '32px'
  },
  version: {
    color: 'rgba(0,0,0,0.54)',
    'font-size': '12px',
    'font-weight': '400'
  }
}));
