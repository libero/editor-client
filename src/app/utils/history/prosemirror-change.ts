import { Transaction } from 'prosemirror-state';
import { Manuscript } from 'app/types/manuscript';
import { get, set } from 'lodash';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';

export class ProsemirrorChange implements Change {
  constructor(private path: string, private transaction: Transaction) {}

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
}
