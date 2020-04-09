import axios from 'axios';
import {getManuscriptContent} from "../manuscript.api";
import {EditorState} from "prosemirror-state";

jest.mock('axios');

describe('manuscript API', () => {

  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue(Promise.resolve({data: ''}));
  });

  it('loads manuscript data', async () => {
    const result = await getManuscriptContent('SOME_ID');

    expect(result).toEqual({
      title: expect.any(EditorState)
    });

    expect(axios.get).toHaveBeenCalledWith('/manuscripts/SOME_ID/manuscript.xml');
  });

});