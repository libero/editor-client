import { EditorState, Transaction } from 'prosemirror-state';

export type Manuscript = {
  title: EditorState;
};

export type ManuscriptDiff = {
  [K in keyof Manuscript]?: (Manuscript[K] extends EditorState ? Transaction : Manuscript[K]) | undefined;
};
