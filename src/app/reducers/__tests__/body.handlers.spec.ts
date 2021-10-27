import { givenState } from '../../test-utils/reducer-test-helpers';
import { updateManuscriptState } from '../../utils/history.utils';
import { updateBody } from '../body.handlers';

jest.mock('../../utils/history.utils');

describe('body reducer', () => {
  it('should update body', () => {
    const state = givenState({});
    const change = state.data.present.abstract.tr;
    const expectedStateData = givenState({}).data;
    (updateManuscriptState as jest.Mock).mockReturnValue(expectedStateData);

    expect(updateBody(state, change)).toEqual({
      ...state,
      data: expectedStateData
    });

    expect(updateManuscriptState).toBeCalledWith(state.data, 'body', change);
  });
});
