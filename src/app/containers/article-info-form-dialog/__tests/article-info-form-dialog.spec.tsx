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

jest.mock('app/components/select', () => ({
  Select: ({ onChange, value }) => <input onChange={onChange} value={value} data-cmp="Select" />
}));

describe('Article Info Form Dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState;

  beforeEach(() => {
    mockState = givenState({});
    Object.assign(mockState.data.present.articleInfo, {
      articleDOI: '',
      dtd: '1',
      articleType: '',
      publisherId: ''
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

  it('does not dispatch update article info action when no changes', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ArticleInfoFormDialog />
      </Provider>
    );

    wrapper.find({ title: 'Done' }).prop('onClick')(mockState.data.present.articleInfo, []);
    expect(store.dispatch).not.toHaveBeenCalledWith(
      manuscriptActions.updateArticleInformationAction(mockState.data.present.articleInfo)
    );
  });

  it('dispatches update article info action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ArticleInfoFormDialog />
      </Provider>
    );

    wrapper.find({ name: 'articleDOI' }).prop('onChange')({ target: { name: 'articleDOI', value: 'changed' } });
    wrapper.update();

    wrapper.find({ title: 'Done' }).prop('onClick')(mockState.data.present.articleInfo, []);
    expect(store.dispatch).not.toHaveBeenCalledWith(
      manuscriptActions.updateArticleInformationAction(mockState.data.present.articleInfo)
    );
  });
});
