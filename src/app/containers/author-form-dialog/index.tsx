import React, { SyntheticEvent, useCallback, useState } from 'react';
import { TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { useAuthorFormStyles } from './styles';
import { createAuthor, Person } from 'app/models/person';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { PromptDialog } from 'app/components/prompt-dialog';
import { ActionButton } from 'app/components/action-button';
import { LinkedAffiliationsList } from './linked-affiliations-list';
import { getAffiliations, getAuthorAffiliations } from 'app/selectors/manuscript.selectors';
import { Affiliation } from 'app/models/affiliation';

interface AuthorFormDialogProps {
  author?: Person;
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

export const AuthorFormDialog: React.FC<AuthorFormDialogProps> = (props) => {
  const dispatch = useDispatch();
  const isNewAuthor = !props.author;

  const [author, setAuthor] = useState<Person>(
    props.author || createAuthor(undefined, { firstName: '', lastName: '' })
  );
  const [isConfirmShown, setConfirmSnow] = useState<boolean>(false);

  const allAffiliations = useSelector(getAffiliations);
  const linkedAffiliations = useSelector(getAuthorAffiliations)(author);
  const classes = useAuthorFormStyles();

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    setConfirmSnow(true);
  }, [setConfirmSnow]);

  const handleAccept = useCallback(() => {
    setConfirmSnow(false);
    dispatch(manuscriptActions.deleteAuthorAction(author));
    closeDialog();
  }, [setConfirmSnow, author, closeDialog, dispatch]);

  const handleAffiliationsUpdate = useCallback(
    (affiliations: Affiliation[]) => {
      author.affiliations = affiliations.map(({ id }) => id);
    },
    [author]
  );

  const handleReject = useCallback(() => {
    setConfirmSnow(false);
  }, [setConfirmSnow]);

  const handleFormChange = useCallback(
    (event: SyntheticEvent) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      setAuthor({
        ...author,
        [fieldName]: newValue
      });
    },
    [author, setAuthor]
  );

  const handleDone = useCallback(() => {
    if (isNewAuthor) {
      dispatch(manuscriptActions.addAuthorAction(author));
    } else {
      dispatch(manuscriptActions.updateAuthorAction(author));
    }
    closeDialog();
  }, [author, closeDialog, dispatch, isNewAuthor]);

  return (
    <section className={classes.root}>
      <TextField
        fullWidth
        name="firstName"
        label="Given name(s)"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={author.firstName}
        onChange={handleFormChange}
      />
      <TextField
        fullWidth
        name="lastName"
        label="Surname(s)"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={author.lastName}
        onChange={handleFormChange}
      />
      <TextField
        name="suffix"
        label="Suffix"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={author.suffix || ''}
        onChange={handleFormChange}
      />
      <TextField
        name="email"
        fullWidth
        label="Email"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={author.email || ''}
        onChange={handleFormChange}
      />
      <LinkedAffiliationsList
        allAffiliations={allAffiliations}
        linkedAffiliations={linkedAffiliations}
        onChange={handleAffiliationsUpdate}
      />
      <div className={classes.buttonPanel}>
        {!isNewAuthor ? <ActionButton variant="outlinedWarning" onClick={handleDelete} title="Delete" /> : undefined}
        <div aria-hidden={true} className={classes.spacer}></div>
        <ActionButton variant="secondaryOutlined" onClick={closeDialog} title="Cancel" />
        <ActionButton variant="primaryContained" onClick={handleDone} title="Done" />
      </div>
      {isConfirmShown
        ? renderConfirmDialog(
            'You are deleting an author',
            'Deleting an author can leave unlinked affiliation and funding information. Are you sure you want to proceed?',
            handleAccept,
            handleReject
          )
        : undefined}
    </section>
  );
};
