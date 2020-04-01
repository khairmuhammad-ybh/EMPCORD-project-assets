import { model, property } from '@loopback/repository';
import { User } from '.';

@model()
export class Owner extends User {

  @property({
    type: 'string',
    required: true,
  })
  passwordSet: string;

  constructor(data?: Partial<Owner>) {
    super(data);
  }
}

export interface OwnerRelations {
  // describe navigational properties here
}

export type OwnerWithRelations = Owner & OwnerRelations;
