import React from 'react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { create } from 'react-test-renderer';
import { ThemeProvider } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { theme } from 'app/styles/theme';
import { FigureCitationEditorPopup } from 'app/components/figure-citation/figure-citation-editor-popup';
import { createBodyState } from 'app/models/manuscript-state.factory';
import { ClickAwayListener } from '@material-ui/core';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { Provider } from 'react-redux';

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
  };
});

jest.mock('@material-ui/core', () => ({
  Popper: ({ children }) => <div data-cmp="Popper">{children}</div>,
  Paper: ({ children }) => <div data-cmp="Paper">{children}</div>,
  ClickAwayListener: ({ children }) => <div data-cmp="ClickAwayListener">{children}</div>,
  InputAdornment: ({ children }) => <div data-cmp="InputAdornment">{children}</div>,
  TextField: ({ value, onChange, children }) => (
    <input onChange={onChange} value={value} data-cmp="TextField">
      {children}
    </input>
  )
}));

describe('FigureCitationEditorPopup', () => {
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
    const node = givenFigureCitationNode();
    const wrapper = create(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FigureCitationEditorPopup
            selectedIds={node.attrs.figIds}
            anchorEl={document.createElement('div')}
            onClose={jest.fn()}
            onChange={jest.fn()}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should select second figure', () => {
    const node = givenFigureCitationNode();
    const onChangeListener = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FigureCitationEditorPopup
            selectedIds={node.attrs.figIds}
            anchorEl={document.createElement('div')}
            onClose={jest.fn()}
            onChange={onChangeListener}
          />
        </ThemeProvider>
      </Provider>
    );
    wrapper.find('li').at(1).simulate('click');
    wrapper.update();
    expect(onChangeListener).toBeCalledWith([
      { id: 'id1', name: 'Figure 1' },
      { id: 'id2', name: 'Figure 2' }
    ]);
  });

  it('should unselect first figure', () => {
    const node = givenFigureCitationNode();
    const onChangeListener = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FigureCitationEditorPopup
            selectedIds={node.attrs.figIds}
            anchorEl={document.createElement('div')}
            onClose={jest.fn()}
            onChange={onChangeListener}
          />
        </ThemeProvider>
      </Provider>
    );
    wrapper.find('li').at(0).simulate('click');
    wrapper.update();
    expect(onChangeListener).toBeCalledWith([]);
  });

  it('should close popup on clickaway', () => {
    const node = givenFigureCitationNode();
    const onCloseListener = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FigureCitationEditorPopup
            selectedIds={node.attrs.figIds}
            anchorEl={document.createElement('div')}
            onClose={onCloseListener}
            onChange={jest.fn()}
          />
        </ThemeProvider>
      </Provider>
    );
    wrapper.find(ClickAwayListener).props().onClickAway(null);
  });
});

function givenFigureCitationNode(): ProsemirrorNode {
  const bodyEditorState = createBodyState(document.createElement('div'), '');
  return bodyEditorState.schema.nodes.figureCitation.createAndFill(
    { figIds: ['id1'] },
    bodyEditorState.schema.text('test content')
  );
}
