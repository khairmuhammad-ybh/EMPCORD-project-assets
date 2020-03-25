/**-----------------------------------------------------------------------
 * Created on Tue Mar 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Tue Mar 24 2020 3:29:03 PM
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

export class EmpcAuthStrategy implements AuthenticationStrategy {

  name: string = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public tokenService: TokenService
  ) { }


  async authenticate(request: Request<import("express-serve-static-core").ParamsDictionary>): Promise<UserProfile> {
    const token = this.getCredentialsFromRequest(request);
    const userProfile: UserProfile = await this.tokenService.verifyToken(token);
    return userProfile
  }



  /**
   * To extract the token from the Bearer, which should be provided in the request Headers
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
      throw new HttpErrors.Unauthorized('Authorization Headers is not of type Bearer .');
    }
    const parts = authValue.split(" ");
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized('Authorization headers value has too many parts');
    }
    const token = parts[1];
    return token;
  }


}
