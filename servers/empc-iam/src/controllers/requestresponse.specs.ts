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
const RegisterFormSchema = {
  type: 'object',
  required: ['email', 'password', 'mobile'],
  properties: {
    name: { type: 'string' },
    userName: { type: 'string' },
    email: { type: 'string' },
    mobileNumber: { type: 'string' },
    roles: { type: ['string'] },
    rights: { type: ['string'] },
    userChoicePassword: { type: 'string' },
    userConfirmPassword: { type: 'string' }
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


export const LoginRequestBody = {
  description: 'The Login form Inputs',
  required: true,
  content: {
    'application/json': { schema: CredentialFormSchema }
  }
}

export const LoginResponse = {
  description: 'The response token on login callback',
  required: true,
  content: {
    'application/json': { schema: LoginResponseSchema }
  }
}

export const RegisterResponse = {
  description: 'The response when user registering to new account setup',
  required: true,
  content: {
    'application/json': { schema: RegisterResponseSchema }
  }
}

export const RegisterRequestBody = {
  description: 'The register form inputs',
  required: true,
  content: {
    'application/json': { Schema: RegisterFormSchema }
  }
}
