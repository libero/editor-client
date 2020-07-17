import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { create } from 'react-test-renderer';
import { mount } from 'enzyme';

import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { ArticleInformation } from 'app/containers/manuscript/article-information/index';
import { IconButton } from '@material-ui/core';
import { ArticleInfoFormDialog } from 'app/containers/article-info-form-dialog';

jest.mock('@material-ui/core', () => ({
  Button: ({ label }) => <div data-cmp="Button">{label}</div>,
  IconButton: () => <div data-cmp="IconButton"></div>
}));

describe('Article information', () => {
  const mockStore = configureMockStore([]);

  it('renders article information', () => {
    const mockState = givenState({
      articleInfo: {
        articleDOI: 'SOME_ID'
      }
    });
    const store = mockStore({
      manuscript: mockState
    });
    const wrapper = create(
      <Provider store={store}>
        <ArticleInformation />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('edits article information', () => {
    const mockState = givenState({
      articleInfo: {
        articleDOI: 'SOME_ID'
      }
    });
    const store = mockStore({
      manuscript: mockState
    });
    jest.spyOn(store, 'dispatch');
    const wrapper = mount(
      <Provider store={store}>
        <ArticleInformation />
      </Provider>
    );

    wrapper.find(IconButton).prop('onClick')(null);
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptEditorActions.showModalDialog({
        component: ArticleInfoFormDialog,
        title: 'Article Information'
      })
    );
  });
});
