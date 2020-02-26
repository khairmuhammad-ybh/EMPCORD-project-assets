/**-----------------------------------------------------------------------
 * Created on Mon Feb 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Mon Feb 24 2020 10:45:56 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/
import { getModelSchemaRef } from '@loopback/rest'
import { NewUser } from '../models';

/**------------------------------------------------------------------------
 * User Controller Request Reponse specs
 -------------------------------------------------------------------------*/

const CredentialFormSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  }
}
const LoginResponseSchema = {
  type: 'object',
  properties: {
    idToken: { type: 'string' },
    accessToken: { type: 'string' }
  }
}

const RegisterResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    createDt: { type: 'date' }
  }
}

/**
 *
 */
export const LoginRequestBody = {
  description: 'The Login form Inputs',
  required: true,
  content: {
    'application/json': { schema: CredentialFormSchema }
  }
}
/**
 *
 */
export const LoginResponse = {
  description: 'The response token on login callback',
  required: true,
  content: {
    'application/json': { schema: LoginResponseSchema }
  }
}

/**
 * This describe the response object schema upon successfully
 * process for rest endpoint '/register'
 */
export const RegisterResponse = {
  description: 'The response when user registering to new account setup',
  required: true,
  content: {
    'application/json': { schema: RegisterResponseSchema }
  }
}

/**
 * This is the object format for the rest end point (Input Body)
 * Upon requesting for '/register', client shouldnt specify its user _id and
 * also date creation should be ommitted for allowing server side to append
 * from DB..
 */
export const RegisterRequestBody = {
  description: 'The register form input values',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(NewUser, {
        title: 'NewUser',
        exclude: ['_id', 'createdDt']
      })
    }
  }
}
