import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { ReferenceFormDialog } from 'app/containers/reference-form-dialog/reference-form-dialog';
import { Reference } from 'app/models/reference';

interface ConnectedReferenceFormDialogProps {
  reference?: Reference;
}

export const ConnectedReferenceFormDialog: React.FC<ConnectedReferenceFormDialogProps> = (props) => {
  const dispatch = useDispatch();
  const isNewReference = !props.reference;

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleAccept = useCallback(
    (reference: Reference) => {
      if (isNewReference) {
        dispatch(manuscriptActions.addReferenceAction(reference));
      } else {
        dispatch(manuscriptActions.updateReferenceAction(reference));
      }
      closeDialog();
    },
    [closeDialog, dispatch, isNewReference]
  );

  const handleDelete = useCallback(
    (reference: Reference) => {
      dispatch(manuscriptActions.deleteReferenceAction(reference));
      closeDialog();
    },
    [closeDialog, dispatch]
  );

  return (
    <ReferenceFormDialog
      reference={props.reference}
      onAccept={handleAccept}
      onDelete={handleDelete}
      onCancel={closeDialog}
    />
  );
};
