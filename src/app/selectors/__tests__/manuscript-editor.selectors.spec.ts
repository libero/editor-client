import { EditorState } from 'prosemirror-state';

import { getInitialHistory, getInitialLoadableState } from '../../utils/state.utils';
import {
  canBoldSelection,
  canItalicizeSelection,
  canRedoChanges,
  canUndoChanges
} from '../manuscript-editor.selectors';
import { Manuscript } from '../../models/manuscript';

describe('manuscript selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      manuscript: getInitialLoadableState(),
      manuscriptEditor: {
        focusedManuscriptPath: undefined
      }
    };
  });

  it('checks if changes can be undone', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());

    state.manuscript.data.past.push({ title: undefined });
    expect(canUndoChanges(state)).toBeTruthy();
  });

  it('checks if changes can be redone', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());

    state.manuscript.data.future.push({ title: undefined });
    expect(canRedoChanges(state)).toBeTruthy();
  });

  it('checks if selection can be italicised', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());
    state.manuscriptEditor.focusedManuscriptPath = 'title';
    state.manuscript.data.present.title = {
      ...new EditorState(),
      selection: { empty: false },
      schema: {
        marks: { italic: {} }
      }
    };
    expect(canItalicizeSelection(state)).toBeTruthy();
  });

  it('checks if selection can be bold', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());
    state.manuscriptEditor.focusedManuscriptPath = 'title';
    state.manuscript.data.present.title = {
      ...new EditorState(),
      selection: { empty: false },
      schema: {
        marks: { bold: {} }
      }
    };
    expect(canBoldSelection(state)).toBeTruthy();
  });
});

function givenManuscript(): Manuscript {
  return {
    title: new EditorState(),
    abstract: new EditorState(),
    keywordGroups: {},
    authors: []
  };
}
