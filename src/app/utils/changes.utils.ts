import { cloneDeepWith } from 'lodash';
import { EditorState } from 'prosemirror-state';

import { JSONObject } from 'app/types/utility.types';
import { Manuscript } from 'app/types/manuscript';
import { Change } from 'app/utils/history/change';
import { BatchChange } from 'app/utils/history/batch-change';
import { ProsemirrorChange } from 'app/utils/history/prosemirror-change';
import { RearrangingChange } from 'app/utils/history/rearranging-change';
import { UpdateObjectChange } from 'app/utils/history/update-object-change';
import { DeleteObjectChange } from 'app/utils/history/delete-object-change';
import { BackmatterEntity } from 'app/models/backmatter-entity';
import { Affiliation } from 'app/models/affiliation';
import { Person } from 'app/models/person';
import { Reference } from 'app/models/reference';
import { RelatedArticle } from 'app/models/related-article';
import { Keyword } from 'app/models/keyword';
import { AddObjectChange } from 'app/utils/history/add-object-change';

export function manuscriptEntityToJson<T>(object: T): JSONObject {
  return cloneDeepWith(object, (value) => {
    if (value instanceof EditorState) {
      return value.toJSON();
    }
  });
}

export function deserializeChanges(changesJson: JSONObject[]): Change[] {
  return changesJson.map((changeData) => {
    switch (changeData.type) {
      case 'prosemirror':
        return ProsemirrorChange.fromJSON(changeData);

      case 'rearranging':
        return RearrangingChange.fromJSON(changeData);

      case 'batch':
        return BatchChange.fromJSON(changeData);

      case 'update-object':
        return UpdateObjectChange.fromJSON(changeData);

      case 'delete-object':
        return DeleteObjectChange.fromJSON(changeData);

      case 'add-object':
        return AddObjectChange.fromJSON(changeData);

      default:
        throw new TypeError(
          `Cannot deserialize ${changeData.type} change. Change type invalid, JSON object malformed or handling not supported.`
        );
    }
  });
}

export function deserializeBackmatter(path: string, json: JSONObject): BackmatterEntity {
  if (path.indexOf('affiliations') >= 0) {
    return new Affiliation(json);
  }

  if (path.indexOf('authors') >= 0) {
    return new Person(json);
  }

  if (path.indexOf('references') >= 0) {
    return new Reference(json);
  }

  if (path.indexOf('relatedArticles') >= 0) {
    return new RelatedArticle(json);
  }

  if (path.match(/keywordGroups\.[^.]+\.keywords/)) {
    return new Keyword(json);
  }

  throw new Error(`deserialization of backmatter entity for  ${path} is not implemented or provided path is invalid`);
}

export function applyChangesFromServer(manuscript: Manuscript, changesJson: JSONObject[]): Manuscript {
  const allChanges = new BatchChange(deserializeChanges(changesJson));
  return allChanges.applyChange(manuscript);
}
