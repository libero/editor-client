import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer, Divider, Hidden, List, ListItem, ListItemText } from '@material-ui/core';
import classNames from 'classnames';

import { useOutlinePanelStyles } from './styles';
import { getArticleInformation, getJournalMeta } from 'app/selectors/manuscript.selectors';
import { ClearFocus } from 'app/containers/manuscript/clear-focus';

export interface ManuscriptTOCProps {
  tocOpen: boolean;
  handleTocToggle(): void;
}

export const ManuscriptTOC: React.FC<ManuscriptTOCProps> = (props) => {
  const classes = useOutlinePanelStyles(props);
  const { tocOpen, handleTocToggle } = props;

  const articleInfo = useSelector(getArticleInformation);
  const journalMeta = useSelector(getJournalMeta);

  const drawer = (
    <React.Fragment>
      <section className={classes.toolbarPlaceholder} aria-hidden="true">
        <ClearFocus>
          <h1 className={classes.title}>Libero Editor</h1>
          <h3 className={classes.infoText}>Software: v{process.env.REACT_APP_VERSION}</h3>
          <h3 className={classNames(classes.infoText, classes.dtd)}>JATS: {articleInfo.dtd} DTD</h3>
          <h3 className={classes.infoText}>Type: {articleInfo.articleType}</h3>
        </ClearFocus>
      </section>
      <Divider />
      <List classes={{ root: classes.outlineList }}>
        {['Title', 'Abstract'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <ClearFocus className={classes.whiteSpace} />
      <section className={classes.journalMeta}>
        <div>{journalMeta.publisherName}</div>
        <div>ISSN: {journalMeta.issn}</div>
      </section>
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
