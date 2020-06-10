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

export const AffiliationsList: React.FC<{}> = () => {
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

  const renderAffiliation = (aff: Affiliation) => (
    <div key={aff.id} className={classes.listItem}>
      <div className={classes.orderLabel}>({aff.label})</div>
      <div className={classes.affiliationInfo}>
        {[aff.institution.name, aff.address.city, aff.country].filter((field) => Boolean(field)).join(', ')}
      </div>
      <IconButton classes={{ root: classes.editButton }} onClick={editAffiliation.bind(null, aff)}>
        <EditIcon fontSize="small" />
      </IconButton>
    </div>
  );

  return (
    <section>
      <SectionContainer label="Affiliations">{affiliations.map(renderAffiliation)}</SectionContainer>
      <ActionButton title="Affiliation" variant="addEntity" onClick={addAffiliation} className={classes.addButton} />
    </section>
  );
};
