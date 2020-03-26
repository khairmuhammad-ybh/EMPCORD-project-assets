/**-----------------------------------------------------------------------
 * Created on Tue Mar 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Tue Mar 24 2020 2:40:34 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/



import { inject } from '@loopback/context';
import { repository, WhereBuilder } from '@loopback/repository';
import { UserRepository, UserCredentialRepository } from '../repositories';
import _ from 'lodash';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
  FormValidationBindings
}
  from '../bindingKeys';
import { PasswordHasher } from '../services/passwordhasher';
import { TokenService, UserService } from '@loopback/authentication';
import { User, Credential, NewUser, UserCredential, Owner } from '../models';
import {
  post,
  requestBody,
  HttpErrors
} from '@loopback/rest';
import {
  LoginResponse,
  LoginRequestBody,
  RegisterResponse,
  RegisterRequestBody,
  OwnerCreationResponse,
  OwnerCreationRequestBody
} from './requestresponse.spec';
import { FormValidator } from '../services';

import { log } from '../logging/config';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialRepository)
    public userCredentialRepository: UserCredentialRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher<string>,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtTokenService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credential>,
    @inject(FormValidationBindings.REGISTER_FORM_VALIDATOR)
    public registerFormValidator: FormValidator<any>,
  ) { }


  /**
   * Endpoint for Owner <master> account creation
   * this account can only be created once with a single <email> address
   * as the principal, which is the same as <userName>
   * @param newUser
   */
  @post('/users/owner-creation', {
    responses: {
      '200': OwnerCreationResponse,
    },
  })
  async ownerCreate(
    @requestBody(OwnerCreationRequestBody) newUser: NewUser,
  ): Promise<Owner> {
    var validatedOwnerUser =
      await this.registerFormValidator.validateForm(newUser);
    //The hashing the password
    const password = await this.passwordHasher.hashPassword(
      validatedOwnerUser.userChoicePassword
    );

    let savedUser: User;
    //Check if owner account with this email addres exist
    let user = await this.userRepository.findOne({
      where: {
        roles: { eq: ['master'] }
      }
    })

    // throw error when owner with same email already exist
    if (user) {
      let error = new HttpErrors.Conflict(
        "OwnerAlreadyExist"
      )
      log.error('user/register', error);
      throw new HttpErrors.Conflict(
        'OwnerAlreadyExist'
      )
    }

    // Predefined data account for new Owner
    validatedOwnerUser.roles = ['master']
    validatedOwnerUser.rights = ['all']
    validatedOwnerUser.status = 'active'

    //Save user, excludes the password attributes
    savedUser = await this.userRepository.create(
      _.omit(validatedOwnerUser,
        ['userChoicePassword', 'userConfirmPassword']))


    //Create the user credentials entity and save
    await this.userRepository.userCredential(savedUser._id)
      .create({
        hashedPassword: password,
        accessToken: 'N/A',
        refreshedToken: 'N/A',
        credentialType: 'password-db-authentication'
      })

    // Convert schema to <Owner> for front end display
    let owner: Owner = Object.assign({}, savedUser, {
      passwordSet: validatedOwnerUser.userChoicePassword
    })

    log.info(`New <${owner.roles}> user created =>  ${owner._id} : ${owner.email}`)

    return owner
  }


  /**
   *
   * @param newUser
   */
  @post('/users/register', {
    responses: {
      '200': RegisterResponse
    }
  })
  async register(
    @requestBody(RegisterRequestBody) newUser: NewUser,
  ): Promise<User> {
    const validatedNewUser =
      await this.registerFormValidator.validateForm(newUser);

    // the hashing the password
    const password = await this.passwordHasher.hashPassword(
      validatedNewUser.userChoicePassword
    );

    let savedUser: User;

    try {
      //setup and save the new user
      savedUser = await this.userRepository.create(
        _.omit(validatedNewUser,
          ['userChoicePassword', 'userConfirmPassword']))

      //create the user credentials entity and save
      await this.userRepository.userCredential(savedUser._id)
        .create({
          hashedPassword: password,
          accessToken: 'N/A',
          refreshedToken: 'N/A',
          credentialType: 'password-db-authentication'
        })

      return savedUser

    }
    catch (err) {
      log.error('user/register', err);
      console.log(err);// for logging purpose;

      // if email choice already exist in the DB , existence user
      if (err.code === 11000 && err.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw new HttpErrors.Unauthorized(
          'Error saving user to DB '
        )
      }
    }
  }


  /**
   * Endpoint for user login
   * @param credential
   */
  @post('/users/login', {
    responses: {
      '200': LoginResponse
    }
  })
  async login(
    @requestBody(LoginRequestBody) credential: Credential,
  ): Promise<{ idToken: string, accessToken: string }> {
    // login process TO-DO code
    // ensure that user is exist by email and the password is validated
    const user = await this.userService.verifyCredentials(credential);

    //convert user to profile-data
    const userProfile = await this.userService.convertToUserProfile(user);

    // access token is still under development
    const accessToken = 'under development test ';

    const idToken = await this.jwtTokenService.generateToken(userProfile);

    //return response
    return {
      idToken: idToken,
      accessToken: accessToken
    }
  }

}

