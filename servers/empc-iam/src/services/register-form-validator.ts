/**-----------------------------------------------------------------------
 * Created on Sat Feb 22 2020
 *
 * Copyright (c) 2020 Freelance - Napihup
--------------------------------------------------------------------------*/
import { FormValidator } from '.';
import { NewUser } from '../models';
import { HttpErrors } from '@loopback/rest';
import { promisify } from 'util';
import { roles } from '../utils';

export class RegisterFormValidator implements FormValidator<NewUser>{

  // REGISTER FORM implementation of validator
  validateForm(newUser: NewUser): Promise<NewUser> {

    if (!this.validateEmail(newUser.email)) {
      throw new HttpErrors.NotAcceptable(
        'emailNotvalid'
      );
    }

    if (!this.matchConfirmPassword(
      newUser.userChoicePassword, newUser.userConfirmPassword
    )) {
      throw new HttpErrors.NotAcceptable(
        'confirmPasswordNotMatched'
      );
    }

    // re-format the mobile number if provided by user
    let user = Object.assign({}, newUser, {
      mobileNumber: this.formatMobileNumber(newUser.mobileNumber)
    })

    // promisify the return value - for obeying the implementation rules
    return new Promise(resolve => {
      resolve(user)
    });

  }


  validateEmail(email: string): boolean {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email)
  }

  matchConfirmPassword(choicePassword: string, confirmPassword: string): boolean {
    if (choicePassword === confirmPassword) {
      return true;
    }
    return false;
  }

  formatMobileNumber(mobileNumber: string | undefined): string {
    if (mobileNumber) {
      return mobileNumber
    }
    return '00 0000 0000' // this the default value for no assigned mobile number;
  }
}
