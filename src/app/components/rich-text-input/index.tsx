import React, { useCallback, useMemo, useRef, useState } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { ToggleButtonGroup } from '@material-ui/lab';
import classNames from 'classnames';

import { SectionContainer } from '../section-container';
import { ProseMirrorEditorView } from '../rich-text-editor/prosemirror-editor-view';
import { useRichTextInputStyles } from '../rich-text-input/styles';
import { LinkNodeView } from '../link-editor-popup';
import { getMenuForEditor } from '../rich-text-input/toolbar-configurator';

interface RichTextInputProps {
  editorState: EditorState;
  name: string;
  className?: string;
  label: string;
  error?: boolean;
  onChange(value: Transaction): void;
}

export const RichTextInput: React.FC<RichTextInputProps> = ({ label, onChange, editorState, className, error }) => {
  const [isFocused, setFocused] = useState(false);
  const classes = useRichTextInputStyles();
  const prosemirrorEditorView = useRef();
  const onFocus = useCallback(() => setFocused(true), [setFocused]);
  const onBlur = useCallback(() => setFocused(false), [setFocused]);

  const options = useMemo(
    () => ({
      nodeViews: {
        link(node, view) {
          return new LinkNodeView(node, view);
        }
      },
      handleDOMEvents: {
        focus: onFocus,
        blur: onBlur
      }
    }),
    [onFocus, onBlur]
  );

  const editorView = prosemirrorEditorView.current
    ? (prosemirrorEditorView.current as ProseMirrorEditorView).editorView
    : null;

  return (
    <SectionContainer
      focused={isFocused}
      variant="outlined"
      label={label}
      className={classNames(classes.container, className, { [classes.errorState]: error })}
    >
      <ToggleButtonGroup classes={{ root: classNames(classes.toolbar, { [classes.hideToolbar]: !isFocused }) }}>
        {editorView ? getMenuForEditor(editorState, editorView) : undefined}
      </ToggleButtonGroup>
      {editorState ? (
        <ProseMirrorEditorView
          ref={prosemirrorEditorView}
          options={options}
          editorState={editorState}
          onChange={onChange}
        />
      ) : null}
    </SectionContainer>
  );
};
