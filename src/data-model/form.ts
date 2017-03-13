export class Form {
  private data: {};
  private username: string;
  private password: string;
  private email: string;
  private fullname: string;

  constructor(username: string, password: string, email?: string, fullname?: string) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.fullname = fullname;
    this.data = {};
  }

  public getData(): {} {
    if (this.email) {
      if (this.fullname) {
        this.data = {
          username: this.username,
          password: this.password,
          email: this.email,
          full_name: this.fullname
        }
      } else {
        this.data = {
          username: this.username,
          password: this.password,
          email: this.email
        }
      }
    } else {
      this.data = {
        username: this.username,
        password: this.password
      }
    }
    return this.data;
  }
}
