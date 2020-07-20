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
  toolButtonsGroup: {
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius
    }
  },
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
  menuButtonToggled: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
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
    flexGrow: 0,
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1.5),
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    color: 'rgba(0,0,0,0.54)',
    'font-size': '20px',
    'font-weight': '500',
    'line-height': '32px'
  },
  infoText: {
    color: 'rgba(0,0,0,0.54)',
    'font-size': '12px',
    lineHeight: '19px',
    'font-weight': '400'
  },

  dtd: {
    marginTop: theme.spacing(1)
  }
}));
