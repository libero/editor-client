import {
  createAbstractState,
  createAuthorsState,
  createKeywordGroupsState,
  createNewKeywordState,
  createTitleState
} from 'app/models/manuscript-state.factory';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

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

    const editorState = createKeywordGroupsState(Array.from(kwdContainer.querySelectorAll('kwd-group')));
    expect(editorState).toMatchSnapshot();
  });

  it('creates empty keyword state', () => {
    expect(createNewKeywordState()).toMatchSnapshot();
  });

  it('creates authors state', () => {
    const authorsContainer = document.createElement('div');
    authorsContainer.innerHTML = `
        <name><surname>Atherden</surname><given-names>Fred</given-names><suffix>Capt.</suffix></name>
        <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org/0000-0002-6048-1470</contrib-id>
        <email>f.atherden@elifesciences.org</email>`;

    expect(createAuthorsState([authorsContainer])).toMatchSnapshot();
  });
});
