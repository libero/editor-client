import React, { useCallback } from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from 'app/components/section-container';
import { ActionButton } from 'app/components/action-button';
import { getReferences } from 'app/selectors/manuscript.selectors';
import { Reference } from 'app/models/reference';
import { useReferencesListItemStyles, useReferencesListStyles } from 'app/containers/manuscript/references-list/styles';
import { stringifyEditorState } from 'app/utils/view.utils';

const getAnnotatedText = (reference: Reference, path: string) => {
  const editorState = get(reference, path);
  if (editorState) {
    const html = stringifyEditorState(editorState);
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }
};

const getLink = (reference: Reference) => {
  const url = get(reference, 'referenceInfo.extLink');
  return url ? (
    <a target="_blank" rel="noopener noreferrer" href={url}>
      {url}
    </a>
  ) : undefined;
};

const getDoiLink = (reference: Reference) => {
  const doi = get(reference, 'referenceInfo.doi');
  return doi ? (
    <span>
      doi: &nbsp;
      <a target="_blank" rel="noopener noreferrer" href={`https://doi.org/${doi}`}>
        {doi}
      </a>
    </span>
  ) : undefined;
};

const getPmidLink = (reference: Reference) => {
  const doi = get(reference, 'referenceInfo.doi');
  return doi ? (
    <span>
      pmid:&nbsp;
      <a target="_blank" rel="noopener noreferrer" href={`https://doi.org/${doi}`}>
        {doi}
      </a>
    </span>
  ) : undefined;
};

const getSpecificUse = (reference: Reference) => {
  const specificUse = get(reference, 'referenceInfo.specificUse');
  return {
    generated: 'Generated',
    analyzed: 'Analyzed'
  }[specificUse];
};

const getInPressStatus = (reference: Reference) => {
  const isInPress = get(reference, 'referenceInfo.inPress');
  return isInPress ? 'In press' : undefined;
};

const getAccessionLink = (reference: Reference) => {
  const accessionId = get(reference, 'referenceInfo.accessionId');
  const accessionUrl = get(reference, 'referenceInfo.accessionUrl');
  return accessionId ? (
    <span>
      accession:&nbsp;
      <a target="_blank" rel="noopener noreferrer" href={`${accessionUrl}`}>
        {accessionId}
      </a>
    </span>
  ) : undefined;
};

interface ReferenceItemProps {
  onEditCallback: () => void;
  reference: Reference;
}

const ReferenceItem: React.FC<ReferenceItemProps> = ({ onEditCallback, reference }) => {
  const classes = useReferencesListItemStyles();
  const authors = reference.authors
    .map((author) => {
      return get(author, 'groupName', `${author['lastName']} ${author['firstName']}`);
    })
    .join(', ');

  const content = [
    authors,
    get(reference, 'referenceInfo.date'),
    get(reference, 'referenceInfo.year'),
    getAnnotatedText(reference, 'referenceInfo.articleTitle'),
    getAnnotatedText(reference, 'referenceInfo.chapterTitle'),
    getAnnotatedText(reference, 'referenceInfo.dataTitle'),
    getAnnotatedText(reference, 'referenceInfo.conferenceName'),
    get(reference, 'referenceInfo.conferenceLocation'),
    get(reference, 'referenceInfo.conferenceDate'),
    getAnnotatedText(reference, 'referenceInfo.source'),
    get(reference, 'referenceInfo.edition'),
    get(reference, 'referenceInfo.volume'),
    get(reference, 'referenceInfo.firstPage'),
    get(reference, 'referenceInfo.lastPage'),
    get(reference, 'referenceInfo.elocationId'),
    get(reference, 'referenceInfo.publisherName'),
    get(reference, 'referenceInfo.publisherLocation'),
    getDoiLink(reference),
    getPmidLink(reference),
    getAccessionLink(reference),
    get(reference, 'referenceInfo.version'),
    get(reference, 'referenceInfo.patent'),
    getLink(reference),
    get(reference, 'referenceInfo.dateInCitation'),
    getSpecificUse(reference),
    getInPressStatus(reference)
  ].reduce((acc, item) => {
    if (item) {
      acc.push(item);
      acc.push(' ');
    }
    return acc;
  }, []);

  return (
    <li>
      <section className={classes.listItem}>
        <div className={classes.content}>{content}</div>
        <IconButton onClick={onEditCallback.bind(null, reference)} classes={{ root: classes.editButton }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </section>
    </li>
  );
};

export const ReferenceList: React.FC<{}> = () => {
  const references = useSelector(getReferences);
  const classes = useReferencesListStyles();
  const handleAddReference = useCallback(() => {
    //TODO: show modal here
  }, []);

  const handleEditReference = useCallback(() => {
    //TODO: show modal here
  }, []);

  return (
    <section>
      <SectionContainer label="References">
        <ul className={classes.list}>
          {references.map((reference) => (
            <ReferenceItem key={reference.id} reference={reference} onEditCallback={handleEditReference} />
          ))}
        </ul>
      </SectionContainer>
      <ActionButton variant="addEntity" title="Reference" onClick={handleAddReference} />
    </section>
  );
};
