import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as manuscriptEditorAction from 'app/actions/manuscript-editor.actions';

export const ClearFocus: React.FC<{ className?: string }> = ({ children, className }) => {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(manuscriptEditorAction.removeFocusAction());
  }, [dispatch]);

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};
