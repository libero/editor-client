import { givenState } from 'app/test-utils/reducer-test-helpers';
import { updateManuscriptState } from 'app/utils/history.utils';
import { updateTitle } from 'app/reducers/title.handlers';

jest.mock('../../utils/history.utils');

describe('abstract reducer', () => {
  it('should update abstract', () => {
    const state = givenState({});
    const change = state.data.present.title.tr;
    const expectedStateData = givenState({}).data;
    (updateManuscriptState as jest.Mock).mockReturnValue(expectedStateData);

    expect(updateTitle(state, change)).toEqual({
      ...state,
      data: expectedStateData
    });

    expect(updateManuscriptState).toBeCalledWith(state.data, 'title', change);
  });
});
