import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer, Divider, Hidden, List, ListItem, ListItemText } from '@material-ui/core';
import classNames from 'classnames';

import { useOutlinePanelStyles } from './styles';
import { getArticleInformation } from 'app/selectors/manuscript.selectors';

export interface ManuscriptTOCProps {
  tocOpen: boolean;
  handleTocToggle(): void;
}

export const ManuscriptTOC: React.FC<ManuscriptTOCProps> = (props) => {
  const classes = useOutlinePanelStyles(props);
  const { tocOpen, handleTocToggle } = props;

  const articleInfo = useSelector(getArticleInformation);

  const drawer = (
    <React.Fragment>
      <section className={classes.toolbarPlaceholder} aria-hidden="true">
        <h1 className={classes.title}>Libero Editor</h1>
        <h3 className={classes.infoText}>Software: v{process.env.REACT_APP_VERSION}</h3>
        <h3 className={classNames(classes.infoText, classes.dtd)}>JATS: {articleInfo.dtd} DTD</h3>
        <h3 className={classes.infoText}>Type: {articleInfo.articleType}</h3>
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
