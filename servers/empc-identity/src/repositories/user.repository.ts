import { DefaultCrudRepository, repository, HasOneRepositoryFactory } from '@loopback/repository';
import { User, UserRelations, UserCredential, Officer} from '../models';
import { EmpcMongoDbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { UserCredentialRepository } from '.';
import {OfficerRepository} from './officer.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
  > {

  public readonly userCredential: HasOneRepositoryFactory<UserCredential, typeof User.prototype._id>;

  public readonly officer: HasOneRepositoryFactory<Officer, typeof User.prototype._id>;

  constructor(
    @inject('datasources.EMPCMongoDB') dataSource: EmpcMongoDbDataSource,
    @repository.getter('UserCredentialRepository') protected userCredentialRepositoryGetter: Getter<UserCredentialRepository>, @repository.getter('OfficerRepository') protected officerRepositoryGetter: Getter<OfficerRepository>,
  ) {
    super(User, dataSource);
    this.officer = this.createHasOneRepositoryFactoryFor('officer', officerRepositoryGetter);
    this.userCredential = this.createHasOneRepositoryFactoryFor('userCredential', userCredentialRepositoryGetter);
    this.registerInclusionResolver('userCredential', this.userCredential.inclusionResolver);
  }
}
