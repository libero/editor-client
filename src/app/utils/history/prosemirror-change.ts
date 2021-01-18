import { Transaction } from 'prosemirror-state';
import { get, set } from 'lodash';

import { Manuscript } from 'app/types/manuscript';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';
import { JSONObject } from 'app/types/utility.types';

export class ProsemirrorChange extends Change {
  constructor(private path: string, private transaction: Transaction) {
    super();
  }

  get isEmpty(): boolean {
    return !this.transaction.docChanged;
  }

  applyChange(manuscript: Manuscript): Manuscript {
    const editorState = get(manuscript, this.path);
    return set(cloneManuscript(manuscript), this.path, editorState.apply(this.transaction));
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    const invertedSteps = this.transaction.steps.map((step, index) => {
      return step.invert(this.transaction.docs[index]);
    });

    const editorState = get(manuscript, this.path);
    const rollbackTransaction = editorState.tr;
    invertedSteps.reverse().forEach((step) => rollbackTransaction.maybeStep(step));

    return set(cloneManuscript(manuscript), this.path, editorState.apply(rollbackTransaction));
  }

  toJSON(): JSONObject {
    return {
      type: 'prosemirror',
      timestamp: this.timestamp,
      path: this.path,
      transactionSteps: this.transaction.steps.map((step) => step.toJSON())
    };
  }
}
