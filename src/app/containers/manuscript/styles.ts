import { makeStyles } from '@material-ui/core/styles';

const tocWidth = 240;

export const useManuscriptStyles = makeStyles((theme) => ({
  content: {
    maxWidth: 700,
    width: '100%',
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: tocWidth
    }
  },
  editorSection: {
    marginTop: 24
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
    ...theme.mixins.toolbar
  }
}));
