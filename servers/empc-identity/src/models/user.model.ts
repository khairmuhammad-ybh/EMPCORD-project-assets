/**-----------------------------------------------------------------------
 * Created on Sun Mar 29 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Sun Mar 29 2020 3:45:44 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/

import { Entity, model, property, hasOne } from '@loopback/repository';
import { UserCredential } from './user-credential.model';
import moment from 'moment';
import { Officer } from './officer.model';

const uuid = require('uuid/v4');

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    default: () => uuid()
  })
  _id: string;

  @property({
    type: 'string',
    required: true,
  })
  userName: string;

  @property({
    type: 'string',
    required: true
  })
  firstName: string;

  @property({
    type: 'string',
    required: true
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  mobileNumber: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    // default: () => [roles.user.STANDARD]
  })
  roles: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  rights?: string[];

  @property({
    type: 'string',
    default: () => moment()
      .format('MMMM Do YYYY, h:mm:ss a').toString()
  })
  createdDt: string;

  @property({
    type: 'string',
    required: true,
    default: 'active'
  })
  status: string;

  @hasOne(() => UserCredential)
  userCredential: UserCredential;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
