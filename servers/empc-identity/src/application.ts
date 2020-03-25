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
import { EMPCSequence } from './sequence';
import {
  TokenServiceBindings,
  TokenServiceContants,
  PasswordHasherBindings,
  UserServiceBindings,
  FormValidationBindings
}
  from './bindingKeys';
import { JWTIdTokenService, BcryptPasswordHasher, EMPCUserService, RegisterFormValidator, JWTTokenService } from './services';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { AuthorizationComponent } from '@loopback/authorization';
import { EmpcAuthStrategy } from './auth-strategies/empcAuthStrategy';

export class EmpcIdentityApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(EMPCSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });

    this.setupBindings();

    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);
    this.component(RestExplorerComponent);

    registerAuthenticationStrategy(this, EmpcAuthStrategy)

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
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptPasswordHasher)
    this.bind(TokenServiceBindings.TOKEN_SIGN_KEY).to(TokenServiceContants.TOKEN_PRIVATE_KEY)
    this.bind(TokenServiceBindings.TOKEN_VERIFY_KEY).to(TokenServiceContants.TOKEN_PUBLIC_KEY)
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceContants.TOKEN_SECRET_VALUE)
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceContants.TOKEN_EXPIRES_IN_VALUE)
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTTokenService)
    this.bind(PasswordHasherBindings.SALT_ROUNDS).to(10);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(EMPCUserService)
    this.bind(FormValidationBindings.REGISTER_FORM_VALIDATOR).toClass(RegisterFormValidator)
  }
}
