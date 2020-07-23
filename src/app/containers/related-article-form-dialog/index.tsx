import React, { useCallback, ChangeEvent, useState } from 'react';
import { TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { ActionButton } from 'app/components/action-button';
import { createNewRelatedArticle, RelatedArticle } from 'app/models/related-article';
import { useRelatedArticleStyles } from 'app/containers/related-article-form-dialog/styles';
import { PromptDialog } from 'app/components/prompt-dialog';
import { Select } from 'app/components/select';

const labelProps = { shrink: true };

interface RelatedArticleFormDialogProps {
  article?: RelatedArticle;
}

const renderConfirmDialog = (title: string, msg: string, onAccept: () => void, onReject: () => void) => {
  return (
    <PromptDialog
      title={title}
      message={msg}
      isOpen={true}
      onAccept={onAccept}
      onReject={onReject}
      acceptLabel="Delete"
      rejectLabel="Cancel"
      acceptVariant="containedWarning"
      rejectVariant="secondaryOutlined"
    />
  );
};

export const RelatedArticleFormDialog: React.FC<RelatedArticleFormDialogProps> = ({ article }) => {
  const [userArticle, setUserArticle] = useState(article || createNewRelatedArticle());
  const [isConfirmShown, setConfirmSnow] = useState<boolean>(false);
  const isNewArticle = !article;
  const classes = useRelatedArticleStyles();
  const dispatch = useDispatch();

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleAccept = useCallback(() => {
    setConfirmSnow(false);
    dispatch(manuscriptActions.deleteRelatedArticleAction(userArticle));
    closeDialog();
  }, [setConfirmSnow, userArticle, closeDialog, dispatch]);

  const handleReject = useCallback(() => {
    setConfirmSnow(false);
  }, [setConfirmSnow]);

  const handleFormChange = useCallback(
    (event: ChangeEvent<{ name: string; value: any }>) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      setUserArticle({
        ...userArticle,
        [fieldName]: newValue
      });
    },
    [userArticle, setUserArticle]
  );

  const handleDone = useCallback(() => {
    if (isNewArticle) {
      dispatch(manuscriptActions.addRelatedArticleAction(userArticle));
    } else {
      dispatch(manuscriptActions.updateRelatedArticleAction(userArticle));
    }

    closeDialog();
  }, [closeDialog, userArticle, dispatch, isNewArticle]);

  const handleDelete = useCallback(() => {
    setConfirmSnow(true);
  }, [setConfirmSnow]);

  return (
    <section className={classes.root}>
      <TextField
        fullWidth
        name="href"
        label="Article DOI"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        multiline
        value={userArticle.href}
        onChange={handleFormChange}
      />
      <Select
        className={classes.inputField}
        name="articleType"
        placeholder="Please select"
        fullWidth
        blankValue={''}
        label="Article type"
        value={userArticle.articleType}
        onChange={handleFormChange}
        options={[
          { label: 'article-reference', value: 'article-reference' },
          { label: 'commentary', value: 'commentary' },
          { label: 'commentary-article', value: 'commentary-article' },
          { label: 'corrected-article', value: 'corrected-article' },
          { label: 'retracted-article', value: 'retracted-article' }
        ]}
      />
      <div className={classes.buttonPanel}>
        {!isNewArticle ? <ActionButton variant="outlinedWarning" onClick={handleDelete} title="Delete" /> : undefined}
        <div aria-hidden={true} className={classes.spacer}></div>
        <ActionButton variant="secondaryOutlined" onClick={closeDialog} title="Cancel" />
        <ActionButton variant="primaryContained" onClick={handleDone} title="Done" />
      </div>
      {isConfirmShown
        ? renderConfirmDialog(
            'You are deleting a related article',
            'Are you sure you want to proceed?',
            handleAccept,
            handleReject
          )
        : undefined}
    </section>
  );
};
