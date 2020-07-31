import React, { useCallback, useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { get, set } from 'lodash';

import { createBlankReference, Reference, ReferencePerson, ReferenceType } from 'app/models/reference';
import { Select } from 'app/components/select';
import { useReferenceFormStyles } from 'app/containers/reference-form-dialog/styles';
import { ActionButton } from 'app/components/action-button';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { renderConfirmDialog } from 'app/components/prompt-dialog';
import { ReferenceAuthorsList } from 'app/containers/reference-form-dialog/reference-authors-list';
import { getFormConfigForType } from 'app/containers/reference-form-dialog/referenc-forms.config';
import { renderFormControl } from 'app/containers/reference-form-dialog/reference-form-renderer';

interface ReferenceFormDialogProps {
  reference?: Reference;
}

export const ReferenceFormDialog: React.FC<ReferenceFormDialogProps> = ({ reference }) => {
  const classes = useReferenceFormStyles();
  const [isConfirmShown, setConfirmShow] = useState<boolean>(false);
  const isNewReference = !reference;
  const [userReference, setReference] = useState<Reference>(reference || createBlankReference());
  const dispatch = useDispatch();

  const handleReferenceTypeChange = useCallback(
    (event: ChangeEvent<{ name: string; value: ReferenceType }>) => {
      const newRef = {
        ...userReference,
        type: event.target['value']
      };
      if (!newRef.referenceInfo) {
        set(newRef, 'referenceInfo', {});
      }

      setReference(newRef);
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

  const handleRefInfoChange = useCallback(
    (name, value) => {
      setReference({
        ...userReference,
        referenceInfo: {
          ...userReference.referenceInfo,
          [name]: value
        }
      });
    },
    [userReference]
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
    setConfirmShow(false);
  }, [setConfirmShow]);

  const handleDelete = useCallback(() => {
    setConfirmShow(true);
  }, [setConfirmShow]);

  const handleAccept = useCallback(() => {
    setConfirmShow(false);
    dispatch(manuscriptActions.deleteReferenceAction(userReference));
    closeDialog();
  }, [closeDialog, dispatch, userReference]);

  const formConfig = getFormConfigForType(userReference.type);
  const form = formConfig
    ? Object.entries(formConfig).map(([key, config]) => {
        return renderFormControl(
          config.type,
          config.label,
          key,
          classes.inputField,
          get(userReference, `referenceInfo.${key}`),
          handleRefInfoChange
        );
      })
    : undefined;

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
      {form}
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
