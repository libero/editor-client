import React, { useCallback, SyntheticEvent, useState } from 'react';
import { EditorView } from 'prosemirror-view';
import { useSelector, useDispatch } from 'react-redux';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { TextField, InputAdornment, Popper, Paper, ClickAwayListener } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Interweave from 'interweave';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import { has, get } from 'lodash';

import { getReferences } from 'app/selectors/manuscript.selectors';
import { getRefListAuthorsNames, Reference } from 'app/models/reference';
import { useReferenceEditorStyles } from 'app/components/reference-citation/styles';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { stringifyEditorState } from 'app/utils/view.utils';
import { ReactFCProps } from 'app/utils/types';
import { ReferenceFormDialog } from 'app/containers/reference-form-dialog/reference-form-dialog';
import { ModalContainer } from 'app/containers/modal-container';

interface ReferenceCitationEditorPopupProps {
  editorView: EditorView | undefined;
  onClose(): void;
  anchorEl: HTMLElement;
  onChange(ref: Reference): void;
  node?: ProsemirrorNode;
}

const renderReferenceModal = (props: ReactFCProps<typeof ReferenceFormDialog>) => {
  return <ModalContainer title={'Reference'} params={props} component={ReferenceFormDialog} />;
};

const getRefListItemText = (ref: Reference) => {
  return [
    `${getRefListAuthorsNames(ref)}, ${get(ref.referenceInfo, 'year')}`,
    has(ref.referenceInfo, 'chapterTitle') ? stringifyEditorState(get(ref.referenceInfo, 'chapterTitle')) : undefined,
    has(ref.referenceInfo, 'articleTitle') ? stringifyEditorState(get(ref.referenceInfo, 'articleTitle')) : undefined,
    has(ref.referenceInfo, 'dataTitle') ? stringifyEditorState(get(ref.referenceInfo, 'dataTitle')) : undefined,
    has(ref.referenceInfo, 'source') ? stringifyEditorState(get(ref.referenceInfo, 'source')) : undefined,
    has(ref.referenceInfo, 'conferenceName')
      ? stringifyEditorState(get(ref.referenceInfo, 'conferenceName'))
      : undefined
  ]
    .filter(Boolean)
    .join('. ');
};

export const ReferenceCitationEditorPopup: React.FC<ReferenceCitationEditorPopupProps> = (props) => {
  const { editorView, node, onClose, onChange, anchorEl } = props;
  const refs = useSelector(getReferences);
  const [filteredRefs, setFilteredRefs] = useState<Reference[]>(refs);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isReferenceDialogShown, setReferenceDialogShown] = useState<boolean>(false);
  const classes = useReferenceEditorStyles();
  const dispatch = useDispatch();

  const refId = node.attrs['refId'];
  const handleFilterChange = useCallback(
    (event) => {
      const filterValue = event.target['value'].toLowerCase();
      setFilterValue(event.target['value']);
      setFilteredRefs(
        refs.filter((ref) => {
          return getRefListItemText(ref).toLowerCase().indexOf(filterValue) >= 0 || refId === ref.id;
        })
      );
    },
    [refs, setFilterValue, refId]
  );
  const handleClick = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const newRefId = (event.currentTarget as HTMLLIElement).dataset['refId'];
      if (newRefId !== refId) {
        onChange(refs.find(({ id }) => id === newRefId));
      } else {
        onChange(undefined);
      }
    },
    [onChange, refId, refs]
  );

  const handleAddReference = useCallback(
    (newReference) => {
      dispatch(manuscriptActions.addReferenceAction(newReference));
      setReferenceDialogShown(false);
      onChange(newReference);
    },
    [dispatch, onChange, setReferenceDialogShown]
  );

  const clearFilterField = useCallback(() => {
    setFilterValue('');
    setFilteredRefs(refs);
  }, [setFilterValue, setFilteredRefs, refs]);

  const openReferenceFormDialog = useCallback(() => {
    setReferenceDialogShown(true);
  }, []);

  const closeReferenceFormDialog = useCallback(() => {
    setReferenceDialogShown(false);
  }, []);

  if (!editorView) {
    return <></>;
  }

  return (
    <Popper open={true} anchorEl={anchorEl} style={{ zIndex: 1 }}>
      <Paper>
        <ClickAwayListener onClickAway={onClose} mouseEvent="onMouseUp">
          <div>
            <TextField
              classes={{ root: classes.filterField }}
              InputLabelProps={{ shrink: true }}
              label="Filter list"
              value={filterValue}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <ClearIcon
                      onClick={clearFilterField}
                      color="disabled"
                      classes={{ root: classes.clearFilterIcon }}
                    />
                  </InputAdornment>
                )
              }}
              onChange={handleFilterChange}
            />
            <ul className={classes.refSelectionList}>
              <li className={classes.refSelectionListItem} onClick={openReferenceFormDialog}>
                <AddIcon fontSize="small" classes={{ root: classes.addReferenceIcon }} /> Add Reference
              </li>
              {filteredRefs.map((ref) => (
                <li className={classes.refSelectionListItem} key={ref.id} data-ref-id={ref.id} onClick={handleClick}>
                  <div className={classes.refContent}>
                    <Interweave content={getRefListItemText(ref)} />
                  </div>
                  <div className={classes.refTick}>
                    <CheckCircleIcon color="primary" className={ref.id !== refId ? classes.hiddenIcon : ''} />
                  </div>
                </li>
              ))}
            </ul>
            {isReferenceDialogShown
              ? renderReferenceModal({
                  reference: undefined,
                  onAccept: handleAddReference,
                  onCancel: closeReferenceFormDialog,
                  onDelete: undefined
                })
              : undefined}
          </div>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
};
