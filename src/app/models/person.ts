import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import * as bioConfig from 'app/models/config/author-bio.config';
import { Affiliation } from 'app/models/affiliation';
import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { BackmatterEntity } from 'app/models/backmatter-entity';
import { JSONObject } from 'app/types/utility.types';

export class Person extends BackmatterEntity {
  firstName: string;
  lastName: string;
  suffix?: string;
  isAuthenticated?: boolean;
  orcid?: string;
  email?: string;
  bio?: EditorState;
  isCorrespondingAuthor?: boolean;
  affiliations?: string[];
  hasCompetingInterest?: boolean;
  competingInterestStatement?: string;

  constructor(data?: JSONObject | Element, notesXml?: Element) {
    super();
    this.createEntity(data);
    if (data instanceof Element && notesXml instanceof Element) {
      this.setCompetingInterests(data, notesXml);
    }
  }

  public getDisplayName(): string {
    return [this.firstName, this.lastName, this.suffix].filter((_) => _).join(' ');
  }

  public getAffiliationsLabels(affiliations: Affiliation[]): string[] {
    return this.affiliations
      .map((affiliationId) => {
        const affiliation = affiliations.find(({ id }) => id === affiliationId);
        return affiliation ? affiliation.label : undefined;
      })
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));
  }

  clone(): Person {
    const person = new Person();
    person.firstName = this.firstName;
    person.lastName = this.lastName;
    person.suffix = this.suffix;
    person.isAuthenticated = this.isAuthenticated;
    person.email = this.email;
    person.bio = this.bio;
    person.isCorrespondingAuthor = this.isCorrespondingAuthor;
    person.affiliations = [...this.affiliations];
    person.hasCompetingInterest = this.hasCompetingInterest;
    person.competingInterestStatement = this.competingInterestStatement;

    return person;
  }

  protected fromXML(xml: Element): void {
    const orcidEl = xml.querySelector('contrib-id[contrib-id-type="orcid"]');

    this._id = xml.getAttribute('id') || this._id;
    this.firstName = getTextContentFromPath(xml, 'name > given-names');
    this.lastName = getTextContentFromPath(xml, 'name > surname');
    this.suffix = getTextContentFromPath(xml, 'name > suffix');
    this.isAuthenticated = orcidEl ? orcidEl.getAttribute('authenticated') === 'true' : false;
    this.orcid = orcidEl ? this.getOrcid(orcidEl.textContent) : '';
    this.bio = this.createBioEditorStateFromXml(xml.querySelector('bio'));
    this.email = getTextContentFromPath(xml, 'email');
    this.isCorrespondingAuthor = xml.getAttribute('corresp') === 'yes';
    this.affiliations = Array.from(xml.querySelectorAll('xref[ref-type="aff"]')).map((xRef) =>
      xRef.getAttribute('rid')
    );
  }

  protected fromJSON(json: JSONObject): void {
    this._id = (json.id as string) || this._id;
    this.firstName = json.firstName as string;
    this.lastName = json.lastName as string;
    this.suffix = json.suffix as string;
    this.isAuthenticated = json.isAuthenticated as boolean;
    this.orcid = json.orcid as string;
    this.bio = json.bio
      ? this.createBioEditorStateFromJSON(json.bio as JSONObject)
      : this.createBioEditorStateFromXml();
    this.email = json.email as string;
    this.isCorrespondingAuthor = json.isCorrespondingAuthor as boolean;
    this.affiliations = (json.affiliations as string[]) || [];
  }

  protected createBlank(): void {
    this.firstName = '';
    this.lastName = '';
    this.suffix = '';
    this.isAuthenticated = false;
    this.orcid = '';
    this.bio = this.createBioEditorStateFromXml();
    this.email = '';
    this.isCorrespondingAuthor = false;
    this.affiliations = [];
  }

  private getOrcid(orcidUrl: string): string {
    const matches = orcidUrl.match(/(([0-9]{4}-?){4})/g);
    if (matches) {
      return matches[0];
    }
    return '';
  }

  private setCompetingInterests(dataXml: Element, notesXml: Element): void {
    const competingInterestEl = Array.from(notesXml.querySelectorAll('[fn-type="COI-statement"]')).find(
      (fnEl: Element) => {
        const id = fnEl.getAttribute('id');
        return dataXml.querySelector(`xref[ref-type="fn"][rid="${id}"]`);
      }
    );

    this.hasCompetingInterest = competingInterestEl
      ? competingInterestEl.textContent !== 'No competing interests declared'
      : false;
    this.competingInterestStatement = competingInterestEl ? competingInterestEl.textContent : '';
  }

  private createBioEditorStateFromXml(bio?: Element): EditorState {
    const schema = makeSchemaFromConfig(bioConfig.topNode, bioConfig.nodes, bioConfig.marks);
    return EditorState.create({
      doc: bio ? ProseMirrorDOMParser.fromSchema(schema).parse(bio) : undefined,
      schema,
      plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap), history()]
    });
  }

  private createBioEditorStateFromJSON(json: JSONObject): EditorState {
    const blankState = this.createBioEditorStateFromXml();
    return EditorState.fromJSON(
      {
        schema: blankState.schema,
        plugins: blankState.plugins
      },
      json
    );
  }
}

export function createAuthorsState(authorsXml: Element[], notesXml: Element | undefined): Person[] {
  return authorsXml.map((xml) => new Person(xml, notesXml));
}
