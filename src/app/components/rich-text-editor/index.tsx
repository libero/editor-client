import React, { useState } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { ProseMirrorEditorView } from './prosemirror-editor-view';
import classNames from 'classnames';

import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import { EditorView } from 'prosemirror-view';
import { useRichTextEditorStyles } from './styles';

export interface RichTextEditorProps {
  className?: string;
  editorState: EditorState;
  label?: string;
  onChange?: (change: Transaction) => void;
  onFocus?: (state: EditorState) => void;
  onBlur?: (state: EditorState) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const { editorState, label, onChange, onFocus, onBlur, className } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const themeClasses = useRichTextEditorStyles();

  const onEditorChange = (tx: Transaction) => {
    onChange(tx);
  };

  const handleFocusEvent = (view: EditorView): boolean => {
    if (onFocus) {
      setFocused(true);
      onFocus(view.state);
    }
    return true;
  };

  const handleBlurEvent = (view: EditorView): boolean => {
    if (onBlur) {
      setFocused(false);
      onBlur(view.state);
    }
    return true;
  };

  const options = {
    handleDOMEvents: {
      focus: handleFocusEvent,
      blur: handleBlurEvent
    }
  };

  return (
    <fieldset className={classNames(themeClasses.root, className, { [themeClasses.focused]: focused })}>
      {label ? <legend className={themeClasses.label}>{label}</legend> : undefined}
      {editorState ? (
        <ProseMirrorEditorView options={options} editorState={editorState} onChange={onEditorChange} />
      ) : null}
    </fieldset>
  );
};
