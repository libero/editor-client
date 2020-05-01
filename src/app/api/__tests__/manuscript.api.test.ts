import axios from 'axios';
import { getManuscriptContent } from '../manuscript.api';
import { EditorState } from 'prosemirror-state';

jest.mock('axios');

describe('manuscript API', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue(Promise.resolve({ data: '' }));
  });

  it('loads manuscript data', async () => {
    const result = await getManuscriptContent('SOME_ID');

    expect(result).toEqual({
      title: expect.any(EditorState),
      abstract: expect.any(EditorState),
      keywords: expect.any(Object)
    });

    expect(axios.get).toHaveBeenCalledWith('/api/v1/articles/SOME_ID/');
  });
});
