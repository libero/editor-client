import React from 'react';
import { EditorState } from 'prosemirror-state';
import { get } from 'lodash';

import {
  BookReference,
  ConferenceReference,
  DataReference,
  JournalReference,
  PatentReference,
  PeriodicalReference,
  PrePrintReference,
  Reference,
  ReportReference,
  SoftwareReference,
  ThesisReference,
  WebReference
} from 'app/models/reference';
import { stringifyEditorState } from 'app/utils/view.utils';

const getAnnotatedText = (editorState: EditorState) => {
  const html = stringifyEditorState(editorState);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export const renderJournalReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as JournalReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle)}.{' '}
      <em>{getAnnotatedText(referenceInfo.source)}</em> {referenceInfo.inPress ? ' In Press.' : undefined}
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}:` : undefined}</strong>
      {referenceInfo.firstPage && referenceInfo.lastPage
        ? ` p.${referenceInfo.firstPage}-${referenceInfo.lastPage}.`
        : undefined}
      {referenceInfo.elocationId ? ` ${referenceInfo.elocationId}.` : undefined}
      {referenceInfo.doi ? ` doi: ${referenceInfo.doi}.` : undefined}
      {referenceInfo.pmid ? ` pmid: ${referenceInfo.pmid}.` : undefined}
    </>
  );
};

export const renderBookReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as BookReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.chapterTitle)}.
      <em>{getAnnotatedText(referenceInfo.source)}</em> {referenceInfo.inPress ? ' In Press.' : undefined}
      {referenceInfo.edition ? ` ${referenceInfo.edition}.` : undefined}
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}:` : undefined}</strong>
      {referenceInfo.firstPage && referenceInfo.lastPage
        ? ` p.${referenceInfo.firstPage}-${referenceInfo.lastPage}.`
        : undefined}
      {referenceInfo.elocationId ? ` ${referenceInfo.elocationId}.` : undefined}
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}:` : undefined}
      {referenceInfo.publisherLocation ? ` ${referenceInfo.publisherLocation}.` : undefined}
      {referenceInfo.doi ? ` doi: ${referenceInfo.doi}.` : undefined}
      {referenceInfo.pmid ? ` pmid: ${referenceInfo.pmid}.` : undefined}
    </>
  );
};

export const renderConferenceReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as ConferenceReference;
  /*
  *   year: number;
  articleTitle: EditorState;
  conferenceName: EditorState;
  conferenceLocation: string;
  conferenceDate: string;
  volume: number;
  extLink: string;
  elocationId: string;
  doi: string;
  pmid: string;
  firstPage: number;
  lastPage: number;
  * */
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle)}.
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}:` : undefined}</strong>
      {referenceInfo.firstPage && referenceInfo.lastPage
        ? ` p.${referenceInfo.firstPage}-${referenceInfo.lastPage}.`
        : undefined}
      {referenceInfo.conferenceLocation ? ` ${referenceInfo.conferenceLocation}:` : undefined}
      {referenceInfo.conferenceName ? [getAnnotatedText(referenceInfo.conferenceName), '.'] : undefined}
      {referenceInfo.conferenceDate ? ` ${referenceInfo.conferenceDate}.` : undefined}
      {referenceInfo.elocationId ? ` ${referenceInfo.elocationId}.` : undefined}
      {referenceInfo.doi ? ` doi: ${referenceInfo.doi}.` : undefined}
      {referenceInfo.pmid ? ` pmid: ${referenceInfo.pmid}.` : undefined}
    </>
  );
};

export const renderThesisReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as ThesisReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle)}.
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}:` : undefined}
      {referenceInfo.publisherLocation ? ` ${referenceInfo.publisherLocation}.` : undefined}
      {referenceInfo.doi ? ` doi: ${referenceInfo.doi}.` : undefined}
      {referenceInfo.pmid ? ` pmid: ${referenceInfo.pmid}.` : undefined}{' '}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderSoftwareReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as SoftwareReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.dataTitle)}.
      <em>{getAnnotatedText(referenceInfo.source)}</em>
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}:` : undefined}
      {referenceInfo.publisherLocation ? ` ${referenceInfo.publisherLocation}.` : undefined}
      {referenceInfo.doi ? ` doi: ${referenceInfo.doi}.` : undefined}
      {referenceInfo.pmid ? ` pmid: ${referenceInfo.pmid}.` : undefined}
      {referenceInfo.version ? ` version: ${referenceInfo.version}. ` : undefined}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderReportReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as ReportReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. <em>{getAnnotatedText(referenceInfo.source)}</em>
      {referenceInfo.patent ? ` ${referenceInfo.patent}.` : undefined}
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}. ` : undefined}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderPeriodicalReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as PeriodicalReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.date}. {getAnnotatedText(referenceInfo.articleTitle)}.{' '}
      <em>{getAnnotatedText(referenceInfo.source)}</em>
      <strong>{referenceInfo.volume ? ` ${referenceInfo.volume}:` : undefined}</strong>
      {referenceInfo.firstPage && referenceInfo.lastPage
        ? ` p.${referenceInfo.firstPage}-${referenceInfo.lastPage}. `
        : undefined}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderPatentReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as PatentReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle)}.{' '}
      <em>{getAnnotatedText(referenceInfo.source)}</em>
      {referenceInfo.publisherName ? ` ${referenceInfo.publisherName}.` : undefined}
      {referenceInfo.doi ? ` doi: ${referenceInfo.doi}.` : undefined}
      {referenceInfo.pmid ? ` pmid: ${referenceInfo.pmid}.` : undefined}{' '}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderWebReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as WebReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle)}.{' '}
      <em>{getAnnotatedText(referenceInfo.source)}</em>{' '}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined} {referenceInfo.dateInCitation}
    </>
  );
};

export const renderPreprintReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as PrePrintReference;
  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.articleTitle)}.{' '}
      <em>{getAnnotatedText(referenceInfo.source)}</em>
      {referenceInfo.doi ? ` doi: ${referenceInfo.doi}.` : undefined}
      {referenceInfo.pmid ? ` pmid: ${referenceInfo.pmid}.` : undefined}{' '}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined}
    </>
  );
};

export const renderDataReference = (reference: Reference) => {
  const referenceInfo = reference.referenceInfo as DataReference;
  const specificUse = {
    generated: 'Generated',
    analyzed: 'Analyzed'
  }[referenceInfo.specificUse];

  const authors = getReferenceAuthors(reference);
  return (
    <>
      {authors}. {referenceInfo.year}. {getAnnotatedText(referenceInfo.dataTitle)}.{' '}
      <em>{getAnnotatedText(referenceInfo.source)}</em> {referenceInfo.doi ? ` doi: ${referenceInfo.doi}.` : undefined}
      {referenceInfo.accessionId ? ` pmid: ${referenceInfo.accessionId}.` : undefined}
      {referenceInfo.version ? ` version: ${referenceInfo.version}.` : undefined}{' '}
      {referenceInfo.extLink ? getExtLinkTag(referenceInfo.extLink) : undefined} {specificUse}
    </>
  );
};

const getReferenceAuthors = (reference: Reference) => {
  return reference.authors
    .map((author) => {
      return get(author, 'groupName', `${author['lastName']} ${author['firstName']}`);
    })
    .join(', ');
};

const getExtLinkTag = (url: string) => {
  return (
    <>
      url:{' '}
      <a target="_blank" rel="noopener noreferrer" href={url}>
        {url}
      </a>
    </>
  );
};
