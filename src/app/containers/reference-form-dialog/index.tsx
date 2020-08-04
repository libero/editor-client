import React, { useCallback, useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { get, has, pick } from 'lodash';
import DeleteIcon from '@material-ui/icons/Delete';
import classNames from 'classnames';
import { IconButton } from '@material-ui/core';
import { EditorState } from 'prosemirror-state';

import {
  createBlankReference,
  Reference,
  ReferenceContributor,
  ReferenceType,
  createEmptyRefInfoByType,
  ReferenceInfoType
} from 'app/models/reference';
import { Select } from 'app/components/select';
import { useReferenceFormStyles } from 'app/containers/reference-form-dialog/styles';
import { ActionButton } from 'app/components/action-button';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { renderConfirmDialog } from 'app/components/prompt-dialog';
import { ReferenceContributorsList } from 'app/containers/reference-form-dialog/reference-contributors-list';
import {
  FormControlConfigType,
  getFormConfigForType
} from 'app/containers/reference-form-dialog/referenc-forms.config';
import { renderFormControl } from 'app/containers/reference-form-dialog/reference-form-renderer';
import { SectionContainer } from 'app/components/section-container';
import refFormGrid from './ref-form-grid.module.scss';

interface ReferenceFormDialogProps {
  reference?: Reference;
}

export const ReferenceFormDialog: React.FC<ReferenceFormDialogProps> = ({ reference }) => {
  const classes = useReferenceFormStyles();
  const [isConfirmShown, setConfirmShow] = useState<boolean>(false);
  const isNewReference = !reference;
  const [userReference, setReference] = useState<Reference>(reference || createBlankReference());
  const [missingFieldsInfo, setMissingFieldsInfo] = useState<Partial<ReferenceInfoType>>({});
  const [missingFieldsConfig, setMissingFieldsConfig] = useState<Record<string, FormControlConfigType>>({});
  const dispatch = useDispatch();

  const handleReferenceTypeChange = useCallback(
    (event: ChangeEvent<{ name: string; value: ReferenceType }>) => {
      const newRefInfo = createEmptyRefInfoByType(event.target['value']);
      const newRef = {
        ...userReference,
        type: event.target['value'],
        referenceInfo: transferValues(userReference.referenceInfo, newRefInfo)
      };
      setMissingFieldsInfo(getDiffFieldValues(userReference.referenceInfo, newRefInfo));
      setMissingFieldsConfig(getDiffFieldsConfig(userReference.type, newRef.type));
      setReference(newRef);
    },
    [userReference]
  );

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleAuthorsListChange = useCallback(
    (refAuthors: ReferenceContributor[]) => {
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

  const handleMissingFieldsInfoChange = useCallback(
    (name, value) => {
      setMissingFieldsInfo({
        ...missingFieldsInfo,
        [name]: value
      });
    },
    [missingFieldsInfo]
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

  const handleDeleteRow = useCallback(
    (fieldName: string) => () => {
      const updateMissingFields = { ...missingFieldsInfo };
      delete updateMissingFields[fieldName];
      setMissingFieldsInfo(updateMissingFields);
    },
    [missingFieldsInfo]
  );

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
          classNames(config.className),
          get(userReference, `referenceInfo.${key}`),
          handleRefInfoChange
        );
      })
    : undefined;

  const diffForm = Object.entries(missingFieldsInfo).map(([key, value]) => {
    const config = missingFieldsConfig[key];
    return (
      <div className={classNames(classes.missingFieldsRow, classes.inputField)}>
        {renderFormControl(config.type, config.label, key, '', value, handleMissingFieldsInfoChange)}
        <IconButton classes={{ root: classes.deleteButton }} onClick={handleDeleteRow(key)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    );
  });

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
          { label: 'Book', value: 'book' },
          { label: 'Data', value: 'data' },
          { label: 'Software', value: 'software' },
          { label: 'Preprint', value: 'preprint' },
          { label: 'Web Article', value: 'web' },
          { label: 'Conference proceedings', value: 'confproc' },
          { label: 'Report', value: 'report' },
          { label: 'Thesis', value: 'thesis' },
          { label: 'Patent', value: 'patent' },
          { label: 'Periodical Article', value: 'periodical' }
        ]}
      />
      <ReferenceContributorsList
        className={classes.inputField}
        addCtaLabel={'Author'}
        entityName={'author'}
        test-id={'ref-authors'}
        refContributors={userReference.authors}
        onChange={handleAuthorsListChange}
      />
      <div className={classNames(classes.inputField, refFormGrid.container)}>{form}</div>
      {diffForm.length > 0 ? (
        <div className={classes.missingFieldsSection}>
          <span className={classes.warningMessage}>Unsupported elements for reference type</span>
          {diffForm}
        </div>
      ) : undefined}
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

function transferValues(prevRefInfo: ReferenceInfoType, nextRefInfo: ReferenceInfoType): ReferenceInfoType {
  Object.entries(nextRefInfo).forEach(([key, value]) => {
    nextRefInfo[key] = get(prevRefInfo, key, value);
  });
  return nextRefInfo;
}

function getDiffFieldValues(
  prevRefInfo: ReferenceInfoType,
  nextRefInfo: ReferenceInfoType
): Partial<ReferenceInfoType> {
  const diffKeys = Object.keys(prevRefInfo).filter(
    (key: ReferenceType) => !has(nextRefInfo, key) && !isValueEmpty(prevRefInfo[key])
  );
  return pick(prevRefInfo, diffKeys);
}

function getDiffFieldsConfig(prevType: ReferenceType, nextType: ReferenceType): Record<string, FormControlConfigType> {
  const prevConfig = getFormConfigForType(prevType);
  const nextConfig = getFormConfigForType(nextType);
  const diffKeys = Object.keys(prevConfig).filter((key: ReferenceType) => !has(nextConfig, key));
  return pick(prevConfig, diffKeys);
}

function isValueEmpty(value: EditorState | Array<ReferenceContributor> | string | number): boolean {
  if (value instanceof EditorState) {
    return value.doc && (value.doc.childCount <= 1 || value.doc.firstChild.textContent.trim().length < 0);
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return !value;
}
