import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { AppBar, Toolbar} from '@material-ui/core';
import { mount } from 'enzyme';

import { getLoadableStateSuccess } from 'app/utils/state.utils';
import { ManuscriptToolbar } from 'app/containers/manuscript/manuscript-toolbar';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { ToggleButton } from '@material-ui/lab';

jest.mock('@material-ui/core');

describe('<ManuscriptToolbar />', () => {
  const mockStore = configureMockStore([]);

  beforeEach(() => {
    (AppBar['render'] as jest.Mock).mockImplementationOnce((props) => <>{props.children}</>);
    (Toolbar['render'] as jest.Mock).mockImplementationOnce((props) => <>{props.children}</>);
  });

  afterEach(() => {
    (AppBar['render'] as jest.Mock).mockReset();
    (Toolbar['render'] as jest.Mock).mockReset();
  });

  it('dispatches an event on undoClick', () => {
    const store = mockStore({
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
});
