import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from 'app/components/section-container';
import { getRelatedArticles } from 'app/selectors/manuscript.selectors';
import { useRelatedArticleStyles } from 'app/containers/manuscript/related-articles/styles';
import { RelatedArticle } from 'app/models/related-article';
import { ActionButton } from 'app/components/action-button';

const getUrl = (href: string, type: string) => {
  return (
    {
      doi: `https://doi.org/${href}`
    }[type] || href
  );
};

export const RelatedArticles: React.FC = () => {
  const relatedArticles = useSelector(getRelatedArticles);
  const classes = useRelatedArticleStyles();

  const handleEditRelatedArticle = useCallback((relatedArticle: RelatedArticle) => {}, []);
  const handleAddRelatedArticle = useCallback(() => {}, []);

  return (
    <section>
      <SectionContainer label="Related articles">
        <ul className={classes.list}>
          {relatedArticles.map((relatedArticle) => (
            <li>
              <div className={classes.listItem}>
                <div className={classes.info}>
                  {relatedArticle.linkType}:{' '}
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={getUrl(relatedArticle.href, relatedArticle.linkType)}
                  >
                    {getUrl(relatedArticle.href, relatedArticle.linkType)}
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
      <ActionButton variant="addEntity" title="Article" onClick={handleAddRelatedArticle} />
    </section>
  );
};
