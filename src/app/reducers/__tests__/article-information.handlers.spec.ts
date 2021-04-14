import { givenState } from 'app/test-utils/reducer-test-helpers';
import { EditorState } from 'prosemirror-state';
import { updateArticleInformation } from 'app/reducers/article-information.handlers';
import { BatchChange } from 'app/utils/history/batch-change';
import { cloneManuscript } from 'app/utils/state.utils';

describe('article information handler', () => {
  it('updates article info', () => {
    const state = givenState({});
    const updatedInfo = state.data.present.articleInfo.clone();
    Object.assign(updatedInfo, {
      articleDOI: 'newID',
      dtd: '1',
      publisherId: '12345',
      publicationDate: '',
      articleType: 'insight-article',
      elocationId: '',
      subjects: [],
      volume: ''
    });

    const updatedState = {
      data: {
        past: [],
        future: [],
        present: cloneManuscript(state.data.present)
      }
    };

    updatedState.data.present.articleInfo = updatedInfo;

    const newState = updateArticleInformation(state, updatedInfo);

    updatedState.data.present.articleInfo.licenseText = expect.any(EditorState);

    expect(newState.data.present).toEqual(updatedState.data.present);
    expect(newState.data.past[0]).toBeInstanceOf(BatchChange);
  });
});
