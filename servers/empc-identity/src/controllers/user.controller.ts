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
import { repository } from '@loopback/repository';
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
import { TokenService, UserService, authenticate } from '@loopback/authentication';
import { User, Credential, NewUser, Owner, } from '../models';
import {
  post,
  get,
  requestBody,
  HttpErrors,
  RestBindings,
} from '@loopback/rest';
import {
  LoginResponse,
  LoginRequestBody,
  RegisterResponse,
  RegisterRequestBody,
  OwnerCreationResponse,
  OwnerCreationRequestBody,
  MeResponse
} from './requestresponse.spec';
import { FormValidator, EMPCAuthorization } from '../services';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import { log } from '../logging/config';
import { authorize } from '@loopback/authorization';

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
  @post('/users/create', {
    responses: {
      '200': RegisterResponse
    }
  })
  @authenticate('jwt')
  @authorize({ allowedRoles: ['master', 'admin'], voters: [EMPCAuthorization] })
  async register(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(RegisterRequestBody) newUser: NewUser,
  ): Promise<User> {

    let savedUser: User;

    const validatedNewUser =
      await this.registerFormValidator.validateForm(newUser);

    let foundUser = await this.userRepository.findOne({
      where: { or: [{ userName: newUser.userName }, { email: newUser.email }] }
    })


    if (foundUser) {
      throw new HttpErrors.Unauthorized('User with username/email already exist in our database')
    }

    let password = await this.passwordHasher.hashPassword(
      validatedNewUser.userChoicePassword
    )

    // Check for current user roles authority to create such account based
    // on his/her roles
    let requesterRoles = currentUserProfile.roles;

    let newUserRoles = validatedNewUser.roles;

    var isAllowCreation: boolean = false;

    if (newUserRoles.includes('master')) {
      isAllowCreation = false
    }

    else if (newUserRoles.includes('admin') && requesterRoles.includes('master')) {
      // only Master can create an adminstrator account
      isAllowCreation = true
    }

    else if (newUserRoles.includes('admin') && requesterRoles.includes('admin')) {
      isAllowCreation = false
    }

    else {
      isAllowCreation = true
    }

    if (!isAllowCreation) {
      throw new HttpErrors.Unauthorized('Not Authorized to create Such Account')
    }

    // after checking for rights grant

    validatedNewUser.status = 'active'

    //Save user, excludes the password attributes
    savedUser = await this.userRepository.create(
      _.omit(validatedNewUser,
        ['userChoicePassword', 'userConfirmPassword']))


    //Create the user credentials entity and save
    await this.userRepository.userCredential(savedUser._id)
      .create({
        hashedPassword: password,
        accessToken: 'N/A',
        refreshedToken: 'N/A',
        credentialType: 'password-db-authentication'
      })


    log.info(`New Admin created =>  ${savedUser._id} : ${savedUser.email}`)

    return savedUser;
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

  @get('/users/me', {
    responses: {
      '200': MeResponse
    }
  })
  @authenticate('jwt')
  async me(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {

    let id = currentUserProfile[securityId];
    let foundUser = await this.userRepository.findById(id);
    if (!foundUser) {
      throw new HttpErrors.Unauthorized('Method not implemented yet');
    }
    return foundUser;
  }

}

