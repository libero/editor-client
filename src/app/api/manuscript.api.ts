import axios from 'axios';
import {Manuscript} from "../models/manuscript";
import {createTitleState} from "../models/manuscript-state.factory";

const manuscriptUrl = (id: string) => `/manuscripts/${id}/manuscript.xml`;

export async function getManuscriptContent(id: string): Promise<Manuscript> {
  const { data } = await axios.get<string>(manuscriptUrl(id));

  const parser = new DOMParser();
  const doc =  parser.parseFromString(data, 'text/xml');
  const title = doc.querySelector('title-group article-title');

  return {
    title: createTitleState(title)
  } as Manuscript;
}