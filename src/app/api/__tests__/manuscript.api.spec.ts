import axios from 'axios';
import { getManuscriptContent } from 'app/api/manuscript.api';
import { EditorState } from 'prosemirror-state';

jest.mock('axios');

describe('manuscript API', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue(Promise.resolve({ data: '<article />' }));
  });

  it('loads manuscript data', async () => {
    const result = await getManuscriptContent('SOME_ID');
    expect(result.title).toEqual(expect.any(EditorState));
    expect(result.abstract).toEqual(expect.any(EditorState));
    expect(result.impactStatement).toEqual(expect.any(EditorState));
    expect(result.keywordGroups).toEqual(expect.any(Object));
    expect(result.authors).toEqual(expect.any(Array));

    expect(axios.get).toHaveBeenCalledWith('/api/v1/articles/SOME_ID/', { headers: { Accept: 'application/xml' } });
  });
});
