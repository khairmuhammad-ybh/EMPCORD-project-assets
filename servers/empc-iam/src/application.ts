/**-----------------------------------------------------------------------
 * Created on Mon Feb 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Mon Feb 24 2020 10:45:10 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/

import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { EmpcRestRequestSequence } from './sequence';
import {
  TokenServiceBindings,
  TokenServiceContants,
  PasswordHasherBindings,
  UserServiceBindings,
  FormValidationBindings
}
  from './bindingKeys';
import { JWTIdTokenService, EMPCUserService, BcryptPasswordHasher } from './services';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { AuthorizationComponent } from '@loopback/authorization';
import { P1ClientAuthenticationStrategy } from './auth-strategies';
import { RegisterFormValidator } from './services';
export class EmpcIamApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super({
      rest: {
        port: 3000,
        host: 'localhost'
      }
    });

    this.setupBindings();

    //Bind authentication and authorization artifacts
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);


    registerAuthenticationStrategy(this, P1ClientAuthenticationStrategy)

    // Set up the custom sequence
    this.sequence(EmpcRestRequestSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };


  }

  /**
   * to binds all artifacts for this application
   */
  setupBindings(): void {

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceContants.TOKEN_SECRET_VALUE)

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceContants.TOKEN_EXPIRES_IN_VALUE
    )

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(
      JWTIdTokenService
    )

    this.bind(PasswordHasherBindings.SALT_ROUNDS).to(10);

    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(
      BcryptPasswordHasher
    )

    this.bind(UserServiceBindings.USER_SERVICE).toClass(
      EMPCUserService
    )

    this.bind(FormValidationBindings.REGISTER_FORM_VALIDATOR).toClass(
      RegisterFormValidator
    )
  }
}
