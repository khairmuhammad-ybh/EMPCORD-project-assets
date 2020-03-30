/**-----------------------------------------------------------------------
 * Created on Mon Mar 30 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Mon Mar 30 2020 8:38:25 AM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/
import { Form, OfficerFormCreation } from '../models';
import { HttpErrors } from '@loopback/rest';
export abstract class CreationFormValidation<T> {

  /**
   * To be implemented validation by specific form
   * validator
   * @param form
   */
  abstract validateForm(form: T): T;


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

export class OfficerFormValidation extends CreationFormValidation<OfficerFormCreation> {

  validateForm(form: OfficerFormCreation): OfficerFormCreation {
    let emailValidated = this.validateEmail(form.email);

    let roles = form.roles;
    let roleIsOfficer = (roles.includes('officer') && !roles.includes('master') &&
      !roles.includes('admin') && !roles.includes('worker'));

    if (!roleIsOfficer) {
      throw new HttpErrors.NotAcceptable(
        'Roles Conflict - should be roles as officer - only'
      )
    }

    if (!emailValidated) {
      throw new HttpErrors.NotAcceptable(
        'EmailNotValid'
      )
    }
    let passwordMatch = this.matchConfirmPassword(
      form.userChoicePassword, form.userConfirmPassword
    )

    if (!passwordMatch) {
      throw new HttpErrors.NotAcceptable(
        'ConfirmPasswordNotMatch'
      )
    }

    let validated: OfficerFormCreation;
    validated = Object.assign({}, form, {
      mobileNumber: this.formatMobileNumber(form.mobileNumber)
    })

    return validated;
  }
}
