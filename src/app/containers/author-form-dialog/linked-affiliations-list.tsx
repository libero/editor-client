import React, { useState, useCallback, useEffect } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { get } from 'lodash';
import { FormControl, InputLabel, MenuItem, Select, IconButton, Menu } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { ActionButton } from 'app/components/action-button';
import { useAuthorFormStyles } from 'app/containers/author-form-dialog/styles';
import { Affiliation, getAffiliationDisplayName } from 'app/models/affiliation';
import { AffiliationFormDialog } from 'app/containers/affiliation-form-dialog/affiliation-form-dialog';
import { ModalContainer } from 'app/containers/modal-container';
import { ReactFCProps } from 'app/utils/types';
import * as manuscriptActions from 'app/actions/manuscript.actions';

interface LinkedAffiliationsListProps {
  linkedAffiliations: Affiliation[];
  allAffiliations: Affiliation[];
  onChange: (selectedAffiliations: Affiliation[]) => void;
}

const renderAffiliationModal = (props: ReactFCProps<typeof AffiliationFormDialog>) => {
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
      setUserLinkedAffiliations(linkedAffiliations);
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
    (affiliation: Affiliation) => {
      if (!editedAffiliation) {
        dispatch(manuscriptActions.addAffiliationAction(affiliation));
      } else {
        dispatch(manuscriptActions.updateAffiliationAction(affiliation));
      }

      const updatedList = [...userLinkedAffiliations];
      updatedList[activeAffiliationIndex] = affiliation;
      setUserLinkedAffiliations(updatedList);
      triggerOnChange(updatedList);
      setAffiliationDialogShown(false);
    },
    [dispatch, userLinkedAffiliations, activeAffiliationIndex, triggerOnChange, editedAffiliation]
  );

  const getAuthorSelectList = useCallback(
    (selectedAuthor) => {
      const selectedAffiliationId = get(selectedAuthor, 'id');
      const linkedIds = new Set(userLinkedAffiliations.map((affiliation: Affiliation) => get(affiliation, 'id')));
      return allAffiliations.filter(({ id }) => !linkedIds.has(id) || selectedAffiliationId === id);
    },
    [userLinkedAffiliations, allAffiliations]
  );

  const handleAddNewAffiliation = useCallback(
    (index) => () => {
      setActiveAffiliationIndex(index);
      setEditedAffiliation(undefined);
      setAffiliationDialogShown(true);
    },
    [setActiveAffiliationIndex, setAffiliationDialogShown]
  );

  const renderAffiliationSelectListItem = useCallback(
    (affiliation: Affiliation) => {
      return (
        <MenuItem key={affiliation.id} value={affiliation.id} classes={{ root: classes.dropDownMenuItem }}>
          {getAffiliationDisplayName(affiliation)}
        </MenuItem>
      );
    },
    [classes]
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
      const updatedList = [...userLinkedAffiliations];
      updatedList[index] = allAffiliations.find(({ id }) => id === event.target.value);
      setUserLinkedAffiliations(updatedList);
      triggerOnChange(updatedList);
    },
    [userLinkedAffiliations, allAffiliations, triggerOnChange]
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
        <MenuItem onClick={deleteRow}>Remove Affiliation</MenuItem>
      </Menu>
      {userLinkedAffiliations.map((affiliation: Affiliation, index: number) => (
        <div className={classes.affiliatedAuthorRow} key={affiliation?.id || index}>
          <FormControl key={get(affiliation, 'id', index)} variant="outlined" className={classes.affiliatedAuthorInput}>
            <InputLabel shrink id="author-affiliations-label">
              Affiliation
            </InputLabel>
            <Select
              labelId="author-affiliations-label"
              displayEmpty
              value={get(affiliation, 'id', '')}
              onChange={updateRow(index)}
              label="Affiliation"
            >
              <MenuItem value={''}>Set affiliation</MenuItem>
              <MenuItem onMouseDown={handleAddNewAffiliation(index)}>Add new affiliation</MenuItem>
              {getAuthorSelectList(affiliation).map(renderAffiliationSelectListItem)}
            </Select>
          </FormControl>
          <IconButton classes={{ root: classes.deleteButton }} onClick={openMenu(index)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>
      ))}
      <ActionButton variant="addEntity" title="Affiliation" onClick={addEmptyRow} />
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
