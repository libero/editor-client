import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { RelatedArticleFormDialog } from 'app/containers/related-article-form-dialog/index';

jest.mock('@material-ui/core', () => ({
  Select: ({ children }) => <div data-cmp="Index">{children}</div>,
  MenuItem: ({ children }) => <div data-cmp="MenuItem">{children}</div>,
  FormControl: ({ children }) => <div data-cmp="FormControl">{children}</div>,
  InputLabel: ({ children }) => <div data-cmp="InputLabel">{children}</div>,
  TextField: () => <div data-cmp="TextField"></div>,
  Button: () => <div data-cmp="Button"></div>
}));

describe('Related Article Form Dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState;

  beforeEach(() => {
    mockState = givenState({
      relatedArticles: [
        {
          id: 'ra1',
          articleType: 'commentary-article',
          href: '10.7554/eLife.42697'
        },
        {
          id: 'ra2',
          articleType: 'commentary-article',
          href: '10.7554/eLife.00067'
        }
      ]
    });
  });

  it('renders related article form', () => {
    const store = mockStore({
      manuscript: mockState
    });

    const wrapper = create(
      <Provider store={store}>
        <RelatedArticleFormDialog />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches update related article action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <RelatedArticleFormDialog article={mockState.data.present.relatedArticles[0]} />
      </Provider>
    );

    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.updateRelatedArticleAction(mockState.data.present.relatedArticles[0])
    );
  });

  it('dispatches add related article action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <RelatedArticleFormDialog />
      </Provider>
    );

    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.addRelatedArticleAction({
        articleType: '',
        href: '',
        id: expect.any(String)
      })
    );
  });
});
