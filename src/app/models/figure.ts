import { get } from 'lodash';

import { getTextContentFromPath } from 'app/models/utils';

export interface Figure {
  copyrightHolder: string;
  copyrightStatement: string;
  copyrightYear: string;
  licenseType: string;
}

export const FIGURE_LICENSE_CC0 = 'LICENSE_CCO';
export const FIGURE_LICENSE_CC_BY_4 = 'LICENSE_CC_BY_4';
export const FIGURE_LICENSE_OTHER = 'LICENSE_OTHER';

export const FIGURE_LICENSE_SELECT_OPTIONS = [
  { label: 'CC0', value: FIGURE_LICENSE_CC0 },
  { label: 'CC by 4.0', value: FIGURE_LICENSE_CC_BY_4 },
  { label: 'Other', value: FIGURE_LICENSE_CC_BY_4 }
];

const LICENSE_URLS_MAP = {
  'http://creativecommons.org/licenses/by/4.0/': FIGURE_LICENSE_CC_BY_4,
  'http://creativecommons.org/publicdomain/zero/1.0/': FIGURE_LICENSE_CC0
};

export function createFigureLicenseAttributes(el: Element): Figure {
  return {
    copyrightHolder: getTextContentFromPath(el, 'copyright-holder'),
    copyrightStatement: getTextContentFromPath(el, 'copyright-statement'),
    copyrightYear: getTextContentFromPath(el, 'copyright-year'),
    licenseType: getLicenseType(el)
  };
}

export function createEmptyLicenseAttributes(): Figure {
  return {
    copyrightHolder: '',
    copyrightStatement: '',
    copyrightYear: '',
    licenseType: undefined
  };
}

export function getFigureImageUrl(el: Element): string {
  const paths = get(el.ownerDocument, 'manuscriptPath').split('/');
  const id = paths[2];

  return process.env.REACT_APP_NO_SERVER
    ? get(el.ownerDocument, 'manuscriptPath') + '/' + get(el.querySelector('graphic'), 'attributes.xlink:href.value')
    : `/api/v1/articles/${id}/assets/${get(el.querySelector('graphic'), 'attributes.xlink:href.value').replace(
        'tif',
        'jpg'
      )}`;
}

function getLicenseType(el: Element): string {
  const licenseUrl =
    getTextContentFromPath(el, 'license_ref') || el.querySelector('license').getAttribute('xlink:href') || '';

  return LICENSE_URLS_MAP[licenseUrl] || FIGURE_LICENSE_OTHER;
}
