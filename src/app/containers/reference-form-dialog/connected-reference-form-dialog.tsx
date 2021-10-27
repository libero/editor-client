import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import * as manuscriptActions from '../../actions/manuscript.actions';
import * as manuscriptEditorActions from '../../actions/manuscript-editor.actions';
import { ReferenceFormDialog } from './reference-form-dialog';
import { Reference } from '../../models/reference';

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
