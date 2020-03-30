import {DefaultCrudRepository} from '@loopback/repository';
import {Officer, OfficerRelations} from '../models';
import {EmpcMongoDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OfficerRepository extends DefaultCrudRepository<
  Officer,
  typeof Officer.prototype.officerId,
  OfficerRelations
> {
  constructor(
    @inject('datasources.EMPCMongoDB') dataSource: EmpcMongoDbDataSource,
  ) {
    super(Officer, dataSource);
  }
}
