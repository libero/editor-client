import React, { useCallback, SyntheticEvent, useState } from 'react';
import { TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { ActionButton } from 'app/components/action-button';
import { useArticleInfoFormStyles } from 'app/containers/article-info-form-dialog/styles';
import { getArticleInformation } from 'app/selectors/manuscript.selectors';
import formGrid from 'app/styles/form-grid.module.scss';

const labelProps = { shrink: true };

export const ArticleInfoFormDialog: React.FC<{}> = () => {
  const classes = useArticleInfoFormStyles();
  const dispatch = useDispatch();
  const articleInfo = useSelector(getArticleInformation);

  const [userArticleInfo, setArticleInfo] = useState(articleInfo);

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleFormChange = useCallback(
    (event: SyntheticEvent) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      setArticleInfo({
        ...userArticleInfo,
        [fieldName]: newValue
      });
    },
    [userArticleInfo, setArticleInfo]
  );

  const handleAccept = useCallback(() => {
    if (!isEqual(userArticleInfo, articleInfo)) {
      dispatch(manuscriptActions.updateArticleInformationAction(userArticleInfo));
    }
    closeDialog();
  }, [closeDialog, articleInfo, userArticleInfo, dispatch]);

  return (
    <section className={classes.root}>
      <div className={formGrid.container}>
        <TextField
          fullWidth
          name="articleDOI"
          label="Article DOI"
          classes={{ root: formGrid.fullWidth }}
          InputLabelProps={labelProps}
          variant="outlined"
          multiline
          value={userArticleInfo.articleDOI}
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          name="publisherId"
          label="Publisher ID"
          classes={{ root: formGrid.fullWidth }}
          InputLabelProps={labelProps}
          variant="outlined"
          multiline
          value={userArticleInfo.publisherId}
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          name="elocationId"
          label="eLocation ID"
          classes={{ root: formGrid.fullWidth }}
          InputLabelProps={labelProps}
          variant="outlined"
          multiline
          value={userArticleInfo.elocationId}
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          name="volume"
          label="Volume"
          classes={{ root: formGrid.firstCol }}
          InputLabelProps={labelProps}
          variant="outlined"
          multiline
          value={userArticleInfo.volume}
          onChange={handleFormChange}
        />
      </div>
      <div className={classes.buttonPanel}>
        <ActionButton variant="secondaryOutlined" onClick={closeDialog} title="Cancel" />
        <ActionButton variant="primaryContained" onClick={handleAccept} title="Done" />
      </div>
    </section>
  );
};
