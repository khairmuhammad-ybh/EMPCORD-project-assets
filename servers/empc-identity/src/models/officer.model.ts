import { Model, model, property, Entity } from '@loopback/repository';

@model()
export class Officer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  officerId: string;

  @property({
    type: 'string',
  })
  zoneId?: string;

  constructor(data?: Partial<Officer>) {
    super(data);
  }
}

export interface OfficerRelations {
  // describe navigational properties here
}

export type OfficerWithRelations = Officer & OfficerRelations;
