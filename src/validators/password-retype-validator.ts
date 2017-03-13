import { FormGroup } from '@angular/forms';

export class PasswordRetypeValidator {

  static validate = (signupForm: FormGroup): any => {
    let password1 = signupForm.get('password');
    let password2 = signupForm.get('retype');

    if ((password1.touched || password2.touched) && password1.value !== password2.value) {
      return { 'password mismatch': true };
    }
    return null;
  }
}
