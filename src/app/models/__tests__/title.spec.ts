import { createTitleState } from 'app/models/title';

describe('Manuscript state factory', () => {
  it('creates title state', () => {
    const el = document.createElement('article-title');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createTitleState(el);
    expect(editorState).toMatchSnapshot();
  });
});
