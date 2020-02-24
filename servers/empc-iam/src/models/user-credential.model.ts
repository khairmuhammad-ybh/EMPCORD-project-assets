import { Entity, model, property } from '@loopback/repository';
const uuid = require('uuid/v4');

@model({ settings: { strict: false } })
export class UserCredential extends Entity {
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
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  hashedPassword: string;

  @property({
    type: 'string',
  })
  accessToken?: string;

  @property({
    type: 'string',
  })
  refreshedToken?: string;

  @property({
    type: 'string',
  })
  credentialType?: string

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserCredential>) {
    super(data);
  }
}

export interface UserCredentialRelations {
  // describe navigational properties here
}

export type UserCredentialWithRelations = UserCredential & UserCredentialRelations;
