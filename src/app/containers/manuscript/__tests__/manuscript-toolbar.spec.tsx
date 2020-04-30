import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { mount } from 'enzyme';

import { getLoadableStateSuccess } from '../../../utils/state.utils';
import { ManuscriptToolbar } from '../manuscript-toolbar';
import * as manuscriptActions from '../../../actions/manuscript.actions';

jest.mock('@material-ui/core');

describe('<ManuscriptToolbar />', () => {
  const mockStore = configureMockStore([]);

  it('dispatches an event on undoClick', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess({
        past: [{}],
        present: {},
        future: [{}]
      })
    });
    jest.spyOn(store, 'dispatch');

    (IconButton['render'] as jest.Mock).mockImplementationOnce(({ children }) => <div data-cmp='icon-button'></div>);
    const wrapper = mount(
      <Provider store={store}>
        <ManuscriptToolbar />
      </Provider>
    );

    console.log(wrapper.debug());
    const undoBtnProps = wrapper.find(IconButton).at(1).props();

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

    (IconButton['render'] as jest.Mock).mockImplementationOnce(({ children }) => <div data-cmp='icon-button'></div>);
    const wrapper = mount(
      <Provider store={store}>
        <ManuscriptToolbar />
      </Provider>
    );

    const redoBtnProps = wrapper.find(IconButton).at(2).props();

    expect(redoBtnProps.disabled).toBeFalsy();
    //call redo
    redoBtnProps.onClick(null);

    expect(store.dispatch).toBeCalledWith(manuscriptActions.redoAction());
  });
});
