import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { Zone, ZoneRelations, Officer } from '../models';
import { EmpcMongoDbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { OfficerRepository } from './officer.repository';

export class ZoneRepository extends DefaultCrudRepository<
  Zone,
  typeof Zone.prototype._id,
  ZoneRelations
  > {

  public readonly officers: HasManyRepositoryFactory<Officer, typeof Zone.prototype._id>;

  constructor(
    @inject('datasources.EMPCMongoDB') dataSource: EmpcMongoDbDataSource, @repository.getter('OfficerRepository') protected officerRepositoryGetter: Getter<OfficerRepository>,
  ) {
    super(Zone, dataSource);
    this.officers = this.createHasManyRepositoryFactoryFor('officers', officerRepositoryGetter);
    this.registerInclusionResolver('officers', this.officers.inclusionResolver);
  }
}
