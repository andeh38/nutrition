const ABSOLUTE_URL = /(^\/\/|^http)/;
const DECODER = (s: string): string => decodeURIComponent(s.replace(/\+/g, " "));
const SEARCH = /([^&=]+)=?([^&]*)/g;

export class URI {
  static Clean(url = "") {
    return url.replace(/([^:]\/|^\/)\/+/g, "$1");
  }
  static IsURL(url = "") {
    return ABSOLUTE_URL.test(url);
  }
  static QueryParams() {
    const search = location.search.substr(1);
    let match: Array<string> | null
    const urlParams: Record<string, string> = {};
    while ((match = SEARCH.exec(search)))
      urlParams[DECODER(match[1])] = DECODER(match[2]);
    return urlParams;
  }
  _absolute = false;
  _url = "";
  params:Record<string, string> = {}
  search:Record<string, string> = {}
  constructor(url: string, params = {}, search = {}) {
    const _groups = url.split("/");
    const _params = _groups
      .filter((name) => /^:/.test(name))
      .map((name) => name.substring(1))
      .reduce<Record<string, string>>((o, key) => {
        o[key] = "";
        return o;
      }, {});
    this._url = url;
    this._absolute = this.isAbsolute || ABSOLUTE_URL.test(url);
    this.params = Object.assign({}, _params, params);
    this.search = search;
  }
  get length() {
    return Object.keys(this.params).length;
  }
  get url() {
    const { params, search } = this;
    let url = this._url;
    Object.keys(params).forEach((key) => {
      const regExp = new RegExp(`:${key}`, "g");
      url = url.replace(regExp, params[key]);
    });
    Object.keys(search)
      .filter((key) => Boolean(search[key]))
      .forEach((key) => {
        const and = url.indexOf("?") > 0 ? "&" : "?";
        url += `${and}${key}=${search[key]}`;
      });
    return URI.Clean(url);
  }
  get isAbsolute() {
    return this._absolute;
  }
  set absolute(status: boolean) {
    this._absolute = status;
  }
  toString() {
    return this.url;
  }
}