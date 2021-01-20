import React, { useState, useCallback, useEffect } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { get } from 'lodash';
import { MenuItem, IconButton, Menu } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { ActionButton } from 'app/components/action-button';
import { useAuthorFormStyles } from 'app/containers/author-form-dialog/styles';
import { Affiliation } from 'app/models/affiliation';
import { AffiliationFormDialog } from 'app/containers/affiliation-form-dialog/affiliation-form-dialog';
import { ModalContainer } from 'app/containers/modal-container';
import { ReactFCProps } from 'app/types/utility.types';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { Person } from 'app/models/person';
import { linkAffiliationsAction } from 'app/actions/manuscript.actions';
import { Select } from 'app/components/select';

interface LinkedAffiliationsListProps {
  linkedAffiliations: Affiliation[];
  allAffiliations: Affiliation[];
  onChange: (selectedAffiliations: Affiliation[]) => void;
}

const renderAffiliationModal = (props: ReactFCProps<typeof AffiliationFormDialog>): React.ReactNode => {
  return (
    <ModalContainer
      title={props.affiliation ? 'Edit Affiliation' : 'Add Affiliation'}
      params={props}
      component={AffiliationFormDialog}
    />
  );
};

export const LinkedAffiliationsList: React.FC<LinkedAffiliationsListProps> = (props) => {
  const { linkedAffiliations, allAffiliations, onChange } = props;
  const classes = useAuthorFormStyles();
  const [userLinkedAffiliations, setUserLinkedAffiliations] = useState<Affiliation[]>([]);

  const [isAffiliationDialogShown, setAffiliationDialogShown] = useState<boolean>(false);
  const [editedAffiliation, setEditedAffiliation] = useState<Affiliation>(undefined);
  const [activeAffiliationIndex, setActiveAffiliationIndex] = useState<number>(-1);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userLinkedAffiliations.length) {
      setUserLinkedAffiliations(linkedAffiliations.length > 0 ? linkedAffiliations : [null]);
    }
  }, [linkedAffiliations, props, userLinkedAffiliations.length]);

  const triggerOnChange = useCallback(
    (affiliationsList) => {
      onChange(affiliationsList.filter((author) => Boolean(author)));
    },
    [onChange]
  );

  const handleAffiliationModalCancel = useCallback(() => {
    setAffiliationDialogShown(false);
  }, [setAffiliationDialogShown]);

  const handleAffiliationModalAccept = useCallback(
    (affiliation: Affiliation, linkedAuthors: Person[]) => {
      if (!editedAffiliation) {
        dispatch(manuscriptActions.addAffiliationAction(affiliation));
      } else {
        dispatch(manuscriptActions.updateAffiliationAction(affiliation));
      }

      dispatch(linkAffiliationsAction({ affiliation, authors: linkedAuthors }));

      const updatedList = [...userLinkedAffiliations];
      updatedList[activeAffiliationIndex] = affiliation;
      setUserLinkedAffiliations(updatedList);
      triggerOnChange(updatedList);
      setAffiliationDialogShown(false);
    },
    [dispatch, userLinkedAffiliations, activeAffiliationIndex, triggerOnChange, editedAffiliation]
  );

  const getAffiliationsSelectList = useCallback(
    (selectedAuthor) => {
      const selectedAffiliationId = get(selectedAuthor, 'id');
      const linkedIds = new Set(userLinkedAffiliations.map((affiliation: Affiliation) => get(affiliation, 'id')));
      return allAffiliations.filter(({ id }) => !linkedIds.has(id) || selectedAffiliationId === id);
    },
    [userLinkedAffiliations, allAffiliations]
  );

  const addNewAffiliation = useCallback(
    (index) => {
      setActiveAffiliationIndex(index);
      setEditedAffiliation(undefined);
      setAffiliationDialogShown(true);
    },
    [setAffiliationDialogShown, setActiveAffiliationIndex, setEditedAffiliation]
  );

  const openMenu = useCallback(
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setActiveAffiliationIndex(index);
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const deleteRow = useCallback(() => {
    const updatedList = [...userLinkedAffiliations];
    updatedList.splice(activeAffiliationIndex, 1);
    setUserLinkedAffiliations(updatedList);
    triggerOnChange(updatedList);
    setAnchorEl(null);
  }, [userLinkedAffiliations, activeAffiliationIndex, triggerOnChange, setAnchorEl]);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleDeleteAffiliation = useCallback(
    (affiliation: Affiliation) => {
      const updatedList = [...userLinkedAffiliations];
      updatedList[activeAffiliationIndex] = null;
      setUserLinkedAffiliations(updatedList);
      setActiveAffiliationIndex(-1);
      setAffiliationDialogShown(false);
      dispatch(manuscriptActions.deleteAffiliationAction(affiliation));
    },
    [userLinkedAffiliations, activeAffiliationIndex, dispatch]
  );

  const updateAffiliation = useCallback(() => {
    setAnchorEl(null);
    setEditedAffiliation(userLinkedAffiliations[activeAffiliationIndex]);
    setAffiliationDialogShown(true);
  }, [setEditedAffiliation, userLinkedAffiliations, activeAffiliationIndex]);

  const updateRow = useCallback(
    (index) => (event) => {
      if (event.target.value === null) {
        return addNewAffiliation(index);
      }
      const updatedList = [...userLinkedAffiliations];
      updatedList[index] = allAffiliations.find(({ id }) => id === event.target.value);
      setUserLinkedAffiliations(updatedList);
      triggerOnChange(updatedList);
    },
    [userLinkedAffiliations, allAffiliations, triggerOnChange, addNewAffiliation]
  );

  const addEmptyRow = useCallback(() => {
    setUserLinkedAffiliations([...userLinkedAffiliations, null]);
  }, [userLinkedAffiliations, setUserLinkedAffiliations]);

  return (
    <div className={classes.inputField}>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={updateAffiliation} disabled={!userLinkedAffiliations[activeAffiliationIndex]}>
          Edit Affiliation
        </MenuItem>
        <MenuItem onClick={deleteRow} disabled={userLinkedAffiliations.length < 2}>
          Remove Affiliation
        </MenuItem>
      </Menu>
      {userLinkedAffiliations.map((affiliation: Affiliation, index: number) => (
        <div className={classes.authorAffiliationRow} key={affiliation?.id || index}>
          <Select
            className={classes.affiliatedAuthorInput}
            placeholder="Set affiliation"
            fullWidth
            blankValue={undefined}
            label="Affiliation"
            value={get(affiliation, 'id', '')}
            onChange={updateRow(index)}
            options={[
              { label: 'Add new affiliation', value: null },
              ...getAffiliationsSelectList(affiliation).map((aff) => ({
                label: aff.getDisplayName(),
                value: aff.id
              }))
            ]}
          />
          <IconButton classes={{ root: classes.deleteButton }} onClick={openMenu(index)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>
      ))}
      <ActionButton
        variant="addEntity"
        disabled={userLinkedAffiliations.length > allAffiliations.length}
        title="Add Affiliation"
        onClick={addEmptyRow}
      />
      {isAffiliationDialogShown
        ? renderAffiliationModal({
            affiliation: editedAffiliation,
            onAccept: handleAffiliationModalAccept,
            onCancel: handleAffiliationModalCancel,
            onDelete: handleDeleteAffiliation
          })
        : undefined}
    </div>
  );
};
