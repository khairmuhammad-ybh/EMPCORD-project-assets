import { DefaultCrudRepository } from '@loopback/repository';
import { UserCredential, UserCredentialRelations } from '../models';
import { EmpcMongodbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UserCredentialRepository extends DefaultCrudRepository<
  UserCredential,
  typeof UserCredential.prototype._id,
  UserCredentialRelations
  > {
  constructor(
    @inject('datasources.EMPCMongodb') dataSource: EmpcMongodbDataSource,
  ) {
    super(UserCredential, dataSource);
  }
}
