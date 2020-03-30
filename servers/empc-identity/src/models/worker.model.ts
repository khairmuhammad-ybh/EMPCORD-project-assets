import {model, property} from '@loopback/repository';
import {User} from '.';

@model()
export class Worker extends User {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  _id: string;


  constructor(data?: Partial<Worker>) {
    super(data);
  }
}

export interface WorkerRelations {
  // describe navigational properties here
}

export type WorkerWithRelations = Worker & WorkerRelations;
