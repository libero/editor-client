import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { EditorView } from 'prosemirror-view';
import { Fragment } from 'prosemirror-model';
import { IconButton, TextField } from '@material-ui/core';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { FigureEditor } from 'app/components/figure/figure-editor';
import { createBodyState } from 'app/models/body';
import { getImageFileUpload } from 'app/utils/view.utils';
import { renderConfirmDialog } from 'app/components/prompt-dialog';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { updateFigureImageAction } from 'app/actions/manuscript.actions';

jest.mock('prosemirror-view');
jest.mock('app/components/prompt-dialog');
jest.mock('app/utils/view.utils');
jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
  };
});

jest.mock('@material-ui/core', () => ({
  IconButton: ({ children }) => <div data-cmp="IconButton">{children}</div>,
  TextField: ({ value, onChange, children }) => (
    <input onChange={onChange} value={value} data-cmp="TextField">
      {children}
    </input>
  )
}));

jest.mock('app/components/figure/figure-license-list', () => ({
  FigureLicensesList: () => <div data-cmp="FigureLicensesList" />
}));

jest.mock('app/components/figure/figure-content-editor', () => ({
  FigureContentEditor: () => <div data-cmp="FigureContentEditor" />
}));

describe('FigureEditor', () => {
  const mockStore = configureMockStore([]);
  const store = mockStore({
    manuscript: givenState({})
  });

  it('should render component', () => {
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('div'), '');
    const node = view.state.schema.nodes.figure.createAndFill(
      null,
      Fragment.fromArray([
        view.state.schema.node('figureTitle'),
        view.state.schema.node('figureLegend'),
        view.state.schema.node('figureAttribution')
      ])
    );

    const wrapper = create(
      <Provider store={store}>
        <FigureEditor
          node={node}
          getParentNodePos={() => 1}
          parentView={view}
          onDelete={jest.fn()}
          onAttributesChange={jest.fn()}
        />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should upload image', () => {
    jest.spyOn(store, 'dispatch');
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    const file = new File([], 'file.jpg');

    view.state = createBodyState(document.createElement('div'), '');
    const node = view.state.schema.nodes.figure.createAndFill(
      null,
      Fragment.fromArray([
        view.state.schema.node('figureTitle'),
        view.state.schema.node('figureLegend'),
        view.state.schema.node('figureAttribution')
      ])
    );
    const wrapper = mount(
      <Provider store={store}>
        <FigureEditor
          node={node}
          getParentNodePos={() => 1}
          parentView={view}
          onDelete={jest.fn()}
          onAttributesChange={jest.fn()}
        />
      </Provider>
    );

    wrapper.find(IconButton).at(0).prop('onClick').call(null);
    (getImageFileUpload as jest.Mock).mock.calls[0][0].call(null, file);
    expect(store.dispatch).toBeCalledWith(updateFigureImageAction({ figurePos: 1, imgFile: file }));
  });

  it('should update label', () => {
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('div'), '');
    const node = view.state.schema.nodes.figure.createAndFill(
      null,
      Fragment.fromArray([
        view.state.schema.node('figureTitle'),
        view.state.schema.node('figureLegend'),
        view.state.schema.node('figureAttribution')
      ])
    );
    const attrsChangeSpy = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <FigureEditor
          node={node}
          getParentNodePos={() => 1}
          parentView={view}
          onDelete={jest.fn()}
          onAttributesChange={attrsChangeSpy}
        />
      </Provider>
    );

    wrapper
      .find(TextField)
      .at(0)
      .prop('onChange')
      .call(null, { target: { value: 'new label' } });

    expect(attrsChangeSpy).toBeCalledWith('new label', '');
  });

  it('should show confirm dialog and delete', () => {
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('div'), '');
    const node = view.state.schema.nodes.figure.createAndFill(
      null,
      Fragment.fromArray([
        view.state.schema.node('figureTitle'),
        view.state.schema.node('figureLegend'),
        view.state.schema.node('figureAttribution')
      ])
    );
    const deleteSpy = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <FigureEditor
          node={node}
          getParentNodePos={() => 1}
          parentView={view}
          onDelete={deleteSpy}
          onAttributesChange={jest.fn()}
        />
      </Provider>
    );

    wrapper.find(IconButton).at(1).prop('onClick').call(null);
    wrapper.update();
    expect(renderConfirmDialog).toBeCalled();
    renderConfirmDialog['mock'].calls[0][2].call(null);
    expect(deleteSpy).toBeCalled();
  });
});
