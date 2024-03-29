import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from '../../../components/section-container';
import { ActionButton } from '../../../components/action-button';
import { getReferences } from '../../../selectors/manuscript.selectors';
import { Reference } from '../../../models/reference';
import { useReferencesListItemStyles, useReferencesListStyles } from './styles';
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
} from './reference-renderers';
import * as manuscriptEditorActions from '../../../actions/manuscript-editor.actions';
import { ConnectedReferenceFormDialog } from '../../reference-form-dialog/connected-reference-form-dialog';
import { ComponentWithId } from '../../../types/utility.types';

interface ReferenceItemProps {
  onEditCallback: (reference: Reference) => void;
  reference: Reference;
}

const renderReferenceContent = (reference: Reference): React.ReactNode => {
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

export const ReferenceList: React.FC<ComponentWithId> = ({ id }) => {
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
      <SectionContainer label="References" id={id}>
        <ul className={classes.list}>
          {references.map((reference) => (
            <ReferenceItem key={reference.id} reference={reference} onEditCallback={handleEditReference} />
          ))}
        </ul>
      </SectionContainer>
      <ActionButton variant="addEntity" title="Add Reference" onClick={handleAddReference} />
    </section>
  );
};
