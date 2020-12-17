import { createAbstractState, createImpactStatementState } from 'app/models/abstract';

describe('Manuscript state factory', () => {
  it('creates abstract state', () => {
    const el = document.createElement('abstract');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createAbstractState(el);
    expect(editorState).toMatchSnapshot();
  });

  it('creates impact statement state', () => {
    const el = document.createElement('abstract');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createImpactStatementState(el);
    expect(editorState).toMatchSnapshot();
  });
});
