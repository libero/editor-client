import { getTextContentFromPath } from 'app/models/utils';
import { BackmatterEntity } from 'app/models/backmatter-entity';
import { JSONObject } from 'app/types/utility.types';

export class Affiliation extends BackmatterEntity {
  label: string;
  institution: { name: string };
  address: { city: string };
  country: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }

  public getDisplayName(): string {
    return [this.institution.name, this.address.city, this.country].filter(Boolean).join(', ');
  }

  public clone(): Affiliation {
    const affitiation = new Affiliation();
    affitiation._id = this._id;
    affitiation.label = this.label;
    affitiation.country = this.country;
    affitiation.institution = { name: this.institution.name };
    affitiation.address = { city: this.address.city };
    return affitiation;
  }

  protected fromXML(xml: Element): void {
    this._id = xml.getAttribute('id');
    this.label = getTextContentFromPath(xml, 'label');
    this.institution = {
      name: [
        getTextContentFromPath(xml, 'institution[content-type="dept"]'),
        getTextContentFromPath(xml, 'institution:not([content-type])')
      ]
        .filter(Boolean)
        .join(', ')
    };

    this.address = {
      city: getTextContentFromPath(xml, 'addr-line named-content[content-type="city"]')
    };
    this.country = getTextContentFromPath(xml, 'country');
  }

  protected fromJSON(json: JSONObject): void {
    this._id = json.id as string;
    this.label = json.label as string;
    this.country = json.country as string;
    this.institution = json.institution as { name: string };
    this.address = json.address as { city: string };
  }

  protected createBlank(): void {
    this.label = '';
    this.country = '';
    this.institution = { name: '' };
    this.address = { city: '' };
  }
}

export function createAffiliationsState(affiliationsXml: Element[]): Affiliation[] {
  return affiliationsXml.map((xml) => new Affiliation(xml));
}
