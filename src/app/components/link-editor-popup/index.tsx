import React, { useState, useCallback, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import { TextField, IconButton, InputAdornment, Popper, Paper, ClickAwayListener } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import LaunchIcon from '@material-ui/icons/Launch';
import CloseIcon from '@material-ui/icons/Close';

import { useLinkEditorStyles } from 'app/components/link-editor-popup/styles';
import { ActionButton } from 'app/components/action-button';
import { theme } from 'app/styles/theme';

interface LinkEditorPopupProps {
  editorView: EditorView | undefined;
  onClose: () => void;
  onApply: (href: string) => void;
  anchorEl: HTMLElement;
  node?: ProsemirrorNode;
}

export const LinkEditorPopup: React.FC<LinkEditorPopupProps> = ({ editorView, node, onApply, onClose, anchorEl }) => {
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
    onApply(link);
  }, [editorView, link, onApply]);

  if (!editorView) {
    return <></>;
  }

  return (
    <Popper open={true} anchorEl={anchorEl} style={{ zIndex: 1300 }}>
      <Paper>
        <ClickAwayListener onClickAway={onClose} mouseEvent="onMouseUp">
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
                    <span className={classes.clearTextButton} onClick={handleClearField}>
                      <CloseIcon />
                    </span>
                  </InputAdornment>
                )
              }}
            />
            <IconButton size="small" onClick={handleLaunchClick} classes={{ root: classes.launchButton }}>
              <LaunchIcon fontSize="small" />
            </IconButton>
            <ActionButton variant="primaryContained" onClick={handleApplyClick} title="Apply" />
          </div>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
};

export class LinkNodeView implements NodeView {
  dom?: HTMLAnchorElement;
  linkEditorContainer: HTMLDivElement;
  linkEditorView: HTMLElement;

  constructor(private node: ProsemirrorNode, private view: EditorView) {
    this.dom = document.createElement('a');
    this.dom.style.cursor = 'pointer';
    console.log(node.attrs);
    this.dom.setAttribute('href', this.node.attrs.href);
    this.dom.addEventListener('contextmenu', this.openLinkInNewWindow.bind(this));
    this.dom.addEventListener(
      'click',
      debounce((event: MouseEvent) => {
        if (event.ctrlKey) {
          this.openLinkInNewWindow(event);
        } else {
          this.open();
        }
      }, 100)
    );

    if (!node.attrs.href) {
      this.dom.dispatchEvent(new Event('click'));
    }
  }

  openLinkInNewWindow(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const newWindow = window.open();
    newWindow.opener = null;
    newWindow.location = this.node.attrs.href;
  }

  open() {
    this.linkEditorContainer = this.view.dom.parentNode.appendChild(document.createElement('div'));
    this.linkEditorContainer.style.position = 'absolute';
    this.linkEditorContainer.style.zIndex = '10';

    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <LinkEditorPopup
          anchorEl={this.dom}
          editorView={this.view}
          node={this.node}
          onClose={this.close.bind(this)}
          onApply={this.handleApply.bind(this)}
        />
      </ThemeProvider>,
      this.linkEditorContainer
    );
    this.dom.classList.add('ProseMirror-selectednode');
  }

  removeMark() {
    const markType = this.view.state.schema.marks.link;
    const { from, $from, $to, to } = this.view.state.selection;
    const linkStart = from - $from.nodeBefore.nodeSize;
    const linkEnd = to + $to.nodeAfter.nodeSize;
    const transaction = this.view.state.tr;
    transaction.removeMark(linkStart, linkEnd, markType);
    this.view.dispatch(transaction);
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

  close() {
    this.dom.classList.remove('ProseMirror-selectednode');
    ReactDOM.unmountComponentAtNode(this.linkEditorContainer);
    this.linkEditorContainer.parentNode.removeChild(this.linkEditorContainer);
  }

  handleApply(href: string) {
    this.close();
    if (href) {
      this.updateMark(href);
    } else {
      this.removeMark();
    }
  }

  destroy() {
    if (this.linkEditorView) {
      this.close();
    }
  }
}
