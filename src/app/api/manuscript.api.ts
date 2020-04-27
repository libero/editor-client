import axios from 'axios';
import {Manuscript} from "../models/manuscript";
import {createTitleState, createKeywordsState, createNewKeywordState} from "../models/manuscript-state.factory";

const manuscriptUrl = (id: string) => `/manuscripts/${id}/manuscript.xml`;

export async function getManuscriptContent(id: string): Promise<Manuscript> {
  const { data } = await axios.get<string>(manuscriptUrl(id));

  const parser = new DOMParser();
  const doc =  parser.parseFromString(data, 'text/xml');
  const title = doc.querySelector('title-group article-title');
  const keywords = doc.querySelectorAll('kwd-group');

  return {
    title: createTitleState(title),
    keywords: createKeywordsState(Array.from(keywords)),
    newKeyword: createNewKeywordState()
  } as Manuscript;
}