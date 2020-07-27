import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useSelector, useDispatch } from 'react-redux';

import { SectionContainer } from 'app/components/section-container';
import { getArticleInformation } from 'app/selectors/manuscript.selectors';
import { useArticleInformationStyles } from 'app/containers/manuscript/article-information/styles';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { ArticleInfoFormDialog } from 'app/containers/article-info-form-dialog';

export const ArticleInformation: React.FC<{}> = () => {
  const articleInfo = useSelector(getArticleInformation);
  const dispatch = useDispatch();
  const editArticleInfo = useCallback(() => {
    dispatch(
      manuscriptEditorActions.showModalDialog({
        component: ArticleInfoFormDialog,
        title: 'Article Information'
      })
    );
  }, [dispatch]);

  const classes = useArticleInformationStyles();
  return (
    <SectionContainer label="Article information" className={classes.sectionContainer}>
      <section className={classes.infoSection}>
        <div>
          <strong> Article DOI: </strong> {articleInfo.articleDOI}
        </div>
        <div>
          <strong> Publisher ID: </strong> {articleInfo.publisherId}
        </div>
      </section>
      <IconButton classes={{ root: classes.editButton }} onClick={editArticleInfo}>
        <EditIcon fontSize="small" />
      </IconButton>
    </SectionContainer>
  );
};
