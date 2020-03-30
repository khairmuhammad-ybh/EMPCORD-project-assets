import { Form } from "./form.interface"
import { property, model } from "@loopback/repository"

/**-----------------------------------------------------------------------
 * Created on Mon Mar 30 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Mon Mar 30 2020 7:57:40 AM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/
import moment from 'moment';
const uuid = require('uuid/v4');

@model()
export class OfficerFormCreation {

  @property({
    type: 'string'
  })
  userName: string

  @property({
    type: 'string'
  })
  firstName: string

  @property({
    type: 'string'
  })
  lastName: string

  @property({
    type: 'string'
  })
  email: string

  @property({
    type: 'string'
  })
  mobileNumber: string

  @property({
    type: 'array',
    itemType: 'string'
  })
  roles: string[]

  @property({
    type: 'array',
    itemType: 'string'
  })
  rights: string[]

  @property({
    type: 'string'
  })
  officerId: string

  @property({
    type: 'string'
  })
  userChoicePassword: string

  @property({
    type: 'string'
  })
  userConfirmPassword: string

  @property({
    type: 'string'
  })
  zoneId: string
}
