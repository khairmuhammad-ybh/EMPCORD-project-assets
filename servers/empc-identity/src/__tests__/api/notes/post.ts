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
        email: 'empc@gmail.com',
        password: 'Napi_developer10'
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
})

