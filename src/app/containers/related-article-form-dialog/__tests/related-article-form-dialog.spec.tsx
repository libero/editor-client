import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { givenState } from '../../../test-utils/reducer-test-helpers';
import * as manuscriptActions from '../../../actions/manuscript.actions';
import { RelatedArticleFormDialog } from '../';
import { RelatedArticle } from '../../../models/related-article';

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
        new RelatedArticle({
          id: 'ra1',
          articleType: 'commentary-article',
          href: '10.7554/eLife.42697'
        }),
        new RelatedArticle({
          id: 'ra2',
          articleType: 'commentary-article',
          href: '10.7554/eLife.00067'
        })
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

    wrapper.find({ name: 'href' }).prop('onChange')({ target: { name: 'href', value: 'new value' } });
    wrapper.update();
    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.updateRelatedArticleAction(expect.any(RelatedArticle))
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
    expect(store.dispatch).toHaveBeenCalledWith(manuscriptActions.addRelatedArticleAction(expect.any(RelatedArticle)));
  });
});
