/**-----------------------------------------------------------------------
 * Created on Mon Feb 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Mon Feb 24 2020 10:57:35 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/

import { genSalt, hash, compare } from 'bcryptjs';
import { inject } from '@loopback/core';
import { PasswordHasherBindings } from '../bindingKeys';


export type HashPassword = (
  password: string, rounds: number)
  => Promise<string>;


export interface PasswordHasher<T> {
  hashPassword(password: T): Promise<T>
  comparePassword(userPassword: T, storedPassword: T): Promise<boolean>
}

export class BcryptPasswordHasher implements PasswordHasher<string> {
  constructor(
    @inject(PasswordHasherBindings.SALT_ROUNDS)
    private readonly rounds: number
  ) { }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    return hash(password, salt);
  }

  async comparePassword(userPassword: string, storedPassword: string)
    : Promise<boolean> {
    const passwordIsMatched = await compare(userPassword, storedPassword);
    return passwordIsMatched;
  }

}
