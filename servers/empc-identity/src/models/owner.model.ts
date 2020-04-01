/**-----------------------------------------------------------------------
 * Created on Tue Mar 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Tue Mar 24 2020 2:50:40 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/
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
