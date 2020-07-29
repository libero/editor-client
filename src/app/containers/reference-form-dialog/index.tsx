import React, { useCallback, useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';

import { createBlankReference, Reference, ReferencePerson, ReferenceType } from 'app/models/reference';
import { Select } from 'app/components/select';
import { useReferenceFormStyles } from 'app/containers/reference-form-dialog/styles';
import { ActionButton } from 'app/components/action-button';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { renderConfirmDialog } from 'app/components/prompt-dialog';
import { ReferenceAuthorsList } from 'app/containers/reference-form-dialog/reference-authors-list';

interface ReferenceFormDialogProps {
  reference?: Reference;
}

export const ReferenceFormDialog: React.FC<ReferenceFormDialogProps> = ({ reference }) => {
  const classes = useReferenceFormStyles();
  const [isConfirmShown, setConfirmSnow] = useState<boolean>(false);
  const isNewReference = !reference;
  const [userReference, setReference] = useState<Reference>(reference || createBlankReference());
  const dispatch = useDispatch();

  const handleReferenceTypeChange = useCallback(
    (event: ChangeEvent<{ name: string; value: ReferenceType }>) => {
      setReference({
        ...userReference,
        type: event.target['value']
      });
    },
    [userReference]
  );

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleAuthorsListChange = useCallback(
    (refAuthors: ReferencePerson[]) => {
      setReference({
        ...userReference,
        authors: refAuthors
      });
    },
    [userReference, setReference]
  );

  const handleDone = useCallback(() => {
    userReference.authors = userReference.authors.filter(
      (author) => author['firstName'] || author['lastName'] || author['groupName']
    );
    if (isNewReference) {
      dispatch(manuscriptActions.addReferenceAction(userReference));
    } else {
      dispatch(manuscriptActions.updateReferenceAction(userReference));
    }
    closeDialog();
  }, [userReference, closeDialog, dispatch, isNewReference]);

  const handleReject = useCallback(() => {
    setConfirmSnow(false);
  }, [setConfirmSnow]);

  const handleDelete = useCallback(() => {
    setConfirmSnow(true);
  }, [setConfirmSnow]);

  const handleAccept = useCallback(() => {
    setConfirmSnow(false);
    dispatch(manuscriptActions.deleteReferenceAction(userReference));
    closeDialog();
  }, [closeDialog, dispatch, userReference]);

  return (
    <section className={classes.root}>
      <Select
        className={classes.inputField}
        name="type"
        test-id={'ref-type'}
        placeholder="Please select"
        fullWidth
        blankValue={undefined}
        label="Reference type"
        value={userReference.type}
        onChange={handleReferenceTypeChange}
        options={[
          { label: 'Journal Article', value: 'journal' },
          { label: 'Periodical Article', value: 'periodical' },
          { label: 'Book', value: 'book' },
          { label: 'Report', value: 'report' },
          { label: 'Data', value: 'data' },
          { label: 'Web Article', value: 'web' },
          { label: 'Pre-print Article', value: 'preprint' },
          { label: 'Software', value: 'software' },
          { label: 'Conference proceedings', value: 'confproc' },
          { label: 'Thesis', value: 'thesis' },
          { label: 'Patent', value: 'patent' }
        ]}
      />
      <ReferenceAuthorsList
        test-id={'ref-authors'}
        refAuthors={userReference.authors}
        onChange={handleAuthorsListChange}
      />
      <div className={classes.buttonPanel}>
        {!isNewReference ? <ActionButton variant="outlinedWarning" onClick={handleDelete} title="Delete" /> : undefined}
        <div aria-hidden={true} className={classes.spacer}></div>
        <ActionButton variant="secondaryOutlined" onClick={closeDialog} title="Cancel" />
        <ActionButton variant="primaryContained" onClick={handleDone} title="Done" />
      </div>
      {isConfirmShown
        ? renderConfirmDialog(
            'You are deleting a reference',
            'Deleting a a reference can leave unlinked citations. Are you sure you want to proceed?',
            handleAccept,
            handleReject
          )
        : undefined}
    </section>
  );
};
