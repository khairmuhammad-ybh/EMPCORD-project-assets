/**-----------------------------------------------------------------------
 * Created on Thu Feb 20 2020
 *
 * Copyright (c) 2020 Freelance - Napihup
--------------------------------------------------------------------------*/
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { promisify } from 'util';
import { TokenService } from '@loopback/authentication';
import { TokenServiceBindings } from '../bindingKeys';
import { UserProfile, securityId } from '@loopback/security';


const jwt = require('jsonwebtoken')
const asyncSign = promisify(jwt.sign);
const asyncVerify = promisify(jwt.verify);

export class JWTIdTokenService implements TokenService {

  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) { }

  /**
   *
   * @param token
   */
  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        'Error verifying token : token is null'
      )
    }

    let userProfile: UserProfile

    try {
      //decode the token and extract the userProfile
      const decodedToken = await asyncVerify(token, this.jwtSecret);
      userProfile = Object.assign(
        { [securityId]: '', name: '' },
        {
          [securityId]: decodedToken.id,
          name: decodedToken.name,
          id: decodedToken.id,
          roles: decodedToken.roles
        },
      );

    }
    catch (err) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${err.message}`
      )
    }
    return userProfile;
  }

  /**
   *
   * @param userProfile
   */
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating ID Token : userProfile is null'
      )
    }

    let idToken: string;
    const userProfileForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      roles: userProfile.roles
    }

    try {
      idToken = await asyncSign(userProfileForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn)
      })
    }
    catch (err) {
      throw new HttpErrors.Unauthorized(
        `Error signing IdToken : ${err.message}`
      )
    }
    return idToken
  }

}



