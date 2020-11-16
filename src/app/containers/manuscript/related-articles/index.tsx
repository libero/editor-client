import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from 'app/components/section-container';
import { getRelatedArticles } from 'app/selectors/manuscript.selectors';
import { useRelatedArticleStyles } from 'app/containers/manuscript/related-articles/styles';
import { RelatedArticle } from 'app/models/related-article';
import { ActionButton } from 'app/components/action-button';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { RelatedArticleFormDialog } from 'app/containers/related-article-form-dialog';
import { ComponentWithId } from 'app/utils/types';

export const RelatedArticles: React.FC<ComponentWithId> = ({ id }) => {
  const relatedArticles = useSelector(getRelatedArticles);
  const classes = useRelatedArticleStyles();
  const dispatch = useDispatch();

  const handleEditRelatedArticle = useCallback(
    (relatedArticle: RelatedArticle) => {
      dispatch(
        manuscriptEditorActions.showModalDialog({
          component: RelatedArticleFormDialog,
          props: { article: relatedArticle },
          title: 'Related article'
        })
      );
    },
    [dispatch]
  );

  const handleAddRelatedArticle = useCallback(() => {
    dispatch(
      manuscriptEditorActions.showModalDialog({
        component: RelatedArticleFormDialog,
        props: {},
        title: 'Related article'
      })
    );
  }, [dispatch]);

  return (
    <section>
      <SectionContainer label="Related articles" id={id}>
        <ul className={classes.list}>
          {relatedArticles.map((relatedArticle) => (
            <li>
              <div className={classes.listItem}>
                <div className={classes.info}>
                  doi:{' '}
                  <a rel="noopener noreferrer" target="_blank" href={`https://doi.org/${relatedArticle.href}`}>
                    https://doi.org/{relatedArticle.href}
                  </a>{' '}
                  type: {relatedArticle.articleType}
                </div>
                <IconButton
                  classes={{ root: classes.editButton }}
                  onClick={handleEditRelatedArticle.bind(null, relatedArticle)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      </SectionContainer>
      <ActionButton variant="addEntity" title="Add Article" onClick={handleAddRelatedArticle} />
    </section>
  );
};
