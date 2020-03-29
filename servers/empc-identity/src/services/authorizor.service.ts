/**-----------------------------------------------------------------------
 * Created on Sun Mar 29 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Sun Mar 29 2020 6:55:21 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/
import {
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationDecision,
} from '@loopback/authorization';
import _ from 'lodash';
import { UserProfile, securityId } from '@loopback/security';

export async function EMPCAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata
): Promise<AuthorizationDecision> {

  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], [
      '_id',
      'userName',
      'roles',
      'rights'
    ])
    currentUser = { [securityId]: user._id, name: user.userName, roles: user.roles, rights: user.rights };
  } else {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roles) {
    return AuthorizationDecision.DENY
  }

  if (!metadata.allowedRoles) {
    return AuthorizationDecision.ALLOW
  }

  let rolesIsAllowed: boolean = false
  console.log(currentUser.roles)
  console.log(metadata.allowedRoles);
  for (const role of currentUser.roles) {
    if (metadata.allowedRoles.includes(role)) {
      rolesIsAllowed = true;
      break;
    }
  }
  console.log(rolesIsAllowed)

  if (!rolesIsAllowed) {
    return AuthorizationDecision.DENY
  }

  if (!currentUser.rights) {
    return AuthorizationDecision.DENY
  }

  if (currentUser.roles.includes('master')) {
    return AuthorizationDecision.ALLOW
  }
  if (rolesIsAllowed) {
    return AuthorizationDecision.ALLOW
  }
  return AuthorizationDecision.DENY
}
