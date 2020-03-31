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
import { UserRepository, UserCredentialRepository, OfficerRepository } from '../repositories';
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
import { User, Credential, NewUser, UserCredential, Owner, Officer, OfficerFormCreation, Form } from '../models';
import {
  post,
  requestBody,
  HttpErrors,
  param
} from '@loopback/rest';
import {
  LoginResponse,
  LoginRequestBody,
  RegisterResponse,
  RegisterRequestBody,
  OwnerCreationResponse,
  OwnerCreationRequestBody,
  OfficerCreateResponse,
  OfficerCreateRequestBody
} from './requestresponse.spec';
import { FormValidator, EMPCAuthorization } from '../services';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import { log } from '../logging/config';
import { authorize } from '@loopback/authorization';
import { CreationFormValidation } from '../services/creation-form-validator';

import moment from 'moment';
const uuid = require('uuid/v4');

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialRepository)
    public userCredentialRepository: UserCredentialRepository,
    @repository(OfficerRepository)
    public officerRepository: OfficerRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher<string>,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtTokenService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credential>,
    @inject(FormValidationBindings.REGISTER_FORM_VALIDATOR)
    public registerFormValidator: FormValidator<any>,
    @inject(FormValidationBindings.OFFICER_CREATION_FORM_VALIDATOR)
    public officerFormValidator: CreationFormValidation<OfficerFormCreation>
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




  @post('/users/create/officer', {
    responses: {
      '200': OfficerCreateResponse
    }
  })
  @authenticate('jwt')
  @authorize({ allowedRoles: ['master', 'admin'], voters: [EMPCAuthorization] })
  async createOfficer(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(OfficerCreateRequestBody) newOfficerForm: OfficerFormCreation): Promise<Officer> {

    let obj: OfficerFormCreation = Object.assign({}, newOfficerForm);
    var validatedOfficerForm = await this.officerFormValidator.validateForm(obj);

    let newUser = new NewUser();

    // Initialized Auto Gen Fields
    newUser._id = uuid()
    newUser.createdDt = moment().format('MMMM Do YYYY, h:mm:ss a').toString()
    newUser.status = 'active';

    // Populate other fields to NewUser Object
    newUser.userChoicePassword = validatedOfficerForm.userChoicePassword;
    newUser.userConfirmPassword = validatedOfficerForm.userConfirmPassword;
    newUser.userName = validatedOfficerForm.userName;
    newUser.firstName = validatedOfficerForm.firstName;
    newUser.lastName = validatedOfficerForm.lastName;
    newUser.email = validatedOfficerForm.email;
    newUser.mobileNumber = validatedOfficerForm.mobileNumber;
    newUser.roles = validatedOfficerForm.roles;
    newUser.rights = validatedOfficerForm.rights

    // Checking for the UserName / Email
    // if its already used as existence user in Database, throw Error
    let foundUser = await this.userRepository.findOne({
      where: { or: [{ email: newUser.email }, { userName: newUser.userName }] }
    })

    // Checking for Offcier ID Duplication
    let foundOfficer = await this.officerRepository.findOne({
      where: { officerId: validatedOfficerForm.officerId }
    });

    if (foundOfficer) {
      throw new HttpErrors.Unauthorized(
        'Officer ID already being used -  please use different ID'
      )
    }

    if (foundUser) {
      throw new HttpErrors.Unauthorized(
        'User with username/email already exist in our database'
      )
    }

    // Hashing the password
    let password = await this.passwordHasher.hashPassword(
      newUser.userChoicePassword
    )

    // Contruct the User Model and save to DB with its _id
    await this.userRepository.create(
      _.omit(newUser, 'userChoicePassword', 'userConfirmPassword',
      )
    )

    // Contruct the UserCredential Model with its hashedpassword and
    // store in DB - If failed to saved this object, deleyte the User Model
    // by _id for rollback
    let result = await this.userRepository.userCredential(newUser._id)
      .create({
        hashedPassword: password,
        accessToken: 'N/A',
        refreshedToken: 'N/A',
        credentialType: 'password-db-authentication'
      })

    if (!result) {
      await this.userRepository.deleteById(newUser._id);
      throw new HttpErrors.Unauthorized('Error saving credentials to DB ')
    }


    // Contruct the Officer Model and save in DB
    // - if failed , delete both User Model and User Crendential for rollback

    let officer = await this.officerRepository.create(
      {
        officerId: validatedOfficerForm.officerId,
        zoneId: validatedOfficerForm.zoneId,
        userId: newUser._id
      }
    )

    if (!officer) {
      await this.userRepository.deleteById(newUser._id);
      let userCred = await this.userCredentialRepository.findOne({
        where: { userId: newUser._id }
      })
      if (userCred) {
        await this.userCredentialRepository.delete(userCred);
      }
      throw new HttpErrors.Unauthorized('Error saving Officer Data in DB ')
    }

    // if all UOW succeeded, construct the response object and send back
    // to client
    log.info(`New <${officer.officerId}> Officer created`)
    return officer;

    throw new HttpErrors.Unauthorized('Method not implemented yet');

  }



  /**
   *
   * @param newUser
   */
  @post('/users/create/admin', {
    responses: {
      '200': RegisterResponse
    }
  })
  @authenticate('jwt')
  @authorize({ allowedRoles: ['master'], voters: [EMPCAuthorization] })
  async register(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(RegisterRequestBody) newUser: NewUser,
  ): Promise<User> {

    let savedUser: User;

    const validatedNewUser =
      await this.registerFormValidator.validateForm(newUser);

    let foundUser = this.userRepository.findOne({
      where: { or: [{ userName: newUser.userName }, { email: newUser.email }] }
    })

    if (foundUser) {
      throw new HttpErrors.Unauthorized('User with username/email already exist in our database')
    }

    let password = await this.passwordHasher.hashPassword(
      validatedNewUser.userChoicePassword
    )

    if (!validatedNewUser.rights.includes('administration')) {
      validatedNewUser.rights = ['administration']
    }

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

}

