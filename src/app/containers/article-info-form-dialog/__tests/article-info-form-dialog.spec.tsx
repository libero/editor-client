import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { ArticleInfoFormDialog } from 'app/containers/article-info-form-dialog/index';
import * as manuscriptActions from 'app/actions/manuscript.actions';

jest.mock('@material-ui/core', () => ({
  TextField: () => <div data-cmp="TextField"></div>,
  Button: () => <div data-cmp="Button"></div>
}));

describe('Article Info Form Dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState;

  beforeEach(() => {
    mockState = givenState({
      articleInfo: {
        articleDOI: '',
        dtd: '1',
        articleType: ''
      }
    });
  });

  it('renders edit article information dialog', () => {
    const store = mockStore({
      manuscript: mockState
    });

    const wrapper = create(
      <Provider store={store}>
        <ArticleInfoFormDialog />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches update article info action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ArticleInfoFormDialog />
      </Provider>
    );

    wrapper.find({ title: 'Done' }).prop('onClick')(mockState.data.present.articleInfo, []);
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.updateArticleInformationAction(mockState.data.present.articleInfo)
    );
  });
});
