import React from 'react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { create } from 'react-test-renderer';
import { ThemeProvider } from '@material-ui/core/styles';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { theme } from 'app/styles/theme';
import { BoxTextEditor } from 'app/components/box-text/box-text-editor';
import { createBodyState } from 'app/models/manuscript-state.factory';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { IconButton } from '@material-ui/core';

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
  };
});

jest.mock('app/components/rich-text-editor', () => ({
  RichTextEditor: () => <div data-cmp="rich-text-editor"></div>
}));

describe('BoxTextEditor', () => {
  const mockStore = configureMockStore([]);
  let store;

  beforeEach(() => {
    const el = document.createElement('main-text');
    el.innerHTML = `<fig id="id1" position="float"> 
        <label>Figure 1</label> 
        <graphic xlink:href="fig2.jpg" mimetype="image" mime-subtype="jpg"/>
      </fig>
      <fig id="id2" position="float"> 
        <label>Figure 2</label> 
        <graphic xlink:href="fig2.jpg" mimetype="image" mime-subtype="jpg"/>
      </fig>`;

    store = mockStore({
      manuscript: givenState({ body: createBodyState(el, '') })
    });
  });

  it('should render popup', () => {
    const node = givenBoxTextNode();
    const wrapper = create(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BoxTextEditor onDelete={jest.fn()} node={node} />
        </ThemeProvider>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should call onDelete', () => {
    const node = givenBoxTextNode();
    const onDeleteListener = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BoxTextEditor onDelete={onDeleteListener} node={node} />
        </ThemeProvider>
      </Provider>
    );

    wrapper.find(IconButton).prop('onClick').call(null);
    wrapper.update();
    expect(onDeleteListener).toBeCalled();
  });

  //
  // it('should unselect first figure', () => {
  //   const node = givenBoxTextNode();
  //   const onChangeListener = jest.fn();
  //   const wrapper = mount(
  //     <Provider store={store}>
  //       <ThemeProvider theme={theme}>
  //         <BoxTextEditor onDelete={jest.fn()} node={node} />
  //       </ThemeProvider>
  //     </Provider>
  //   );
  //   wrapper.find('li').at(0).simulate('click');
  //   wrapper.update();
  //   expect(onChangeListener).toBeCalledWith([]);
  // });
  //
  // it('should close popup on clickaway', () => {
  //   const node = givenBoxTextNode();
  //   const onCloseListener = jest.fn();
  //   const wrapper = mount(
  //     <Provider store={store}>
  //       <ThemeProvider theme={theme}>
  //         <BoxTextEditor onDelete={jest.fn()} node={node} />
  //       </ThemeProvider>
  //     </Provider>
  //   );
  //   wrapper.find(ClickAwayListener).props().onClickAway(null);
  // });
});

function givenBoxTextNode(): ProsemirrorNode {
  const bodyEditorState = createBodyState(document.createElement('div'), '');
  return bodyEditorState.schema.nodes.boxText.createAndFill();
}
