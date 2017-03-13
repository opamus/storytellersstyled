import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http'
import 'rxjs/add/operator/map';
/* API helper service:
Designed to ease communication with the wbma-server-node.
 */
@Injectable()
export class ApiHelper {

  private baseUrl: any = 'http://media.mw.metropolia.fi/wbma';
  private headers: Headers;
  private options: RequestOptions;

  constructor(private http: Http) { }

  private headerBuilder: any = (contentType?, token?) => {
    this.headers = new Headers({});
    this.options = new RequestOptions({ headers: this.headers });
    if (contentType) {
      if (contentType !== 'auto-generated') { this.headers.append('Content-Type', contentType); } else { }
    } else {
      this.headers.append('Content-Type', 'application/json')
    }
    if (token) {
      this.headers.append('x-access-token', token);
    }
    return this.options;
  }

  /* OTHER 2*/
  checkName: any = (username: any) => {
    const url = this.baseUrl + '/users/username/' + username;
    const options = this.headerBuilder();
    return this.http.get(url, options);
  }

  login: any = (data) => {
    const url = this.baseUrl + '/login/';
    const options = this.headerBuilder();
    const body = JSON.stringify(data);
    // console.log(options);
    // console.log(body);
    return this.http.post(url, body, options);
  }

  /* USER 5*/
  signup: any = (data) => {
    const url = this.baseUrl + '/users/';
    const options = this.headerBuilder();
    const body = JSON.stringify(data);
    // console.log(body);
    return this.http.post(url, body, options);
  }

  modifyUser: any = (data, token: any) => {
    const url = this.baseUrl + '/users/';
    const options = this.headerBuilder('', token);
    const body = JSON.stringify(data);
    // console.log(body);
    return this.http.put(url, body, options);
  }

  getUser: any = (id: any, token: any) => {
    const url = this.baseUrl + '/users/' + id;
    const options = this.headerBuilder('', token);
    // console.log(options);
    return this.http.get(url, options);
  }

  getAllUsers: any = (token: any) => {
    const url = this.baseUrl + '/users/';
    const options = this.headerBuilder('', token);
    // console.log(options);
    return this.http.get(url, options);
  }

  getCurrentUser: any = (token: any) => {
    const url = this.baseUrl + '/users/user/';
    const options = this.headerBuilder('', token);
    // console.log(options);
    return this.http.get(url, options);
  }

  /* MEDIA 9*/
  getFile: any = (id: any) => {
    const url = this.baseUrl + '/media/' + id;
    const options = this.headerBuilder();
    // console.log(options);
    return this.http.get(url, options);
  }

  deleteFile: any = (id: any, token: any) => {
    const url = this.baseUrl + '/media/' + id;
    const options = this.headerBuilder('', token);
    // console.log(options);
    return this.http.delete(url, options);
  }

  requestAllAndCount: any = () => {
    const url = this.baseUrl + '/media/all';
    const options = this.headerBuilder();
    // console.log(options);
    return this.http.get(url, options);
  }

  getUserMediaById: any = (id: any, token?) => {
    const url = this.baseUrl + '/media/user/' + id;
    let options;
    if (token) {
      options = this.headerBuilder('', token);
    } else {
      options = this.headerBuilder();
    }
    // console.log(options);
    return this.http.get(url, options);
  }

  getUserMedia: any = (token: any) => {
    const url = this.baseUrl + '/media/user';
    const options = this.headerBuilder('', token);
    // console.log(options);
    return this.http.get(url, options);
  }

  getMedia: any = (start?, limit?) => {
    const url = this.baseUrl + '/media';
    const options = this.headerBuilder();
    const params: URLSearchParams = new URLSearchParams;
    if (start) { params.set('start', start); }
    if (limit) { params.set('limit', limit); }
    options.search = params;
    // console.log(options);
    return this.http.get(url, options);
  }

  search: any = (data: any, token: any) => {
    const url = this.baseUrl + '/media/search';
    const options = this.headerBuilder('', token);
    const body = JSON.stringify(data);
    // console.log(body);
    return this.http.post(url, body, options);
  }

