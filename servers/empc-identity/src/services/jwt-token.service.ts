/**-----------------------------------------------------------------------
 * Created on Tue Mar 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Tue Mar 24 2020 3:42:24 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { promisify } from 'util';
import { TokenService } from '@loopback/authentication';
import { TokenServiceBindings } from '../bindingKeys';
import { UserProfile, securityId } from '@loopback/security';

const jwt = require('jsonwebtoken');
const asyncSign = promisify(jwt.sign);
const asyncVerify = promisify(jwt.verify);
const asyncDecode = promisify(jwt.decode);

export class JWTTokenService implements TokenService {

  constructor(
    @inject(TokenServiceBindings.TOKEN_SIGN_KEY) private signKey: Buffer,
    @inject(TokenServiceBindings.TOKEN_VERIFY_KEY) private verifyKey: Buffer,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: string
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

    let userProfile: UserProfile;

    var verifyOptions = {
      issuer: 'EMPC Identity Service',
      audience: 'client',
      maxAge: this.jwtExpiresIn,
      algorithm: ['RS256']
    }

    try {
      // verify the token and decode the user data
      await asyncVerify(token, this.verifyKey, verifyOptions);

      var decodedToken = jwt.decode(token, { complete: true })
      let header = decodedToken.header;

      // lastly is to check for alg used for signing and the token type itself
      // for double checking security
      if (header.alg === 'RS256' && header.typ === 'JWT') {
        let payload = decodedToken.payload;
        userProfile = Object.assign(
          { [securityId]: '', name: '' },
          {
            [securityId]: payload._id,
            subject: payload.subject,
            name: payload.name,
            roles: payload.roles,
            rights: payload.rights
          },
        )
      } else {
        throw new HttpErrors.Unauthorized(
          `Error verifying token : Token Signed with unknown algorithms`
        )
      }

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
        'Error Generating ID token: userProfile is null'
      )
    }

    let idToken: string;
    var signingOptions = {
      issuer: 'EMPC Identity Service',
      subject: userProfile[securityId],
      audience: 'client',
      expiresIn: this.jwtExpiresIn,
      algorithm: 'RS256'
    }

    var userDataForToken = {
      _id: userProfile[securityId],
      subject: userProfile[securityId],
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      roles: userProfile.roles,
      rights: userProfile.rights
    }

    try {
      idToken = await asyncSign(userDataForToken, this.signKey, signingOptions);
    } catch (err) {
      throw new HttpErrors.Unauthorized(
        `Error Signing IDToken : ${err.message}`
      )
    }
    this.verifyToken(idToken)
      .then(user => {
        console.log(user);
      })
    return idToken;

  }


}
