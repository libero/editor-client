import { EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

import { Manuscript } from 'app/models/manuscript';
import { getInitialHistory, getLoadableStateSuccess } from 'app/utils/state.utils';
import { ManuscriptHistoryState } from 'app/store';

export function givenState(overrides: Partial<Manuscript>): ManuscriptHistoryState {
  return getLoadableStateSuccess(
    getInitialHistory({
      title: createDummyEditorState(),
      abstract: createDummyEditorState(),
      impactStatement: createDummyEditorState(),
      acknowledgements: createDummyEditorState(),
      authors: [],
      relatedArticles: [],
      affiliations: [],
      keywordGroups: {},
      articleInfo: {
        dtd: '',
        articleType: '',
        articleDOI: '',
        publisherId: ''
      },
      references: [],
      ...overrides
    })
  );
}

export function createDummyEditorState(): EditorState {
  return EditorState.create({
    schema: new Schema({
      nodes: {
        doc: { content: 'inline*' },
        text: { inline: true, group: 'inline' }
      }
    }),
    plugins: []
  });
}
