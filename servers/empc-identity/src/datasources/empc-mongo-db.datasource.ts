import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import { juggler } from '@loopback/repository';
import devConfig from './epmc-mongo-db.datasource.config.development.json';
import config from './empc-mongo-db.datasource.config.json';

var env = process.argv[process.argv.length - 1];

@lifeCycleObserver('datasource')
export class EmpcMongoDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'EMPCMongoDB';

  constructor(
    @inject('datasources.config.EMPCMongoDB', { optional: true })
    dsConfig: object = (env === '--test') ? config : devConfig
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
