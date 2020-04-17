import { inputRules, smartQuotes, emDash, ellipsis } from 'prosemirror-inputrules';
import { Plugin } from 'prosemirror-state';

export function buildInputRules(): Plugin {
  const rules = smartQuotes.concat(ellipsis, emDash);
  return inputRules({ rules });
}
