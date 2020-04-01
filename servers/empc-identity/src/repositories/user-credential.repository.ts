import { DefaultCrudRepository } from '@loopback/repository';
import { UserCredential, UserCredentialRelations } from '../models';
import { EmpcMongoDbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UserCredentialRepository extends DefaultCrudRepository<
  UserCredential,
  typeof UserCredential.prototype._id,
  UserCredentialRelations
  > {
  constructor(
    @inject('datasources.EMPCMongoDB') dataSource: EmpcMongoDbDataSource,
  ) {
    super(UserCredential, dataSource);
  }
}
