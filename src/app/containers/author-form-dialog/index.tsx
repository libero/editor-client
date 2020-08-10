import React, { SyntheticEvent, useCallback, useState, ChangeEvent } from 'react';
import { TextField, FormControlLabel, Checkbox, InputAdornment } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Transaction } from 'prosemirror-state';

import { useAuthorFormStyles } from './styles';
import { createAuthor, createBioEditorState, Person } from 'app/models/person';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { renderConfirmDialog } from 'app/components/prompt-dialog';
import { ActionButton } from 'app/components/action-button';
import { LinkedAffiliationsList } from './linked-affiliations-list';
import { getAffiliations, getAuthorAffiliations } from 'app/selectors/manuscript.selectors';
import { Affiliation } from 'app/models/affiliation';
import { RichTextInput } from 'app/components/rich-text-input';
import { OrcidIcon } from 'app/assets/icons';
import { Select } from 'app/components/select';
import { ValueOf } from 'app/utils/types';
import {objectsEqual} from "app/utils/view.utils";

interface AuthorFormDialogProps {
  author?: Person;
}

const labelProps = { shrink: true };

export const AuthorFormDialog: React.FC<AuthorFormDialogProps> = (props) => {
  const dispatch = useDispatch();
  const isNewAuthor = !props.author;

  const [author, setAuthor] = useState<Person>(
    props.author || createAuthor(undefined, { firstName: '', lastName: '', bio: createBioEditorState() })
  );
  const [isConfirmShown, setConfirmShow] = useState<boolean>(false);

  const allAffiliations = useSelector(getAffiliations);
  const linkedAffiliations = useSelector(getAuthorAffiliations)(author);
  const classes = useAuthorFormStyles();

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    setConfirmShow(true);
  }, [setConfirmShow]);

  const handleAccept = useCallback(() => {
    setConfirmShow(false);
    dispatch(manuscriptActions.deleteAuthorAction(author));
    closeDialog();
  }, [setConfirmShow, author, closeDialog, dispatch]);

  const updateAuthorInfo = useCallback(
    (fieldName: string, value: ValueOf<Person>) => {
      setAuthor({ ...author, [fieldName]: value });
    },
    [author, setAuthor]
  );

  const handleAffiliationsUpdate = useCallback(
    (affiliations: Affiliation[]) => {
      updateAuthorInfo(
        'affiliations',
        affiliations.map(({ id }) => id)
      );
    },
    [updateAuthorInfo]
  );

  const handleReject = useCallback(() => {
    setConfirmShow(false);
  }, [setConfirmShow]);

  const handleFormChange = useCallback(
    (event: SyntheticEvent) => updateAuthorInfo(event.target['name'], event.target['value']),
    [updateAuthorInfo]
  );

  const handleCorrespondingStatusChange = useCallback(
    (event: SyntheticEvent) => updateAuthorInfo('isCorrespondingAuthor', event.target['checked']),
    [updateAuthorInfo]
  );

  const handleCompetingInterestChange = useCallback(
    (event: ChangeEvent<{ name: string; value: boolean }>) =>
      updateAuthorInfo('hasCompetingInterest', event.target['value']),
    [updateAuthorInfo]
  );

  const handleBioChange = useCallback(
    (change: Transaction) => {
      updateAuthorInfo('bio', author.bio.apply(change));
    },
    [updateAuthorInfo, author]
  );

  const handleOrcidChange = useCallback(
    (event: SyntheticEvent) => {
      const newValue = event.target['value'];
      setAuthor({
        ...author,
        orcid: newValue,
        isAuthenticated: author.isAuthenticated && props.author.orcid === newValue
      });
    },
    [setAuthor, author, props]
  );

  const handleDone = useCallback(() => {
    if (isNewAuthor) {
      dispatch(manuscriptActions.addAuthorAction(author));
    } else if (!objectsEqual(author, props.author)) {
      dispatch(manuscriptActions.updateAuthorAction(author));
    }
    closeDialog();
  }, [author, closeDialog, dispatch, isNewAuthor, props.author]);

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
      <Select
        className={classes.inputField}
        name="articleType"
        placeholder="Please select"
        fullWidth
        blankValue={undefined}
        label="Competing interest"
        value={author.hasCompetingInterest}
        onChange={handleCompetingInterestChange}
        options={[
          { label: 'No competing interest', value: false },
          { label: 'Has competing interest', value: true }
        ]}
      />
      {author.hasCompetingInterest ? (
        <TextField
          name="competingInterestStatement"
          fullWidth
          label="Competing interest statement"
          classes={{ root: classes.inputField }}
          InputLabelProps={labelProps}
          variant="outlined"
          value={author.competingInterestStatement || ''}
          onChange={handleFormChange}
        />
      ) : undefined}
      <RichTextInput
        editorState={author.bio}
        name="bio"
        onChange={handleBioChange}
        label="Bio"
        className={classes.inputField}
      />
      <TextField
        name="orcid"
        fullWidth
        label="Orcid"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        InputProps={{
          startAdornment: author.isAuthenticated ? (
            <InputAdornment position="start">
              <OrcidIcon />
            </InputAdornment>
          ) : undefined
        }}
        value={author.orcid || ''}
        onChange={handleOrcidChange}
      />
      <LinkedAffiliationsList
        allAffiliations={allAffiliations}
        linkedAffiliations={linkedAffiliations}
        onChange={handleAffiliationsUpdate}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="isCorrespondingAuthor"
            color="primary"
            onChange={handleCorrespondingStatusChange}
            checked={author.isCorrespondingAuthor}
          />
        }
        label="Corresponding author"
        classes={{ root: classes.correspondingAuthorCheckbox }}
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
