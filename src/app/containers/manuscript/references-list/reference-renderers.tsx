import React from 'react';
import { EditorState } from 'prosemirror-state';
import moment from 'moment';
import { get } from 'lodash';
import Interweave from 'interweave';

import { Reference } from '../../../models/reference';
import { stringifyEditorState } from '../../../utils/view.utils';
import {
  BookReference,
  ConferenceReference,
  DataReference,
  JournalReference,
  PatentReference,
  PeriodicalReference,
  PrePrintReference,
  ReportReference,
  SoftwareReference,
  ThesisReference,
  WebReference
} from '../../../models/reference-type';

const getAnnotatedText = (editorState: EditorState, suffix: string = ''): React.ReactNode => {
  if (editorState.doc.childCount) {
    const html = stringifyEditorState(editorState);
    return (
      <>
        <Interweave content={html} />
        {suffix}
      </>
    );
  }
};

const formatDate = (isoDate: string): string => {
  return moment(isoDate).format('MMMM D, YYYY');
};

const renderDoi = (doi: string | undefined): React.ReactNode => {
  if (doi) {
    return (
      <>
        {' '}
        doi:{' '}
        <a target="_blank" rel="noopener noreferrer" href={`https://doi.org/${doi}`}>
          https://doi.org/{doi}
        </a>
        .
      </>
    );
  }
};

const renderPmid = (pmid: string | undefined): React.ReactNode => {
  if (pmid) {
    return (
      <>
        {' '}
        pmid:{' '}
        <a target="_blank" rel="noopener noreferrer" href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`}>
          {pmid}
        </a>
        .
      </>
    );
  }
};

export const renderJournalReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as JournalReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle, '. ')}
      <em>{getAnnotatedText(referenceInfo.source)}</em> {referenceInfo.inPress ? ' In Press.' : undefined}
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}:` : undefined}</strong>
      {referenceInfo.firstPage && referenceInfo.lastPage
        ? `${referenceInfo.firstPage}-${referenceInfo.lastPage}. `
        : undefined}
      {referenceInfo.elocationId ? `${referenceInfo.elocationId}.` : undefined}
      {renderDoi(referenceInfo.doi)}
      {renderPmid(referenceInfo.pmid)}
    </>
  );
};

export const renderBookReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as BookReference;
  const authors = getReferenceAuthors(reference);
  const editors = referenceInfo.editors
    .map((editor) => {
      return get(editor, 'groupName', `${editor['lastName']} ${editor['firstName']}`);
    })
    .join(', ');

  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.chapterTitle, '. ')}
      {editors ? `In: ${editors} (Ed${referenceInfo.editors.length > 1 ? 's' : ''}). ` : undefined}
      <em>{getAnnotatedText(referenceInfo.source, ' ')}</em> {referenceInfo.inPress ? 'In Press.' : undefined}
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}. ` : undefined}</strong>
      {referenceInfo.edition ? ` ${referenceInfo.edition}.` : undefined}
      {referenceInfo.elocationId ? `${referenceInfo.elocationId}.` : undefined}
      {referenceInfo.publisherLocation ? ` ${referenceInfo.publisherLocation}:` : undefined}
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}. ` : undefined}
      {referenceInfo.firstPage && referenceInfo.lastPage
        ? `p. ${referenceInfo.firstPage}-${referenceInfo.lastPage}. `
        : undefined}
      {renderDoi(referenceInfo.doi)}
      {renderPmid(referenceInfo.pmid)}
    </>
  );
};

