import { User } from './../providers/user';
import { ApiHelper } from './../providers/api-helper';
export class Card {
  // private title: string;
  // private description: string;
  // private file_id: number;
  // private file_name: string;
  // private user_id: number;
  // private media_type: string;
  // private mime_type: string;
  // private time_added;

  public title: string;
  public description: string;
  public file_id: number;
  public filename: string;
  public user_id: number;
  public media_type: string;
  public mime_type: string;
  public time_added: string;

  public username: string;
  public screenshot: string;
  public thumbnails: {};
  public likes: { favourite_id: number, file_id: number, user_id: number }[];
  public comments: { comment_id: number, file_id: number, user_id: number, comment: string, time_added: string }[];
  public tags: {tag_id: number, tag: string, file_id: number} [];
  public isComplete: boolean;

  constructor(private apihelper: ApiHelper, private user: User) {
    this.title = "";
    this.description = "";
    this.file_id = null;
    this.filename = "";
    this.user_id = null;
    this.media_type = "";
    this.mime_type = "";
    this.time_added = null;
    this.username = "";
    this.screenshot = "";
    this.thumbnails = {};
    this.likes = [];
    this.comments = [];
    this.tags = [];
    this.isComplete = false;
  }

  public setTitle(title: string) {
    this.title = title;
  }
  public setFile_name(file_name: string) {
    this.filename = file_name;
  }
  public setDescription(description: string) {
    this.description = description;
  }
  public setFile_id(file_id: number) {
    this.file_id = file_id;
  }
  public setUser_id(user_id: number) {
    this.user_id = user_id;
  }
  public setMedia_type(media_type: string) {
    this.media_type = media_type;
  }
  public setMime_type(mime_type: string) {
    this.mime_type = mime_type;
  }
  public setTime_added(time_added: string) {
    this.time_added = time_added;
  }

  public getTitle() {
    return this.title;
  }
  public getDescription() {
    return this.description;
  }
  public getFile_id() {
    return this.file_id;
  }
  public getUser_id() {
    return this.user_id;
  }
  public getMedia_type() {
    return this.media_type;
  }
  public getMime_type() {
    return this.mime_type;
  }
  public getTime_added() {
    return this.time_added;
  }
  public getFilename() {
    return this.filename;
  }

  public processData() {
    return new Promise(resolve => {
      this.apihelper.getUser(this.user_id, this.user.getToken())
        .map(res => res.json())
        .subscribe(user => {
          this.username = user.username;
          switch (this.media_type) {
            case 'video':
              this.fetchScreenshot()
                .then(res => this.fetchLikes())
                .then(res => this.fetchComment())
                .then(res => this.fetchThumbnails())
                .then(res => this.fetchTags())
                .then(res => {
                  resolve();
                });
              break;
            case 'image':
              this.fetchThumbnails()
                .then(res => this.fetchLikes())
                .then(res => this.fetchComment())
                .then(res => this.fetchTags())
                .then(res => {
                  resolve();
                });
              break;
            case 'audio':
              this.fetchLikes()
                .then(res => this.fetchComment())
                .then(res => this.fetchTags())
                .then(res => {
                  resolve();
                });
          }
        });
    });
  }

  private fetchTags() {
    return new Promise(resolve => {
      this.apihelper.getTagsByFile(this.file_id)
        .map(res => res.json())
        .subscribe(res => {
          this.tags = res;
          this.tags.map(tag=>{
            if (tag.tag == "Complete") {
              this.isComplete = true;
            }
          });
          resolve();
        });
    });
  }

  private fetchComment() {
    return new Promise(resolve => {
      this.apihelper.getCommentsOfFile(this.file_id)
        .map(res => res.json())
        .subscribe(comments => {
          this.comments = comments;
          resolve();
        });
    });
  }

  private fetchLikes() {
    return new Promise(resolve => {
      this.apihelper.requestFavouritesById(this.file_id)
        .map(res => res.json())
        .subscribe(likes => {
          this.likes = likes;
          resolve();
        });
    });
  }

  private fetchThumbnails() {
    return new Promise(resolve => {
      this.apihelper.getFile(this.file_id)
        .map(res => res.json())
        .subscribe(media => {
          this.thumbnails = media.thumbnails;
          resolve();
        });
    });
  }

  private fetchScreenshot() {
    return new Promise(resolve => {
      this.apihelper.getFile(this.file_id)
        .map(res => res.json())
        .subscribe(media => {
          this.screenshot = media.screenshot;
          resolve();
        });
    });
  }
}
