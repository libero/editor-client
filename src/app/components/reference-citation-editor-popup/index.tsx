import React, { useCallback, SyntheticEvent, useState } from 'react';
import ReactDOM from 'react-dom';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { useSelector, Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Popover, TextField } from '@material-ui/core';
import { has, get } from 'lodash';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Interweave from 'interweave';

import { theme } from 'app/styles/theme';
import { Reference, ReferenceContributor } from 'app/models/reference';
import { getReferences } from 'app/selectors/manuscript.selectors';
import { store } from 'app/store';
import { stringifyEditorState } from 'app/utils/view.utils';
import { useReferenceEditorStyles } from 'app/components/reference-citation-editor-popup/styles';

interface ReferenceCitationEditorPopupProps {
  editorView: EditorView | undefined;
  onClose(): void;
  onChange(ref: Reference): void;
  node?: ProsemirrorNode;
  y: number;
  x: number;
}

const getRefContributorName = (contributor: ReferenceContributor): string => {
  return has(contributor, 'groupName')
    ? `${get(contributor, 'groupName', '')}`
    : `${get(contributor, 'lastName', '')} ${get(contributor, 'firstName', '')}`;
};

const getRefListAuthorsNames = (ref: Reference) => {
  let authors = getRefContributorName(ref.authors[0]);
  if (authors.length === 2) {
    authors += ` and ${getRefContributorName(ref.authors[1])}`;
  } else if (authors.length > 2) {
    authors += ' et al.';
  }
  return authors;
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
  return [getRefListAuthorsNames(ref), get(ref.referenceInfo, 'year')].filter(Boolean).join('. ');
};

export const ReferenceCitationEditorPopup: React.FC<ReferenceCitationEditorPopupProps> = (props) => {
  const { editorView, x, y, node, onClose, onChange } = props;
  const refs = useSelector(getReferences);
  const [filteredRefs, setFilteredRefs] = useState<Reference[]>(refs);
  const classes = useReferenceEditorStyles();

  const refId = node.attrs['refId'];
  const handleFilterChange = useCallback(
    (event) => {
      const filterValue = event.target['value'];
      setFilteredRefs(
        refs.filter((ref) => {
          return getRefListItemText(ref).indexOf(filterValue) >= 0;
        })
      );
    },
    [refs]
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
        variant="outlined"
        onChange={handleFilterChange}
      />
      <ul className={classes.refSelectionList}>
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
    </Popover>
  );
};

export class ReferenceCitationNodeView implements NodeView {
  dom?: HTMLAnchorElement;
  refEditorContainer: HTMLDivElement;
  isEditorOpen: boolean = false;

  constructor(private node: ProsemirrorNode, private view: EditorView) {
    this.dom = document.createElement('a');
    this.dom.style.cursor = 'pointer';
    this.dom.textContent = node.attrs.refText;

    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode');
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
    this.isEditorOpen = true;
  }

  close() {
    this.dom.classList.remove('ProseMirror-selectednode');
    ReactDOM.unmountComponentAtNode(this.refEditorContainer);
    this.refEditorContainer.parentNode.removeChild(this.refEditorContainer);
  }

  handleChange(ref: Reference) {
    const { from, to } = this.view.state.selection;
    const schema = this.view.state.schema;
    const change = this.view.state.tr.replaceWith(
      from,
      to,
      schema.nodes['refCitation'].create({ refId: ref.id, refText: getRefNodeText(ref) })
    );
    this.view.dispatch(change);
    this.close();
  }
}
