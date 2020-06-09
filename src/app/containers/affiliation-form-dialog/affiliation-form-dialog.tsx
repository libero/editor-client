import React, { SyntheticEvent, useCallback, useState } from 'react';
import { TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { set, cloneDeep } from 'lodash';

import { useAffiliationFormStyles } from './styles';
import { PromptDialog } from 'app/components/prompt-dialog';
import { ActionButton } from 'app/components/action-button';
import { Affiliation, createAffiliation } from 'app/models/affiliation';
import { getAffiliatedAuthors, getAuthors } from 'app/selectors/manuscript.selectors';
import { LinkedAuthorsList } from 'app/containers/affiliation-form-dialog/linked-authors-list';
import { Person } from 'app/models/person';

interface AffiliationFormDialogProps {
  affiliation?: Affiliation;
  onAccept: (affiliation: Affiliation, linkedAuthors: Person[]) => void;
  onCancel: () => void;
  onDelete: (affiliation: Affiliation) => void;
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
  const isNewAffiliation = !props.affiliation;

  const affiliatedAuthors = useSelector(getAffiliatedAuthors)(props.affiliation?.id);
  const [userLinkedAuthors, setUserLinkedAuthors] = useState<Person[]>(affiliatedAuthors);
  const allAuthors = useSelector(getAuthors);

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
  const [isConfirmShown, setConfirmShow] = useState<boolean>(false);

  const classes = useAffiliationFormStyles();

  const handleDelete = useCallback(() => {
    setConfirmShow(true);
  }, [setConfirmShow]);

  const handleAcceptDeletion = useCallback(() => {
    setConfirmShow(false);
    props.onDelete(affiliation);
  }, [setConfirmShow, affiliation, props]);

  const handleRejectDeletion = useCallback(() => {
    setConfirmShow(false);
  }, [setConfirmShow]);

  const handleLinkedAuthorsChange = useCallback((authors: Person[]) => {
    setUserLinkedAuthors(authors);
  }, []);

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
    props.onAccept(affiliation, userLinkedAuthors);
  }, [props, affiliation, userLinkedAuthors]);

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
      <LinkedAuthorsList
        linkedAuthors={userLinkedAuthors}
        allAuthors={allAuthors}
        onChange={handleLinkedAuthorsChange}
      />
      <div className={classes.buttonPanel}>
        {!isNewAffiliation ? (
          <ActionButton variant="outlinedWarning" onClick={handleDelete} title="Delete" />
        ) : undefined}
        <div aria-hidden={true} className={classes.spacer}></div>
        <ActionButton variant="secondaryOutlined" onClick={props.onCancel} title="Cancel" />
        <ActionButton variant="primaryContained" onClick={handleDone} title="Done" />
      </div>
      {isConfirmShown
        ? renderConfirmDialog(
            'You are deleting an affiliation',
            'Deleting an affiliation will remove all associated links with authors. Are you sure want to proceed?',
            handleAcceptDeletion,
            handleRejectDeletion
          )
        : undefined}
    </section>
  );
};