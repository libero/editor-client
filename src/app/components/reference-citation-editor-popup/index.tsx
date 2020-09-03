import React, { useCallback, SyntheticEvent, useState } from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { useSelector, Provider, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Popover, TextField, InputAdornment } from '@material-ui/core';
import { has, get } from 'lodash';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Interweave from 'interweave';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import { NodeSelection, TextSelection } from 'prosemirror-state';

import { theme } from 'app/styles/theme';
import { Reference, ReferenceContributor } from 'app/models/reference';
import { getReferences } from 'app/selectors/manuscript.selectors';
import { store } from 'app/store';
import { stringifyEditorState } from 'app/utils/view.utils';
import { useReferenceEditorStyles } from 'app/components/reference-citation-editor-popup/styles';
import { ReactFCProps } from 'app/utils/types';
import { ModalContainer } from 'app/containers/modal-container';
import { ReferenceFormDialog } from 'app/containers/reference-form-dialog/reference-form-dialog';
import * as manuscriptActions from 'app/actions/manuscript.actions';

interface ReferenceCitationEditorPopupProps {
  editorView: EditorView | undefined;
  onClose(): void;
  onChange(ref: Reference): void;
  node?: ProsemirrorNode;
  y: number;
  x: number;
}

const getRefContributorName = (contributor: ReferenceContributor): string => {
  return get(contributor, 'groupName', get(contributor, 'lastName', ''));
};

const getRefListAuthorsNames = (ref: Reference) => {
  let authorNames = getRefContributorName(ref.authors[0]);
  if (ref.authors.length === 2) {
    authorNames += ` and ${getRefContributorName(ref.authors[1])}`;
  } else if (ref.authors.length > 2) {
    authorNames += ' et al.';
  }
  return authorNames;
};

const getRefListItemText = (ref: Reference) => {
  return [
    getRefListAuthorsNames(ref),
    get(ref.referenceInfo, 'year'),
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

const getRefNodeText = (ref: Reference) => {
  return [getRefListAuthorsNames(ref), get(ref.referenceInfo, 'year')].filter(Boolean).join(', ');
};

const renderReferenceModal = (props: ReactFCProps<typeof ReferenceFormDialog>) => {
  return <ModalContainer title={'Reference'} params={props} component={ReferenceFormDialog} />;
};

export const ReferenceCitationEditorPopup: React.FC<ReferenceCitationEditorPopupProps> = (props) => {
  const { editorView, x, y, node, onClose, onChange } = props;
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
          return getRefListItemText(ref).toLowerCase().indexOf(filterValue) >= 0;
        })
      );
    },
    [refs, setFilterValue]
  );
  const handleClick = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const newRefId = (event.currentTarget as HTMLLIElement).dataset['refId'];
      if (newRefId !== refId) {
        onChange(refs.find(({ id }) => id === newRefId));
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
    <Popover
      open={true}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: y, left: x }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      <TextField
        classes={{ root: classes.filterField }}
        InputLabelProps={{ shrink: true }}
        label="Filter list"
        value={filterValue}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CancelIcon onClick={clearFilterField} classes={{ root: classes.clearFilterIcon }} />
            </InputAdornment>
          )
        }}
        onChange={handleFilterChange}
      />
      <ul className={classes.refSelectionList}>
        <li className={classes.refSelectionListItem} onClick={openReferenceFormDialog}>
          <AddIcon fontSize="small" classes={{ root: classes.addReferenceIcon }} /> Reference
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
    </Popover>
  );
};

export class ReferenceCitationNodeView implements NodeView {
  dom?: HTMLAnchorElement;
  refEditorContainer: HTMLDivElement;
  nodeSelection: NodeSelection;

  constructor(private node: ProsemirrorNode, private view: EditorView) {
    this.dom = document.createElement('a');
    this.dom.style.cursor = 'pointer';
    this.dom.textContent = this.node.attrs.refText || '???';

    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode');
    this.nodeSelection = this.view.state.selection as NodeSelection;
    this.open();
  }

  open() {
    const { $from } = this.view.state.selection;
    const start = this.view.coordsAtPos($from.pos);

    this.refEditorContainer = this.view.dom.parentNode.appendChild(document.createElement('div'));
    this.refEditorContainer.style.position = 'absolute';
    this.refEditorContainer.style.zIndex = '10';

    const x = start.left;
    const y = start.bottom;

    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ReferenceCitationEditorPopup
            editorView={this.view}
            node={this.node}
            onClose={this.close}
            onChange={this.handleChange}
            x={x}
            y={y}
          />
        </ThemeProvider>
      </Provider>,
      this.refEditorContainer
    );
  }

  close() {
    this.dom.classList.remove('ProseMirror-selectednode');
    ReactDOM.unmountComponentAtNode(this.refEditorContainer);
    this.refEditorContainer.parentNode.removeChild(this.refEditorContainer);
  }

  handleChange(ref: Reference) {
    const { from, to } = this.nodeSelection;
    const schema = this.view.state.schema;
    const change = this.view.state.tr.replaceWith(
      from,
      to,
      schema.nodes['refCitation'].create({ refId: ref.id || uuidv4(), refText: getRefNodeText(ref) })
    );
    // due browser managing cursor position on focus and blur the cursor is sometimes reset to 0
    // to rectify this behaviour we move cursor back to before the citation
    // change.setSelection(new TextSelection(change.doc.resolve(this.nodeSelection.$from.pos)));
    this.view.dispatch(change);
    this.close();
  }
}
