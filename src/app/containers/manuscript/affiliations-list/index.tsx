import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from 'app/components/section-container';
import { ActionButton } from 'app/components/action-button';
import { getAffiliations } from 'app/selectors/manuscript.selectors';
import { Affiliation } from 'app/models/affiliation';
import { useAffiliationStyles } from './styles';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { ConnectedAffiliationFormDialog } from 'app/containers/affiliation-form-dialog';
import { ComponentWithId } from 'app/types/utility.types';

export const AffiliationsList: React.FC<ComponentWithId> = ({ id }) => {
  const classes = useAffiliationStyles();
  const affiliations = useSelector(getAffiliations);
  const dispatch = useDispatch();

  const editAffiliation = useCallback(
    (aff: Affiliation) => {
      dispatch(
        manuscriptEditorActions.showModalDialog({
          component: ConnectedAffiliationFormDialog,
          props: { affiliation: aff },
          title: 'Edit Affiliation'
        })
      );
    },
    [dispatch]
  );

  const addAffiliation = useCallback(() => {
    dispatch(
      manuscriptEditorActions.showModalDialog({
        component: ConnectedAffiliationFormDialog,
        props: {},
        title: 'Add Affiliation'
      })
    );
  }, [dispatch]);

  const renderAffiliation = (aff: Affiliation): React.ReactNode => (
    <li key={aff.id} className={classes.listItem}>
      <div className={classes.orderLabel}>{affiliations.length > 1 ? `(${aff.label})` : undefined}</div>
      <div className={classes.affiliationInfo}>{aff.getDisplayName()}</div>
      <IconButton classes={{ root: classes.editButton }} onClick={editAffiliation.bind(null, aff)}>
        <EditIcon fontSize="small" />
      </IconButton>
    </li>
  );

  return (
    <section>
      <SectionContainer label="Affiliations" id={id}>
        <ul className={classes.root}>{affiliations.map(renderAffiliation)}</ul>
      </SectionContainer>
      <ActionButton
        title="Add Affiliation"
        variant="addEntity"
        onClick={addAffiliation}
        className={classes.addButton}
      />
    </section>
  );
};
