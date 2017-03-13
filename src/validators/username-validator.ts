import { ApiHelper } from './../providers/api-helper';
import { FormControl } from '@angular/forms';

export class UsernameValidator {
  static apiHelper;
  constructor(apiHelper: ApiHelper) { UsernameValidator.apiHelper = apiHelper }

  checkUsername = (username: FormControl): any => {
    return new Promise(resolve => {
      UsernameValidator.apiHelper.checkName(username.value).subscribe(res => {
        if (res.json().available) {
          resolve(null);
        }
        else {
          resolve({ 'name taken': true });
        }
      })
    });
  }
}
