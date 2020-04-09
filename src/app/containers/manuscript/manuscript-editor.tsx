import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getManuscriptTitle} from "../../selectors/manuscript.selectors";
import * as manuscriptActions from "../../actions/manuscript.actions";
import {RichTextEditor} from "../../components/rich-text-editor";

import {EditorState, Transaction} from "prosemirror-state";

export const ManuscriptEditor:React.FC = () => {
  const dispatch = useDispatch();

  const title:EditorState = useSelector(getManuscriptTitle);

  const handleTitleChange = (diff: Transaction) => {
    dispatch(manuscriptActions.updateTitleAction(diff));
  };
  return <RichTextEditor editorState={title} onChange={handleTitleChange} />;
}