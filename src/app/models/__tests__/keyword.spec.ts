import { createKeywordGroupsState, createNewKeywordState } from 'app/models/keyword';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

describe('Manuscript state factory', () => {
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
});
