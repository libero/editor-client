import React, { useCallback } from 'react';
import { Affiliation } from 'app/models/affiliation';
import { useDispatch } from 'react-redux';
import { AffiliationFormDialog } from 'app/containers/affiliation-form-dialog/affiliation-form-dialog';
import { Person } from 'app/models/person';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { linkAffiliationsAction } from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';

interface ConnectedAffiliationsFormDialogProps {
  affiliation: Affiliation;
}

export const ConnectedAffiliationsFormDialog: React.FC<ConnectedAffiliationsFormDialogProps> = ({ affiliation }) => {
  const dispatch = useDispatch();
  const isNewAffiliation = !affiliation;

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleAccept = useCallback(
    (affiliation: Affiliation, linkedAuthors: Person[]) => {
      if (isNewAffiliation) {
        dispatch(manuscriptActions.addAffiliationAction(affiliation));
      } else {
        dispatch(manuscriptActions.updateAffiliationAction(affiliation));
      }
      dispatch(linkAffiliationsAction({ affiliation, authors: linkedAuthors }));
      closeDialog();
    },
    [closeDialog, dispatch, isNewAffiliation]
  );

  const handleDelete = useCallback(
    (affiliation: Affiliation) => {
      dispatch(manuscriptActions.deleteAffiliationAction(affiliation));
      closeDialog();
    },
    [closeDialog, dispatch]
  );

  return (
    <AffiliationFormDialog
      affiliation={affiliation}
      onAccept={handleAccept}
      onDelete={handleDelete}
      onCancel={closeDialog}
    />
  );
};
