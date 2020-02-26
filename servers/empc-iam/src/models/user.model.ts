import { Entity, model, property, hasOne } from '@loopback/repository';
import { UserCredential } from './user-credential.model';
const uuid = require('uuid/v4');
import moment from 'moment';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  }
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid()
  })
  _id?: string;

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
  })
  mobileNumber?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  rights?: string[];

  @property({
    type: 'date',
  })
  createdDt?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @hasOne(() => UserCredential)
  userCredential: UserCredential;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
