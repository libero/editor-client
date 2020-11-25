import React from 'react';
import { create } from 'react-test-renderer';
import { EditorView } from 'prosemirror-view';
import { mount } from 'enzyme';
import { Fragment } from 'prosemirror-model';
import { ReplaceStep, ReplaceAroundStep } from 'prosemirror-transform';
import { IconButton, TextField } from '@material-ui/core';

import { createBodyState } from 'app/models/manuscript-state.factory';
import { FigureLicenseEditor } from 'app/components/figure/figure-license-editor';
import { NodeViewContext } from 'app/utils/view.utils';

jest.mock('prosemirror-view');
jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles,
    withStyles: jest.requireActual('@material-ui/core/styles').withStyles
  };
});

jest.mock('app/components/rich-text-editor', () => ({
  RichTextEditor: () => <div data-cmp="rich-text-editor"></div>
}));

jest.mock('app/components/select', () => ({
  Select: ({ onChange, value }) => <input onChange={onChange} value={value} data-cmp="Index" />
}));

jest.mock('@material-ui/core', () => ({
  IconButton: ({ children }) => <div data-cmp="IconButton">{children}</div>,
  TextField: ({ value, onChange, children }) => (
    <input onChange={onChange} value={value} data-cmp="TextField">
      {children}
    </input>
  )
}));

describe('FigureLicenseEditor', () => {
  it('should render component', () => {
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('div'), '');
    const node = view.state.schema.nodes.figureLicense.createAndFill(null);
    const wrapper = create(<FigureLicenseEditor node={node} offset={1} index={0} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should delete node', () => {
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('div'), '');
    const license = view.state.schema.node('figureLicense');

    const parentNode = view.state.schema.nodes.figure.createAndFill(
      { id: '', label: '', img: '' },
      Fragment.fromArray([license])
    );
    const change = view.state.tr.insert(0, parentNode);
    view.state = view.state.apply(change);

    const getNode = jest.fn().mockReturnValue(parentNode);
    const getPos = jest.fn().mockReturnValue(0);

    const wrapper = mount(
      <NodeViewContext.Provider value={{ view, getPos, getNode }}>
        <FigureLicenseEditor node={license} offset={1} index={0} />
      </NodeViewContext.Provider>
    );
    wrapper.find(IconButton).prop('onClick').call(null);
    expect(view.dispatch['mock'].calls[0][0].steps[0]).toBeInstanceOf(ReplaceStep);
  });

  it('should update node attributes', () => {
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('div'), '');
    const license = view.state.schema.node('figureLicense');

    const parentNode = view.state.schema.nodes.figure.createAndFill(
      { id: '', label: '', img: '' },
      Fragment.fromArray([license])
    );
    const change = view.state.tr.insert(0, parentNode);
    view.state = view.state.apply(change);

    const getNode = jest.fn().mockReturnValue(parentNode);
    const getPos = jest.fn().mockReturnValue(0);

    const wrapper = mount(
      <NodeViewContext.Provider value={{ view, getPos, getNode }}>
        <FigureLicenseEditor node={license} offset={2} index={0} />
      </NodeViewContext.Provider>
    );
    wrapper
      .find(TextField)
      .at(2)
      .prop('onChange')
      .call(null, { target: { name: 'copyrightHolder', value: 'Dart Veider' } });

    const step = view.dispatch['mock'].calls[0][0].steps[0];
    expect(step).toBeInstanceOf(ReplaceAroundStep);
    expect(step.slice.content.content[0].attrs.licenseInfo.copyrightHolder).toBe('Dart Veider');
  });
});
