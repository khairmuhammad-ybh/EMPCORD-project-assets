import { DefaultCrudRepository, repository, HasOneRepositoryFactory } from '@loopback/repository';
import { User, UserRelations, UserCredential } from '../models';
import { EmpcMongoDbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { UserCredentialRepository } from '.';


export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
  > {

  public readonly userCredential: HasOneRepositoryFactory<UserCredential, typeof User.prototype._id>;

  constructor(
    @inject('datasources.EMPCMongoDB') dataSource: EmpcMongoDbDataSource,
    @repository.getter('UserCredentialRepository') protected userCredentialRepositoryGetter: Getter<UserCredentialRepository>,
  ) {
    super(User, dataSource);
    this.userCredential = this.createHasOneRepositoryFactoryFor('userCredential', userCredentialRepositoryGetter);
    this.registerInclusionResolver('userCredential', this.userCredential.inclusionResolver);
  }
}
