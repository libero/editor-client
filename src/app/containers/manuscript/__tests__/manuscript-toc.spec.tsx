import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Hidden, Drawer, ListItem, Divider, List, ListItemText } from '@material-ui/core';

import { getLoadableStateSuccess } from 'app/utils/state.utils';
import { ManuscriptTOC } from 'app/containers/manuscript/manuscript-toc';

jest.mock('@material-ui/core');

describe('<ManuscriptTOC>', () => {
  const mockStore = configureMockStore([]);
  const OLD_VERSION = process.env.REACT_APP_VERSION;

  beforeEach(() => {
    process.env.REACT_APP_VERSION = '0.0.0-test';
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
    process.env.REACT_APP_VERSION = OLD_VERSION;
    (Hidden as jest.Mock).mockReset();
    (Drawer['render'] as jest.Mock).mockReset();
    (Divider['render'] as jest.Mock).mockReset();
    (List['render'] as jest.Mock).mockReset();
    (ListItem['render'] as jest.Mock).mockReset();
    (ListItemText['render'] as jest.Mock).mockReset();
  });

  it('renders', () => {
    const store = mockStore({
      manuscriptEditor: {
        manuscriptBodyTOC: [
          { level: 1, title: 'H1', id: '1' },
          { level: 2, title: 'H2', id: '2' },
          { level: 3, title: 'H2', id: '3' },
          { level: 4, title: 'H2', id: '4' }
        ]
      },
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
