import React from 'react';
import { Node as ProsemirrorNode, Fragment } from 'prosemirror-model';
import { create } from 'react-test-renderer';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Button } from '@material-ui/core';

import { FigureLicensesList } from 'app/components/figure/figure-license-list';
import { createBodyState } from 'app/models/manuscript-state.factory';
import { NodeViewContext } from 'app/utils/view.utils';
import { ReplaceStep } from 'prosemirror-transform';

jest.mock('prosemirror-view');
jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
  };
});

jest.mock('app/components/figure/figure-license-editor', () => {
  return {
    FigureLicenseEditor: () => <div data-cmp="FigureLicenseEditor"></div>
  };
});

describe('FigureLicenseList', () => {
  it('should render list', () => {
    const licensesList = [
      { node: givenFigureLicenseNode(), offset: 1 },
      { node: givenFigureLicenseNode(), offset: 2 }
    ];
    const wrapper = create(<FigureLicensesList licenses={licensesList} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the list', () => {
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('div'), '');
    const licensesList = [
      { node: view.state.schema.node('figureLicense'), offset: 1 },
      { node: view.state.schema.node('figureLicense'), offset: 2 }
    ];

    const parentNode = view.state.schema.nodes.figure.createAndFill(
      { id: '', label: '', img: '' },
      Fragment.fromArray([licensesList[0].node, licensesList[1].node])
    );
    const change = view.state.tr.insert(0, parentNode);
    view.state = view.state.apply(change);

    const getNode = jest.fn().mockReturnValue(parentNode);
    const getPos = jest.fn().mockReturnValue(0);
    const wrapper = mount(
      <NodeViewContext.Provider value={{ view, getPos, getNode }}>
        <FigureLicensesList licenses={licensesList} />
      </NodeViewContext.Provider>
    );

    wrapper.find(Button).prop('onClick').call(null);
    expect(view.dispatch['mock'].calls[0][0].steps[0]).toBeInstanceOf(ReplaceStep);
  });
});

function givenFigureLicenseNode(): ProsemirrorNode {
  const bodyEditorState = createBodyState(document.createElement('div'), '');
  return bodyEditorState.schema.nodes.figureLicense.create();
}
