import React, { useState, useCallback, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { TextField, IconButton, InputAdornment, Popover, ThemeProvider } from '@material-ui/core';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';

import LaunchIcon from '@material-ui/icons/Launch';
import CloseIcon from '@material-ui/icons/Close';

import { LINK_EDITOR_MAX_WIDTH, useLinkEditorStyles } from 'app/components/link-editor-popup/styles';
import { ActionButton } from 'app/components/action-button';
import { theme } from 'app/styles/theme';

interface LinkEditorPopupProps {
  editorView: EditorView | undefined;
  onClose: (href?: string) => void;
  node?: ProsemirrorNode;
  y: number;
  x: number;
}

export const LinkEditorPopup: React.FC<LinkEditorPopupProps> = ({ editorView, node, onClose, x, y }) => {
  const classes = useLinkEditorStyles();
  const [link, setLink] = useState<string>(node ? node.attrs.href : '');

  const handleOnChange = useCallback(
    (event: SyntheticEvent) => {
      setLink(event.target['value']);
    },
    [setLink]
  );

  const handleLaunchClick = useCallback(() => {
    window.open(link, '_blank');
  }, [link]);

  const handleClearField = useCallback(() => setLink(''), [setLink]);

  const handleApplyClick = useCallback(() => {
    editorView.focus();
    onClose(link);
  }, [editorView, link, node]);

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!editorView) {
    return <></>;
  }

  return (
    <Popover
      open={true}
      onClose={handleOnClose}
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
      <div className={classes.container}>
        <TextField
          fullWidth
          classes={{ root: classes.textField }}
          name="link"
          label="Link"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={link}
          onChange={handleOnChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <a className={classes.clearTextButton} onClick={handleClearField}>
                  <CloseIcon />
                </a>
              </InputAdornment>
            )
          }}
        />
        <IconButton size="small" onClick={handleLaunchClick} classes={{ root: classes.launchButton }}>
          <LaunchIcon fontSize="small" />
        </IconButton>
        <ActionButton variant="primaryContained" onClick={handleApplyClick} title="Apply" />
      </div>
    </Popover>
  );
};

export class LinkNodeView implements NodeView {
  dom?: HTMLAnchorElement;
  linkEditorContainer: HTMLDivElement;
  linkEditorView: HTMLElement;

  constructor(private node: ProsemirrorNode, private view: EditorView) {
    this.dom = document.createElement('a');
    this.dom.style.cursor = 'pointer';
    this.dom.setAttribute('href', this.node.attrs.href);
    this.dom.addEventListener('click', this.open.bind(this));
  }

  open(event?: MouseEvent) {
    event && event.preventDefault();

    const { from } = this.view.state.selection;
    const start = this.view.coordsAtPos(from) as DOMRect;

    this.linkEditorContainer = this.view.dom.parentNode.appendChild(document.createElement('div'));
    this.linkEditorContainer.style.position = 'absolute';
    this.linkEditorContainer.style.zIndex = '10';

    const x = start.left + LINK_EDITOR_MAX_WIDTH / 2;
    const y = start.top + start.height;

    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <LinkEditorPopup editorView={this.view} node={this.node} onClose={this.close.bind(this)} x={x} y={y} />
      </ThemeProvider>,
      this.linkEditorContainer
    );
    this.dom.classList.add('ProseMirror-selectednode');
  }

  updateMark(href: string) {
    const markType = this.view.state.schema.marks.link;
    const { from, $from, $to, to } = this.view.state.selection;
    const linkStart = from - $from.nodeBefore.nodeSize;
    const linkEnd = to + $to.nodeAfter.nodeSize;
    const transaction = this.view.state.tr;
    transaction.removeMark(linkStart, linkEnd, markType);
    transaction.addMark(linkStart, linkEnd, markType.create({ href }));
    this.view.dispatch(transaction);
  }

  close(href?: string) {
    this.dom.classList.remove('ProseMirror-selectednode');
    ReactDOM.unmountComponentAtNode(this.linkEditorContainer);
    if (href) {
      this.updateMark(href);
    }
  }

  destroy() {
    if (this.linkEditorView) {
      this.close();
    }
  }
}