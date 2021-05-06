import { makeStyles } from '@material-ui/core/styles';

const tocWidth = 300;

export const useAlertStyles = makeStyles((theme) => ({
  snackBarPosition: {
    top: 76,
    right: 12
  },
  actionButton: {
    color: 'white',
    marginLeft: theme.spacing(2)
  },
  alertIcon: {
    alignItems: 'center'
  }
}));

export const useManuscriptStyles = makeStyles((theme) => ({
  contentWrapper: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: tocWidth + theme.spacing(2)
    }
  },
  content: {
    maxWidth: 700,
    boxSizing: 'border-box',
    width: '100%',
    padding: theme.spacing(5, 2),
    margin: '0 auto'
  },
  spacer: {
    minHeight: 24
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
  spacer: {
    flexGrow: 1
  },
  toolbarMessage: {
    fontSize: '0.75rem',
    lineHeight: '20px',
    color: theme.palette.text.secondary,
    '&.error': {
      color: theme.palette.error.main
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
    flexGrow: 0,
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1.5),
    paddingTop: theme.spacing(1.5),
    flexDirection: 'column',
    justifyContent: 'center'
  },
  whiteSpace: {
    flex: 1
  },
  journalMeta: {
    color: 'rgba(0,0,0,0.54)',
    'font-size': '12px',
    lineHeight: '19px',
    'font-weight': '400',
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  title: {
    color: 'rgba(0,0,0,0.54)',
    'font-size': '20px',
    'font-weight': '700',
    'line-height': '32px'
  },
  infoText: {
    color: 'rgba(0,0,0,0.54)',
    'font-size': '12px',
    lineHeight: '19px',
    'font-weight': '400'
  },

  tocLevel1: {
    lineHeight: '1.4',
    paddingLeft: theme.spacing(1),
    fontSize: '14px',
    fontWeight: 'bold'
  },

  tocLevel2: {
    fontSize: '14px',
    'word-break': 'break-word',
    lineHeight: '1.4',
    marginLeft: theme.spacing(1)
  },

  dtd: {
    marginTop: theme.spacing(1)
  }
}));
