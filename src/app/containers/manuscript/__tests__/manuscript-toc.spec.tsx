import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Hidden, Drawer, ListItem, Divider, List, ListItemText } from '@material-ui/core';

import { getInitialHistory, getLoadableStateSuccess } from '../../../utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { ManuscriptTOC } from '../manuscript-toc';

jest.mock('@material-ui/core');

describe('<ManuscriptTOC>', () => {
  const mockStore = configureMockStore([]);

  beforeEach(() => {
    (Hidden as jest.Mock).mockImplementation(({ children }) => <div data-cmp="hidden">{children}</div>);
    (Drawer['render'] as jest.Mock).mockImplementation(({ children }) => <div data-cmp="drawer">{children}</div>);
    (Divider['render'] as jest.Mock).mockImplementation(({ children }) => <div data-cmp="divider">{children}</div>);
    (List['render'] as jest.Mock).mockImplementation(({ children }) => <div data-cmp="list">{children}</div>);
    (ListItem['render'] as jest.Mock).mockImplementation(({ children }) => <div data-cmp="list-item">{children}</div>);
    (ListItemText['render'] as jest.Mock).mockImplementation(({ children }) => (
      <div data-cmp="list-item-text">{children}</div>
    ));
  });

  afterEach(() => {
    (Hidden as jest.Mock).mockReset();
    (Drawer['render'] as jest.Mock).mockReset();
    (Divider['render'] as jest.Mock).mockReset();
    (List['render'] as jest.Mock).mockReset();
    (ListItem['render'] as jest.Mock).mockReset();
    (ListItemText['render'] as jest.Mock).mockReset();
  });

  it('renders', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess({
        past: [{}],
        present: {},
        future: [{}]
      })
    });
    const wrapper = create(
      <Provider store={store}>
        <ManuscriptTOC tocOpen={false} handleTocToggle={() => undefined} />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
