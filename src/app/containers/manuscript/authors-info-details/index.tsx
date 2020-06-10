import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from 'app/components/section-container';
import { getAuthors } from 'app/selectors/manuscript.selectors';
import { getAuthorDisplayName, Person } from 'app/models/person';
import OrcidIcon from 'app/assets/orcid-icon.svg';
import {
  useAuthorDetailStyles,
  useAuthorsDetailsListStyles
} from 'app/containers/manuscript/authors-info-details/styles';
import { ActionButton } from 'app/components/action-button';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { AuthorFormDialog } from 'app/containers/author-form-dialog';

export const AuthorsInfoDetails: React.FC = () => {
  const authors = useSelector(getAuthors);
  const classes = useAuthorsDetailsListStyles();
  const dispatch = useDispatch();

  const addAuthor = useCallback(() => {
    dispatch(
      manuscriptEditorActions.showModalDialog({
        component: AuthorFormDialog,
        title: 'Add Author'
      })
    );
  }, [dispatch]);

  return (
    <section>
      <SectionContainer label="Author Information">
        {authors.map((author) => (
          <AuthorInfo key={author.id} author={author} />
        ))}
      </SectionContainer>
      <ActionButton variant="addEntity" title="Author" onClick={addAuthor} className={classes.addAuthorButton} />
    </section>
  );
};

interface AuthorInfoProps {
  author: Person;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ author }) => {
  const classes = useAuthorDetailStyles();
  const dispatch = useDispatch();

  const editAuthor = useCallback(() => {
    dispatch(
      manuscriptEditorActions.showModalDialog({
        component: AuthorFormDialog,
        props: { author },
        title: 'Edit Author'
      })
    );
  }, [author, dispatch]);

  return (
    <section className={classes.root}>
      <div>
        <div className={classes.authorInfoLine}>
          <strong> {getAuthorDisplayName(author)} </strong>
        </div>
        <div className={classes.authorInfoLine}>
          Neuroscience Interdepartmental Program, University of California, Los Angeles, United States
        </div>
        <div className={classes.authorInfoLine}>
          <img src={OrcidIcon} alt="orcid icon" className={classes.orcidIcon} /> 0000-0001-5000-0007
        </div>
        <div className={classes.authorInfoLine}> No Competing interest declared </div>
      </div>
      <IconButton classes={{ root: classes.editButton }} onClick={editAuthor}>
        <EditIcon fontSize="small" />
      </IconButton>
    </section>
  );
};
