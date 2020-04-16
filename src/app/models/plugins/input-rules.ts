import {inputRules, smartQuotes, emDash, ellipsis} from "prosemirror-inputrules"

export function buildInputRules(schema) {
  let rules = smartQuotes.concat(ellipsis, emDash);
  return inputRules({rules});
}
