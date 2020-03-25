/**-----------------------------------------------------------------------
 * Created on Fri Feb 21 2020
 *
 * Copyright (c) 2020 Freelance - Napihup
--------------------------------------------------------------------------*/

import { HttpErrors } from '@loopback/rest';
import { UserRepository } from '../repositories/user.repository';
import { Credential, User, NewUser } from '../models';
import { UserService } from '@loopback/authentication';
import { UserProfile, securityId } from '@loopback/security';
import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { PasswordHasherBindings } from '../bindingKeys';
import { PasswordHasher } from '.';
import { UserCredentialRepository } from '../repositories';

export class EMPCUserService implements UserService<User, Credential>{

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserCredentialRepository) public userCredsRepository: UserCredentialRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher<string>
  ) { }


  /**
   *This method will be use for authentication flow,
   extract the credentials from ui forms, validate,
   and return the User Entity if success
   * @param credential
   * @return <User>
   */
  async verifyCredentials(credential: Credential): Promise<User> {
    const invalidCredentialError = 'Invalid email or password'
    var p: string | undefined;
    const foundUser = await this.userRepository.findOne({
      where: { email: credential.email },
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialError);
    }

    const credentialFound = await this.userCredsRepository.findOne({
      where: { userId: foundUser._id }
    })

    if (!credentialFound) {
      throw new HttpErrors.Unauthorized(
        'Error getting user credentials : by userId'
      )
    }

    const passwordMatch = await this.passwordHasher.comparePassword(
      credential.password,
      credentialFound.hashedPassword
    )

    if (!passwordMatch) {
      throw new HttpErrors.Unauthorized(
        invalidCredentialError
      )
    }
    return foundUser
  }

  /**
   * This is to convert your User Entity to the UserProfile Model,
   * for authentication flow usage
   *
   * @param user
   */
  convertToUserProfile(user: User): UserProfile {
    const userProfile = {
      [securityId]: user._id,
      name: user.name,
      id: user._id,
      userName: user.userName,
      email: user.email,
      roles: user.roles,
      rights: user.rights
    }
    return userProfile;
  }

}
