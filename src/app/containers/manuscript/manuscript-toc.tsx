import React from 'react';
import { Drawer, Divider, Hidden, List, ListItem, ListItemText } from '@material-ui/core';
import { useOutlinePanelStyles } from './styles';

export interface ManuscriptTOCProps {
  tocOpen: boolean;
  handleTocToggle(): void;
}

export const ManuscriptTOC: React.FC<ManuscriptTOCProps> = (props) => {
  const classes = useOutlinePanelStyles(props);
  const { tocOpen, handleTocToggle } = props;

  const drawer = (
    <React.Fragment>
      <section className={classes.toolbarPlaceholder} aria-hidden="true">
        <h1 className={classes.title}>Libero Editor</h1>
        <h3 className={classes.version}>v0.0.1</h3>
      </section>
      <Divider />
      <List>
        {['Title', 'Abstract'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );

  const renderContent = (): JSX.Element => (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={tocOpen}
          onClose={handleTocToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );

  return renderContent();
};