export const renderConferenceReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as ConferenceReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle, '. ')}
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}:` : undefined}</strong>
      {referenceInfo.conferenceName ? getAnnotatedText(referenceInfo.conferenceName, '.') : undefined}
      {referenceInfo.conferenceLocation ? ` ${referenceInfo.conferenceLocation}` : undefined}
      {referenceInfo.firstPage && referenceInfo.lastPage
        ? ` p. ${referenceInfo.firstPage}-${referenceInfo.lastPage}.`
        : undefined}
      {referenceInfo.conferenceDate ? ` ${referenceInfo.conferenceDate}.` : undefined}
      {referenceInfo.elocationId ? ` ${referenceInfo.elocationId}.` : undefined}
      {renderDoi(referenceInfo.doi)}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderThesisReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as ThesisReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle)}.
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}:` : undefined}
      {referenceInfo.publisherLocation ? ` ${referenceInfo.publisherLocation}.` : undefined}
      {renderDoi(referenceInfo.doi)}
      {renderPmid(referenceInfo.pmid)}
    </>
  );
};

export const renderSoftwareReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as SoftwareReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle, '.')}
      <em>{getAnnotatedText(referenceInfo.source, '.')}</em>
      {referenceInfo.publisherLocation ? ` ${referenceInfo.publisherLocation}:` : undefined}
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}. ` : undefined}
      {renderDoi(referenceInfo.doi)}
      {referenceInfo.version ? ` version: ${referenceInfo.version}. ` : undefined}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderReportReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as ReportReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. <em>{getAnnotatedText(referenceInfo.source)}</em>
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}:` : undefined}</strong>
      {referenceInfo.publisherLocation ? ` ${referenceInfo.publisherLocation}:` : undefined}
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}. ` : undefined}
      {renderDoi(referenceInfo.doi)}
      {renderPmid(referenceInfo.pmid)}
      {referenceInfo.isbn ? ` ${referenceInfo.isbn}. ` : undefined}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderPeriodicalReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as PeriodicalReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {formatDate(referenceInfo.date)}. {getAnnotatedText(referenceInfo.articleTitle, '. ')}
      <em>{getAnnotatedText(referenceInfo.source)}</em>{' '}
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}:` : undefined}</strong>
      {referenceInfo.firstPage && referenceInfo.lastPage
        ? `${referenceInfo.firstPage}-${referenceInfo.lastPage}. `
        : undefined}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderPatentReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as PatentReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle, '. ')}
      <em>{getAnnotatedText(referenceInfo.source)}</em>
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}.` : undefined}
      {renderDoi(referenceInfo.doi)}
      {referenceInfo.patent ? ` ${referenceInfo.patent}. ` : undefined}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderWebReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as WebReference;
  const authors = getReferenceAuthors(reference);
  const formattedDate = referenceInfo.dateInCitation ? formatDate(referenceInfo.dateInCitation) : undefined;
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle, '. ')}
      <em>{getAnnotatedText(referenceInfo.source, ' ')}</em>
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
      {formattedDate ? ` [Accessed: ${formattedDate}]` : undefined}
    </>
  );
};

export const renderPreprintReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as PrePrintReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle, '. ')}
      <em>{getAnnotatedText(referenceInfo.source)}</em>
      {renderDoi(referenceInfo.doi)}
      {renderPmid(referenceInfo.pmid)}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderDataReference = (reference: Reference): React.ReactNode => {
  const referenceInfo = reference.referenceInfo as DataReference;
  const specificUse = {
    generated: 'Generated',
    analyzed: 'Analyzed'
  }[referenceInfo.specificUse];

  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.dataTitle, '. ')}
      <em>{getAnnotatedText(referenceInfo.source)}</em> {renderDoi(referenceInfo.doi)}
      {referenceInfo.accessionId ? ` accession: ${referenceInfo.accessionId}.` : undefined}
      {referenceInfo.version ? ` version: ${referenceInfo.version}.` : undefined}{' '}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined} {specificUse}
    </>
  );
};

const getReferenceAuthors = (reference: Reference): string => {
  return reference.authors
    .map((author) => {
      return get(author, 'groupName', `${author['lastName']} ${author['firstName']}`);
    })
    .join(', ');
};

const getExtLinkTag = (url: string): React.ReactNode => {
  return (
    <>
      {' '}
      url:{' '}
      <a target="_blank" rel="noopener noreferrer" href={url}>
        {url}
      </a>
    </>
  );
};
