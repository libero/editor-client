import { givenState } from 'app/test-utils/reducer-test-helpers';
import { updateManuscriptState } from 'app/utils/history.utils';
import { updateAcknowledgements } from 'app/reducers/acknowledgements.handlers';

jest.mock('../../utils/history.utils');

describe('acknowledgements reducer', () => {
  it('should update acknowledgements', () => {
    const state = givenState({});
    const change = state.data.present.acknowledgements.tr;
    const expectedStateData = givenState({}).data;
    (updateManuscriptState as jest.Mock).mockReturnValue(expectedStateData);

    expect(updateAcknowledgements(state, change)).toEqual({
      ...state,
      data: expectedStateData
    });

    expect(updateManuscriptState).toBeCalledWith(state.data, 'acknowledgements', change);
  });
});
