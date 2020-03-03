/**-----------------------------------------------------------------------
 * Created on Mon Feb 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Mon Feb 24 2020 10:44:56 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/

import { DefaultCrudRepository, repository, HasOneRepositoryFactory } from '@loopback/repository';
import { User, UserRelations, UserCredential } from '../models';
import { EmpcMongodbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { UserCredentialRepository } from './user-credential.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
  > {

  public readonly userCredential: HasOneRepositoryFactory<UserCredential, typeof User.prototype._id>;

  constructor(
    @inject('datasources.EMPCMongodb') dataSource: EmpcMongodbDataSource, @repository.getter('UserCredentialRepository') protected userCredentialRepositoryGetter: Getter<UserCredentialRepository>,
  ) {
    super(User, dataSource);
    this.userCredential = this.createHasOneRepositoryFactoryFor('userCredential', userCredentialRepositoryGetter);
    this.registerInclusionResolver('userCredential', this.userCredential.inclusionResolver);
  }
}
