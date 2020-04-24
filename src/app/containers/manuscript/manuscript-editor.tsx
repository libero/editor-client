import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getKeywords, getTitle} from "../../selectors/manuscript.selectors";
import * as manuscriptActions from "../../actions/manuscript.actions";
import {RichTextEditor} from "../../components/rich-text-editor";

import {EditorState, Transaction} from "prosemirror-state";
import {KeywordsEditor} from "../../components/keywords";
import {KeywordGroups} from "../../models/manuscript";

export const ManuscriptEditor:React.FC = () => {
  const dispatch = useDispatch();

  const title:EditorState = useSelector(getTitle);
  const allKeywords:KeywordGroups = useSelector(getKeywords);

  const handleTitleChange = (diff: Transaction) => {
    dispatch(manuscriptActions.updateTitleAction(diff));
  };

  const handleKeywordsChange = (keywordGroup: string, index: number, diff: Transaction) => {
    dispatch(manuscriptActions.updateKeywordsAction({keywordGroup, index, change: diff}));
  };

  const handleKeywordDelete = (keywordGroup: string, index: number) => {
    dispatch(manuscriptActions.deleteKeywordAction({keywordGroup, index}));
  };

  const renderKeywords = (keywordGroups: KeywordGroups) => {
    return Object.entries(keywordGroups).map(([groupType, keywords]) => {
      return <div className="manuscript-field" key={groupType}>
        <KeywordsEditor
          keywords={keywords}
          label={groupType}
          onChange={handleKeywordsChange.bind(null, groupType)}
          onDelete={handleKeywordDelete.bind(null, groupType)}
        />
      </div>
    });
  }

  return (<>
    <div className="manuscript-field">
      <RichTextEditor editorState={title} label="Title" onChange={handleTitleChange} />
    </div>
    {renderKeywords(allKeywords)}
  </>)
}