import { Entity, model, property, hasMany } from '@loopback/repository';
import { Officer } from './officer.model';
const shortid = require('shortid');

@model()
export class Zone extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    default: shortid.generate
  })
  _id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => Officer)
  officers: Officer[];

  constructor(data?: Partial<Zone>) {
    super(data);
  }
}

export interface ZoneRelations {
  // describe navigational properties here
}

export type ZoneWithRelations = Zone & ZoneRelations;