  updateFile: any = (data: any, id: any, token: any) => {
    const url = this.baseUrl + '/media/' + id;
    const options = this.headerBuilder('', token);
    const body = JSON.stringify(data);
    // console.log(body);
    return this.http.put(url, body, options);
  }

  uploadFile: any = (data: any, token: any) => {
    const url = this.baseUrl + '/media';
    const body = data;
    const options = this.headerBuilder('auto-generated', token);
    return this.http.post(url, body, options);
  }

  /* FAVOURITE 4*/
  favourite: any = (data: any, token: any) => {
    const url = this.baseUrl + '/favourites';
    const options = this.headerBuilder('', token);
    const body = JSON.stringify(data);
    // console.log(options, body);
    return this.http.post(url, body, options);
  }

  deleteFavourite: any = (id: any, token: any) => {
    const url = this.baseUrl + '/favourites/file/' + id;
    const options = this.headerBuilder('', token);
    // console.log(options);
    return this.http.delete(url, options);
  }

  requestFavouritesById: any = (id: any) => {
    const url = this.baseUrl + '/favourites/file/' + id;
    const options = this.headerBuilder();
    // console.log(options);
    return this.http.get(url, options);
  }

  requestFavourites: any = (token: any) => {
    const url = this.baseUrl + '/favourites';
    const options = this.headerBuilder('', token);
    // console.log(options);
    return this.http.get(url, options);
  }

  /* COMMENT 4*/
  deleteComment = (id: any, token: any) => {
    const url = this.baseUrl + '/comments/' + id;
    const options = this.headerBuilder('auto-generated', token);
    return this.http.delete(url, options);
  }

  postComment = (data, token: any) => {
    const url = this.baseUrl + '/comments';
    const body = JSON.stringify(data);
    const options = this.headerBuilder('', token);
    // console.log(body);
    // console.log(JSON.stringify(options));
    return this.http.post(url, body, options);
  }

  getCommentsOfFile = (id: number) => {
    const url = this.baseUrl + '/comments/file/' + id;
    return this.http.get(url);
  }

  getCommentsOfUser = (token: any) => {
    const url = this.baseUrl + '/comments';
    const options = this.headerBuilder('', token);
    // console.log(JSON.stringify(options));
    return this.http.get(url, options);
  }

  /* RATING 4*/
  rate = (data, token: any) => {
    const url = this.baseUrl + '/ratings';
    const body = JSON.stringify(data);
    const options = this.headerBuilder('', token);
    // console.log(body);
    // console.log(JSON.stringify(options));
    return this.http.post(url, body, options);
  }

  deleteRating = (id: any, token: any) => {
    const url = this.baseUrl + '/ratings/file/' + id;
    const options = this.headerBuilder('', token);
    return this.http.delete(url, options);
  }

  getRatingOfFile = (id: any, token: any) => {
    const url = this.baseUrl + '/ratings/file/' + id;
    const options = this.headerBuilder('', token);
    return this.http.get(url, options);
  }

  getRatingOfUser = (token: any) => {
    const url = this.baseUrl + '/ratings';
    const options = this.headerBuilder('', token);
    return this.http.get(url, options);
  }

  /* TAG 4*/
  tag = (data, token: any) => {
    const url = this.baseUrl + '/tags';
    const body = JSON.stringify(data);
    const options = this.headerBuilder('', token);
    return this.http.post(url, body, options);
  }

  getFilesByTag = (tag: any) => {
    const tagSafe = encodeURI(tag);
    const url = this.baseUrl + '/tags/' + tagSafe;
    return this.http.get(url);
  }

  getTagsByFile = (id: any) => {
    const url = this.baseUrl + '/tags/file/' + id;
    return this.http.get(url);
  }

  getTagsByUser = (token: any) => {
    const url = this.baseUrl + '/tags';
    const options = this.headerBuilder ('',token);
    return this.http.get(url,options);
  }
}
