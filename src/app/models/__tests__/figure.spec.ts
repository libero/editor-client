import { getFigureImageUrlFromXml } from '../figure';

describe('getFigureImageUrlFromXml', () => {
  it('returns figure url from xml graphic tag', () => {
    const el = document.createElement('fig');
    el.innerHTML = '<graphic mime-subtype="tiff" xlink:href="some-tif.tif" mimetype="image"/>';
    expect(getFigureImageUrlFromXml(el)).toBe('some-tif.tif');
  });
  it('returns empty string when no graphic href', () => {
    const el = document.createElement('fig');
    el.innerHTML = '<graphic mime-subtype="tiff" mimetype="image"/>';
    expect(getFigureImageUrlFromXml(el)).toBe('');
  });
  it('returns empty string when no graphic element', () => {
    const el = document.createElement('fig');
    el.innerHTML = '<foo/>';
    expect(getFigureImageUrlFromXml(el)).toBe('');
  });
});
