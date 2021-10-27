import { createBodyState } from '../body';

describe('Manuscript state factory', () => {
  it('creates body state', () => {
    const el = document.createElement('body');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createBodyState(el, 'SOME_ID');
    expect(editorState).toMatchSnapshot();
  });
});
