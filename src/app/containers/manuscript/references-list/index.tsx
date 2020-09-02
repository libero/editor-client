import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from 'app/components/section-container';
import { ActionButton } from 'app/components/action-button';
import { getReferences } from 'app/selectors/manuscript.selectors';
import { Reference } from 'app/models/reference';
import { useReferencesListItemStyles, useReferencesListStyles } from 'app/containers/manuscript/references-list/styles';
import {
  renderBookReference,
  renderConferenceReference,
  renderDataReference,
  renderJournalReference,
  renderPatentReference,
  renderPeriodicalReference,
  renderPreprintReference,
  renderReportReference,
  renderSoftwareReference,
  renderThesisReference,
  renderWebReference
} from 'app/containers/manuscript/references-list/reference-renderers';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { ConnectedReferenceFormDialog } from 'app/containers/reference-form-dialog/connected-reference-form-dialog';

interface ReferenceItemProps {
  onEditCallback: (reference: Reference) => void;
  reference: Reference;
}

const renderReferenceContent = (reference: Reference) => {
  switch (reference.type) {
    case 'journal':
      return renderJournalReference(reference);
    case 'book':
      return renderBookReference(reference);
    case 'report':
      return renderReportReference(reference);
    case 'periodical':
      return renderPeriodicalReference(reference);
    case 'patent':
      return renderPatentReference(reference);
    case 'web':
      return renderWebReference(reference);
    case 'preprint':
      return renderPreprintReference(reference);
    case 'data':
      return renderDataReference(reference);
    case 'confproc':
      return renderConferenceReference(reference);
    case 'software':
      return renderSoftwareReference(reference);
    case 'thesis':
      return renderThesisReference(reference);
  }
};

const ReferenceItem: React.FC<ReferenceItemProps> = ({ onEditCallback, reference }) => {
  const classes = useReferencesListItemStyles();

  return (
    <li>
      <section className={classes.listItem}>
        <div className={classes.content}>{renderReferenceContent(reference)}</div>
        <IconButton onClick={onEditCallback.bind(null, reference)} classes={{ root: classes.editButton }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </section>
    </li>
  );
};

export const ReferenceList: React.FC<{}> = () => {
  const references = useSelector(getReferences);
  const classes = useReferencesListStyles();
  const dispatch = useDispatch();

  const handleAddReference = useCallback(() => {
    dispatch(
      manuscriptEditorActions.showModalDialog({
        component: ConnectedReferenceFormDialog,
        title: 'Reference'
      })
    );
  }, [dispatch]);

  const handleEditReference = useCallback(
    (reference: Reference) => {
      dispatch(
        manuscriptEditorActions.showModalDialog({
          component: ConnectedReferenceFormDialog,
          title: 'Reference',
          props: { reference }
        })
      );
    },
    [dispatch]
  );

  return (
    <section>
      <SectionContainer label="References">
        <ul className={classes.list}>
          {references.map((reference) => (
            <ReferenceItem key={reference.id} reference={reference} onEditCallback={handleEditReference} />
          ))}
        </ul>
      </SectionContainer>
      <ActionButton variant="addEntity" title="Reference" onClick={handleAddReference} />
    </section>
  );
};
