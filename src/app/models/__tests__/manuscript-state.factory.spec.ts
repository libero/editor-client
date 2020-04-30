import {
  createAbstractState,
  createKeywordsState,
  createNewKeywordState,
  createTitleState
} from '../manuscript-state.factory';

describe('Manuscript state factory', () => {
  it('creates title state', () => {
    const el = document.createElement('article-title');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createTitleState(el);
    expect(editorState).toMatchSnapshot();
  });

  it('creates abstract state', () => {
    const el = document.createElement('abstract');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createAbstractState(el);
    expect(editorState).toMatchSnapshot();
  });

  it('creates keywords state', () => {
    const kwdContainer = document.createElement('div');
    kwdContainer.innerHTML = `<kwd-group kwd-group-type="author-keywords">
        <kwd>cerebellum</kwd>
        <kwd>climbing fiber</kwd>
        <kwd>reinforcement learning</kwd>
        <kwd><italic>vitae</italic></kwd>
        <kwd>Purkinje cells</kwd>
      </kwd-group>
      <kwd-group kwd-group-type="research-organism">
        <title>Research organism</title>
        <kwd>Mouse</kwd>
      </kwd-group>`;

    const editorState = createKeywordsState(Array.from(kwdContainer.querySelectorAll('kwd-group')));
    expect(editorState).toMatchSnapshot();
  });

  it('creates empty keyword state', () => {
    expect(createNewKeywordState()).toMatchSnapshot();
  });
});
