/**-----------------------------------------------------------------------
 * Created on Sat Feb 22 2020
 *
 * Copyright (c) 2020 Freelance - Napihup
--------------------------------------------------------------------------*/


/**
 * interface for All form backend validation
 * set the
 */
export interface FormValidator<T> {
  validateForm(form: T): Promise<T>;
}


