import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from 'app/components/section-container';
import { getAuthorAffiliations, getAuthors } from 'app/selectors/manuscript.selectors';
import { getAuthorDisplayName, Person } from 'app/models/person';
import {
  useAuthorDetailStyles,
  useAuthorsDetailsListStyles
} from 'app/containers/manuscript/authors-info-details/styles';
import { ActionButton } from 'app/components/action-button';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { AuthorFormDialog } from 'app/containers/author-form-dialog';
import { isEqual } from 'lodash';
import { stringifyEditorState } from 'app/utils/view.utils';
import { OrcidIcon } from 'app/assets/icons';
import { getAffiliationDisplayName } from 'app/models/affiliation';

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

const AuthorInfo: React.FC<AuthorInfoProps> = React.memo(({ author }) => {
  const classes = useAuthorDetailStyles();
  const dispatch = useDispatch();
  const affiliations = useSelector(getAuthorAffiliations)(author);

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
          {author.isCorrespondingAuthor ? 'Corresponding Author: ' : undefined}
          {author.email}
        </div>
        <div className={classes.authorInfoLine}>
          {affiliations.map((aff) => (
            <div key={aff.id}>{getAffiliationDisplayName(aff)}</div>
          ))}
        </div>
        <div className={classes.authorInfoLine}>
          {author.isAuthenticated ? <OrcidIcon className={classes.orcidIcon} /> : undefined}{' '}
          <a href={`https://orcid.org/${author.orcid}`} target="_blank" rel="noopener noreferrer">
            {author.orcid}
          </a>
        </div>
        <div className={classes.authorInfoLine}>
          {author.hasCompetingInterest
            ? `Competing interest: ${author.competingInterestStatement}`
            : 'No Competing interest declared'}
        </div>
        {author.bio ? (
          <div
            className={classes.authorBio}
            dangerouslySetInnerHTML={{ __html: stringifyEditorState(author.bio) }}
          />
        ) : undefined}
      </div>
      <IconButton classes={{ root: classes.editButton }} onClick={editAuthor}>
        <EditIcon fontSize="small" />
      </IconButton>
    </section>
  );
}, isEqual);
