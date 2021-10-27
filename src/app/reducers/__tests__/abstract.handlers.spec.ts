import { givenState } from '../../test-utils/reducer-test-helpers';
import { updateAbstract, updateImpactStatement } from '../abstract.handlers';
import { updateManuscriptState } from '../../utils/history.utils';

jest.mock('../../utils/history.utils');

describe('abstracts reducer', () => {
  it('should update abstract', () => {
    const state = givenState({});
    const change = state.data.present.abstract.tr;
    const expectedStateData = givenState({}).data;
    (updateManuscriptState as jest.Mock).mockReturnValue(expectedStateData);

    expect(updateAbstract(state, change)).toEqual({
      ...state,
      data: expectedStateData
    });

    expect(updateManuscriptState).toBeCalledWith(state.data, 'abstract', change);
  });

  it('should update impact statement', () => {
    const state = givenState({});
    const change = state.data.present.abstract.tr;
    const expectedStateData = givenState({}).data;
    (updateManuscriptState as jest.Mock).mockReturnValue(expectedStateData);

    expect(updateImpactStatement(state, change)).toEqual({
      ...state,
      data: expectedStateData
    });

    expect(updateManuscriptState).toBeCalledWith(state.data, 'impactStatement', change);
  });
});
