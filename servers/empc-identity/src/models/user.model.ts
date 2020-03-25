import { Entity, model, property, hasOne } from '@loopback/repository';
import { UserCredential } from './user-credential.model';
import { roles } from '../utils';
import moment from 'moment';
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
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  mobileNumber: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    default: () => [roles.user.STANDARD]
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
  })
  status: string;

  @hasOne(() => UserCredential)
  userCredential: UserCredential;
  // Define well-known properties here


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
