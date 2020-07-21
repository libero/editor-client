import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { create } from 'react-test-renderer';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { RelatedArticles } from 'app/containers/manuscript/related-articles/index';

jest.mock('@material-ui/core', () => ({
  Button: ({ label }) => <div data-cmp="Button">{label}</div>,
  IconButton: () => <div data-cmp="IconButton"></div>
}));

const RELATED_ARTICLES = [
  {
    linkType: 'doi',
    articleType: 'commentary-article',
    href: '10.7554/eLife.42697'
  },
  {
    linkType: 'doi',
    articleType: 'commentary-article',
    href: '10.7554/eLife.00067'
  }
];

describe('Related articles info', () => {
  const mockStore = configureMockStore([]);

  it('renders related articles list', () => {
    const mockState = givenState({});
    const store = mockStore({
      manuscript: mockState
    });
    const wrapper = create(
      <Provider store={store}>
        <RelatedArticles />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
