import { createAsyncAction } from '../action.utils';

describe('Async Action', () => {
  it('should create async action', () => {
    const action = createAsyncAction('TEST');
    expect(action.request.getType()).toBe('TEST_REQUEST');
    expect(action.success.getType()).toBe('TEST_SUCCESS');
    expect(action.error.getType()).toBe('TEST_ERROR');
  });
});
