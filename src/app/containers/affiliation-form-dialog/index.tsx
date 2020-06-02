import React, { SyntheticEvent, useCallback, useState } from 'react';
import { TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { set, cloneDeep } from 'lodash';

import { useAffiliationFormStyles } from './styles';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { PromptDialog } from 'app/components/prompt-dialog';
import { ActionButton } from 'app/components/action-button';
import { Affiliation, createAffiliation } from 'app/models/affiliation';

interface AffiliationFormDialogProps {
  affiliation?: Affiliation;
}

const renderConfirmDialog = (title: string, msg: string, onAccept: () => void, onReject: () => void) => {
  return (
    <PromptDialog
      title={title}
      message={msg}
      isOpen={true}
      onAccept={onAccept}
      onReject={onReject}
      acceptLabel="Delete"
      rejectLabel="Cancel"
      acceptVariant="containedWarning"
      rejectVariant="secondaryOutlined"
    />
  );
};

const labelProps = { shrink: true };

export const AffiliationFormDialog: React.FC<AffiliationFormDialogProps> = (props) => {
  const dispatch = useDispatch();
  const isNewAffiliation = !props.affiliation;

  const [affiliation, setAffiliation] = useState<Affiliation>(
    props.affiliation ||
      createAffiliation(undefined, {
        label: '',
        institution: {
          department: '',
          name: ''
        },
        address: {
          city: ''
        },
        country: ''
      })
  );
  const [isConfirmShown, setConfirmSnow] = useState<boolean>(false);

  const classes = useAffiliationFormStyles();

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    setConfirmSnow(true);
  }, [setConfirmSnow]);

  const handleAccept = useCallback(() => {
    setConfirmSnow(false);
    dispatch(manuscriptActions.deleteAffiliationAction(affiliation));
    closeDialog();
  }, [setConfirmSnow, affiliation, closeDialog, dispatch]);

  const handleReject = useCallback(() => {
    setConfirmSnow(false);
  }, [setConfirmSnow]);

  const handleFormChange = useCallback(
    (event: SyntheticEvent) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      const newAffiliation = set(cloneDeep(affiliation), fieldName, newValue);
      setAffiliation(newAffiliation);
    },
    [affiliation, setAffiliation]
  );

  const handleDone = useCallback(() => {
    if (isNewAffiliation) {
      dispatch(manuscriptActions.addAffiliationAction(affiliation));
    } else {
      dispatch(manuscriptActions.updateAffiliationAction(affiliation));
    }
    closeDialog();
  }, [affiliation, closeDialog, dispatch, isNewAffiliation]);

  return (
    <section className={classes.root}>
      <TextField
        fullWidth
        name="institution.department"
        label="Department"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={affiliation.institution.department}
        onChange={handleFormChange}
      />
      <TextField
        fullWidth
        name="institution.name"
        label="Institute"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={affiliation.institution.name}
        onChange={handleFormChange}
      />
      <TextField
        name="address.city"
        label="City"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={affiliation.address.city}
        onChange={handleFormChange}
      />
      <TextField
        name="country"
        fullWidth
        label="Country"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={affiliation.country}
        onChange={handleFormChange}
      />
      <div className={classes.buttonPanel}>
        {!isNewAffiliation ? (
          <ActionButton variant="outlinedWarning" onClick={handleDelete} title="Delete" />
        ) : undefined}
        <div aria-hidden={true} className={classes.spacer}></div>
        <ActionButton variant="secondaryOutlined" onClick={closeDialog} title="Cancel" />
        <ActionButton variant="primaryContained" onClick={handleDone} title="Done" />
      </div>
      {isConfirmShown
        ? renderConfirmDialog(
            'You are deleting an affiliation',
            'Deleting an affiliation can leave unlinked authors information. Are you sure you want to proceed?',
            handleAccept,
            handleReject
          )
        : undefined}
    </section>
  );
};
