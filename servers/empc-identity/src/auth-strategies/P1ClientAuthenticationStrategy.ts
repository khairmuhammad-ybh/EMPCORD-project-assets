/**-----------------------------------------------------------------------
 * Created on Mon Feb 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Mon Feb 24 2020 10:45:40 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/

import { inject } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import { AuthenticationStrategy, TokenService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { TokenServiceBindings } from '../bindingKeys';

export class P1ClientAuthenticationStrategy implements AuthenticationStrategy {

  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.getCredentialsFromRequest(request);
    const userProfile: UserProfile = await this.tokenService.verifyToken(token);
    return userProfile
  }


  /**
   * To extract the token bearer from the http request headers
   * with the key 'authorization'
   * @param request
   */
  getCredentialsFromRequest(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(
        'Authorization headers not found'
      )
    }

    const authValue = request.headers.authorization;

    if (!authValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization Headers is not of type Bearer .'
      )
    }

    const parts = authValue.split(" ");
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        'Authorization headers value has too many parts'
      )
    }
    const token = parts[1];
    return token;
  }
}
