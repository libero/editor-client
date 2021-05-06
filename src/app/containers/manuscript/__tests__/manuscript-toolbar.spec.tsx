import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { getLoadableStateSuccess } from 'app/utils/state.utils';
import { ManuscriptToolbar } from 'app/containers/manuscript/manuscript-toolbar';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { ToggleButton } from '@material-ui/lab';
import { create } from 'react-test-renderer';

jest.mock('@material-ui/core', () => {
  const React = jest.requireActual('react');
  return {
    AppBar: (props) => <div data-cmp="AppBar">{props.children}</div>,
    Toolbar: (props) => <div data-cmp="Toolbar">{props.children}</div>,
    MenuList: ({ children }) => <div data-cmp="MenuList">{children}</div>,
    MenuItem: ({ children }) => <div data-cmp="MenuItem">{children}</div>,
    Divider: () => <div data-cmp="Divider"></div>,
    IconButton: ({ children }) => <div data-cmp="IconButton">{children}</div>,
    Button: React.forwardRef(({ children }, ref) => <div data-cmp="Button">{children}</div>),
    Popper: ({ children }) => <div data-cmp="Popper">{children}</div>,
    Paper: ({ children }) => <div data-cmp="Paper">{children}</div>,
    ClickAwayListener: ({ children }) => <div data-cmp="ClickAwayListener">{children}</div>
  };
});

jest.mock('@material-ui/lab', () => ({
  ToggleButtonGroup: ({ children }) => <div data-cmp="ToggleButtonGroup">{children}</div>,
  ToggleButton: ({ children }) => <div data-cmp="ToggleButton">{children}</div>
}));

describe('ManuscriptToolbar', () => {
  const mockStore = configureMockStore([]);

  it('renders toolbar', () => {
    const store = mockStore({
      manuscriptEditor: {},
      manuscript: getLoadableStateSuccess({
        past: [{}],
        present: {},
        future: [{}]
      })
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptToolbar tocOpen={false} handleTocToggle={() => undefined} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches an event on undoClick', () => {
    const store = mockStore({
      manuscriptEditor: {},
      manuscript: getLoadableStateSuccess({
        past: [{}],
        present: {},
        future: [{}]
      })
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ManuscriptToolbar tocOpen={false} handleTocToggle={() => undefined} />
      </Provider>
    );

    const undoBtnProps = wrapper.find(ToggleButton).at(1).props();

    expect(undoBtnProps.disabled).toBeFalsy();
    //call undo
    undoBtnProps.onClick(null);

    expect(store.dispatch).toBeCalledWith(manuscriptActions.undoAction());
  });

  it('dispatches an event on redoClick', () => {
    const store = mockStore({
      manuscriptEditor: {},
      manuscript: getLoadableStateSuccess({
        past: [{}],
        present: {
          keywords: {}
        },
        future: [{}]
      })
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ManuscriptToolbar tocOpen={false} handleTocToggle={() => undefined} />
      </Provider>
    );

    const redoBtnProps = wrapper.find(ToggleButton).at(2).props();

    expect(redoBtnProps.disabled).toBeFalsy();
    //call redo
    redoBtnProps.onClick(null);

    expect(store.dispatch).toBeCalledWith(manuscriptActions.redoAction());
  });

  it('dispatches an event on export PDF click', () => {
    const store = mockStore({
      manuscriptEditor: {},
      manuscript: getLoadableStateSuccess({
        past: [],
        present: { keywords: {} },
        future: []
      })
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ManuscriptToolbar tocOpen={false} handleTocToggle={() => undefined} />
      </Provider>
    );

    const exportPdfProps = wrapper.find(ToggleButton).at(3).props();
    exportPdfProps.onClick(null);

    expect(store.dispatch).toBeCalledWith(manuscriptEditorActions.exportPdfAction());
  });
});
