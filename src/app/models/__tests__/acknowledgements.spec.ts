import { createAcknowledgementsState } from 'app/models/acknowledgements';

describe('Manuscript state factory', () => {
  it('creates acknowledgements state', () => {
    const el = document.createElement('abstract');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createAcknowledgementsState(el);
    expect(editorState).toMatchSnapshot();
  });
});
