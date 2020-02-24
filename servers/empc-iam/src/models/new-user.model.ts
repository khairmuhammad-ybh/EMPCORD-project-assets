import { model, property } from '@loopback/repository';
import { User } from '.';

@model({ settings: { strict: false } })
export class NewUser extends User {
  @property({
    type: 'string',
    required: true,
  })
  userChoicePassword: string;

  @property({
    type: 'string',
    required: true
  })
  userConfirmPassword: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<NewUser>) {
    super(data);
  }
}

export interface NewUserRelations {
  // describe navigational properties here
}

export type NewUserWithRelations = NewUser & NewUserRelations;
