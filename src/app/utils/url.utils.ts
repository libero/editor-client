/**
 * Extracts the value for the specified key from the supplied query parameters string
 *
 * @export
 * @param {string} params The query parameter string, e.g. '?name=joe&age=10'.
 * @param {string} key The key to find and return the value, e.g. 'name'.
 * @returns {(string | undefined)}
 */
export function getKeyFromQueryParams(params: string, key: string): string | undefined {
  let retVal = undefined;
  const regex = new RegExp(`A?${key}=([^&]+)&*`);
  const found = params.match(regex);
  if (found) {
    retVal = found[1];
  }
  return retVal;
}
