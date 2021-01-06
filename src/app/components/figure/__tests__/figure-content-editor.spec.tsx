import React from 'react';
import { create } from 'react-test-renderer';

import { FigureContentEditor } from 'app/components/figure/figure-content-editor';
import { createBodyState } from 'app/models/body';

jest.mock('app/components/rich-text-editor', () => ({
  RichTextEditor: () => <div data-cmp="rich-text-editor"></div>
}));

describe('FigureContentEditor', () => {
  it('should render a node', () => {
    const bodyEditorState = createBodyState(document.createElement('div'), '');
    const node = bodyEditorState.schema.nodes.figureLegend.create();

    const wrapper = create(<FigureContentEditor label="test" node={node} offset={0} />);
    expect(wrapper).toMatchSnapshot();
  });
});
