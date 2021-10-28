import { getKeyFromQueryParams } from '../url.utils';

describe('getKeyFromQueryParams()', () => {
  it('can find keys', () => {
    expect(getKeyFromQueryParams('?name=joe&age=10', 'name')).toBe('joe');
    expect(getKeyFromQueryParams('?name=joe&age=10', 'age')).toBe('10');
  });

  it("can't find keys that don't exist", () => {
    expect(getKeyFromQueryParams('?name=joe&age=10', 'height')).toBe(undefined);
    expect(getKeyFromQueryParams('?name=joe&age=10&theirHeight=134', 'height')).toBe(undefined);
  });

  it('copes with bad input', () => {
    expect(getKeyFromQueryParams('', '')).toBe(undefined);
    expect(getKeyFromQueryParams('thisisabadstring', 'string')).toBe(undefined);
    expect(getKeyFromQueryParams('', 'string')).toBe(undefined);
  });
});
