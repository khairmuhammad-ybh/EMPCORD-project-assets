/**-----------------------------------------------------------------------
 * Created on Thu Mar 26 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Thu Mar 26 2020 12:46:58 PM
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
 * TEST no. 1001
 */
import { Client, expect } from '@loopback/testlab';
import { EmpcIdentityApplication } from '../../../application';
import { setupApplication } from '../../acceptance/test-helper';

describe('UserController', () => {
  let app: EmpcIdentityApplication;
  let client: Client;
  // describe what to do before invokes
  before('setupApplication', async () => {
    ({ app, client } = await setupApplication())
  });

  after(async () => {
    await app.stop();
  });

  it('(User Login) : invoke POST /users/login', (done) => {
    client.post('/users/login')
      .send({
        userName: 'Hanafi',
        password: 'admin'
      })
      .then(resp => {
        const body = resp.body;
        expect(body).to.property('idToken');
        expect(body).to.property('accessToken');
        done();
      })
      .catch(err => {
        let error = err.actual.error;
        if (error.name = 'UnauthorizedError' && error.message === 'Invalid email or password') {
          done()
        }
        else {
          done(err);
        }
      })
  })

  it('(Create Owner account ) : invoke POST /users/owner-creation', (done) => {
    client.post('/users/owner-creation')
      .send({
        userName: "Empc",
        name: "Empc Master",
        email: "Empc@gmail.com",
        mobileNumber: '90184631',
        userChoicePassword: 'Napi_developer10',
        userConfirmPassword: 'Napi_developer10'
      })
      .then(resp => {
        const body = resp.body;
        expect(body).to.properties('_id', 'userName', 'email', "name", "mobileNumber",
          "roles", "rights", "createdDt", "status", "passwordSet");
        done();
      })
      .catch(err => {
        let error = err.actual.error;
        if (error.name === 'VALIDATION_FIELD') {
          done(error);
        }
        else if (error.mesage = 'OwnerAlreadyExist') {
          done();
        }
        else {
          done(error);
        }
      })
  })

  /**
   * To test on feature for Offcier Account Data Creation
   *
   * @precondition : User should be a master or admin in order to access to
   * this api
   * @FormBody : <OfficerFormCreation>
   * @Account : Login as 'Hanafi'
   */
  it('Create Officer Account ) : invoke POST /users/create/officer', (done) => {
    client.post('/users/create/officer')
      .send({
        userName: 'Jakob',
        firstName: 'JAKOB',
        lastName: 'BRANDON',
        email: 'jakob@empc.mail.com',
        mobileNumber: '90098743',
        roles: ['officer'],
        rights: ['officer'],
        officerId: '123432',
        userChoicePassword: 'jakob',
        userConfirmPassword: 'jakob',
        zoneId: 'f1645d09-d8ef-4ca6-9bc1-8c9bf3139c41'
      })
      .auth("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4MTg3ODM5Ni00ZDZlLTRhODktYmEwNS0wN2M1MzBjNjA1ZjAiLCJzdWJqZWN0IjoiODE4NzgzOTYtNGQ2ZS00YTg5LWJhMDUtMDdjNTMwYzYwNWYwIiwibmFtZSI6Ik11aGFtbWFkIEhhbmFmaSBZYWt1YiIsInJvbGVzIjpbImFkbWluIl0sInJpZ2h0cyI6WyJhZG1pbmlzdHJhdGlvbiJdLCJpYXQiOjE1ODU1NTgyNTIsImV4cCI6MTU4NTY0NDY1MiwiYXVkIjoiY2xpZW50IiwiaXNzIjoiRU1QQyBJZGVudGl0eSBTZXJ2aWNlIiwic3ViIjoiODE4NzgzOTYtNGQ2ZS00YTg5LWJhMDUtMDdjNTMwYzYwNWYwIn0.E_drPCcdCrSWTPI_EeWUI1o7_9t4jU--F4nZKmDnatm_VoRNANSyTZFb9ubGAGXZAMezuY29YmwN_GoGM2Nlm1gbX5Xeu_pxA9AbOm4Fi5ha0qpCcYEms0YwFE17XmbEVS39IcsNuk3HFWOr1ChqwTv8cy1G-lrxMEdFoniOX3c", { type: 'bearer' })

      .then(response => {
        const body = response.body;
        expect(body).to.properties('officerId', 'zoneId');
        done();
      })
      .catch(err => {
        let errorMessage = err.actual.error.message;
        switch (errorMessage) {
          case 'Officer ID already being used -  please use different ID': {
            done();
            break;
          }
          case 'User with username/email already exist in our database': {
            done()
            break;
          }
          default: done(err); break;
        }
      })
  })


})



