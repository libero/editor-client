import { cloneDeep, get } from 'lodash';
import { BackmatterEntity } from './backmatter-entity';
import { JSONObject } from '../types/utility.types';
import {
  BookReference,
  ConferenceReference,
  createBookReference,
  createBookReferenceFromJson,
  createConferenceReference,
  createConferenceReferenceFromJson,
  createDataReference,
  createDataReferenceFromJson,
  createJournalReferenceFromJson,
  createJournalReferenceFromXml,
  createNewBookReference,
  createNewConferenceReference,
  createNewDataReference,
  createNewJournalReference,
  createNewPatentReference,
  createNewPeriodicalReference,
  createNewPrePrintReference,
  createNewReportReference,
  createNewSoftwareReference,
  createNewThesisReference,
  createNewWebReference,
  createPatentReference,
  createPatentReferenceFromJson,
  createPeriodicalReference,
  createPeriodicalReferenceFromJson,
  createPrePrintReference,
  createPrePrintReferenceFromJson,
  createReferencePersonList,
  createReportReference,
  createReportReferenceFromJson,
  createSoftwareReference,
  createSoftwareReferenceFromJson,
  createThesisReference,
  createThesisReferenceFromJson,
  createWebReference,
  createWebReferenceFromJson,
  DataReference,
  JournalReference,
  PatentReference,
  PeriodicalReference,
  PrePrintReference,
  ReferenceType,
  ReportReference,
  SoftwareReference,
  ThesisReference,
  WebReference
} from './reference-type';

export type ReferenceContributor =
  | {
      firstName: string;
      lastName: string;
    }
  | {
      groupName: string;
    };

export type ReferenceInfoType =
  | JournalReference
  | BookReference
  | ConferenceReference
  | DataReference
  | PeriodicalReference
  | PrePrintReference
  | ReportReference
  | PatentReference
  | SoftwareReference
  | WebReference
  | ThesisReference;

export class Reference extends BackmatterEntity {
  authors: Array<ReferenceContributor>;
  referenceInfo: ReferenceInfoType;

  private _type: ReferenceType;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }

  public get type(): ReferenceType {
    return this._type;
  }

  public set type(value: ReferenceType) {
    this._type = value;
    this.referenceInfo = this.createEmptyReferenceInfo();
  }

  public clone(): Reference {
    const newRef = new Reference();
    newRef._id = this.id;
    newRef.authors = cloneDeep(this.authors);
    newRef.type = this.type;
    newRef.referenceInfo = { ...this.referenceInfo };

    return newRef;
  }

  public getRefListAuthorsNames(): string {
    let authorNames = this.getRefContributorName(this.authors[0]);
    if (this.authors.length === 2) {
      authorNames += ` and ${this.getRefContributorName(this.authors[1])}`;
    } else if (this.authors.length > 2) {
      authorNames += ' et al.';
    }
    return authorNames;
  }

  public getCitationDisplayName(): string {
    return [this.getRefListAuthorsNames(), get(this.referenceInfo, 'year')].filter(Boolean).join(', ');
  }

  protected fromXML(xmlNode: Element): void {
    this._id = (xmlNode.parentNode as Element).getAttribute('id');
    this.authors = [...createReferencePersonList(xmlNode, 'author'), ...createReferencePersonList(xmlNode, 'inventor')];
    this._type = xmlNode.getAttribute('publication-type') as ReferenceType;
    this.referenceInfo = this.createReferenceInfoFromXml(xmlNode);
  }

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this._id;
    this.authors = cloneDeep(json.authors) as ReferenceContributor[];
    this.type = json._type as ReferenceType;
    this.referenceInfo = this.createReferenceInfoFromJson(json.referenceInfo as JSONObject);
  }

  protected createBlank(): void {
    this.authors = [];
    this.type = 'journal';
    this.referenceInfo = this.createEmptyReferenceInfo();
  }

  private getRefContributorName(contributor: ReferenceContributor): string {
    return get(contributor, 'groupName', get(contributor, 'lastName', ''));
  }

  private createReferenceInfoFromXml(xmlNode: Element): ReferenceInfoType {
    return {
      journal: createJournalReferenceFromXml,
      book: createBookReference,
      periodical: createPeriodicalReference,
      report: createReportReference,
      data: createDataReference,
      web: createWebReference,
      preprint: createPrePrintReference,
      software: createSoftwareReference,
      confproc: createConferenceReference,
      thesis: createThesisReference,
      patent: createPatentReference
    }[this.type](xmlNode);
  }

  private createEmptyReferenceInfo(): ReferenceInfoType {
    return {
      journal: createNewJournalReference,
      book: createNewBookReference,
      periodical: createNewPeriodicalReference,
      report: createNewReportReference,
      data: createNewDataReference,
      web: createNewWebReference,
      preprint: createNewPrePrintReference,
      software: createNewSoftwareReference,
      confproc: createNewConferenceReference,
      thesis: createNewThesisReference,
      patent: createNewPatentReference
    }[this.type]();
  }

  private createReferenceInfoFromJson(json: JSONObject): ReferenceInfoType {
    return {
      journal: createJournalReferenceFromJson,
      book: createBookReferenceFromJson,
      periodical: createPeriodicalReferenceFromJson,
      report: createReportReferenceFromJson,
      data: createDataReferenceFromJson,
      web: createWebReferenceFromJson,
      preprint: createPrePrintReferenceFromJson,
      software: createSoftwareReferenceFromJson,
      confproc: createConferenceReferenceFromJson,
      thesis: createThesisReferenceFromJson,
      patent: createPatentReferenceFromJson
    }[this.type](json);
  }
}

export function sortReferencesList(refs: Reference[]): Reference[] {
  return [...refs].sort((ref1, ref2) => {
    const ref1LastNames = getAuthorLastNamesForSorting(ref1);
    const ref2LastNames = getAuthorLastNamesForSorting(ref2);
    if (ref1LastNames < ref2LastNames) {
      return -1;
    } else if (ref1LastNames > ref2LastNames) {
      return 1;
    } else {
      if (get(ref1, 'referenceInfo.year', '') < get(ref2, 'referenceInfo.year', '')) {
        return -1;
      } else if (get(ref1, 'referenceInfo.year', '') > get(ref2, 'referenceInfo.year', '')) {
        return 1;
      }
    }
    return 0;
  });
}

export function createReferencesState(referencesXml: Element[]): Reference[] {
  const referencesList = referencesXml.map((referenceXml: Element) => {
    return new Reference(referenceXml);
  });
  return sortReferencesList(referencesList);
}

function getAuthorLastNamesForSorting(ref: Reference): string {
  return ref.authors.length > 0
    ? ref.authors
        .map((refAuthor) => {
          return get(refAuthor, 'groupName', get(refAuthor, 'lastName'));
        })
        .join('')
        .toLowerCase()
    : '';
}
