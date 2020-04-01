/**-----------------------------------------------------------------------
 * Created on Wed Apr 01 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Wed Apr 01 2020 3:03:49 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/

/**
 * The user information
 */
const User = {
  "_id": "81878396-4d6e-4a89-ba05-07c530c605f0",
  "userName": "Hanafi",
  "firstName": "Muhammad",
  "lastName": "Hanafi Yakub",
  "email": "napi@gmail.com",
  "mobileNumber": "90184631",
  "roles": ["master", "admin", "officer", "worker"],
  "rights": [""],
  "createdDt": "March 30th 2020, 6:50:21 am",
  "status": "active"
}

const UserCredential = {
  "_id": "2250af38-a07a-4ced-ab6b-9e88ef925c14",
  "userId": "c30312e1-099d-491f-bc72-b3ad95d5f4d9",
  "hashedPassword": "$2a$10$a80ZKqjG.oLWDX/XUVWz0elx1bG65x1MrgtO0nBaePdYDr2FOe0LG",
  "accessToken": "N/A",
  "refreshedToken": "N/A",
  "credentialType": "password-db-authentication"
}

const Officer = {
  "officerId": 'string',
  "userId": 'string',
  "zone": 'string',
  workers: 'array - Worker'
}

const Worker = {
  "_id": 'string',
  "userId": 'string',
  "officer": 'Object - Officer',
  "zone": 'string'
}
