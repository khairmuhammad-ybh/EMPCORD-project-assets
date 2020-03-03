import { EmpcIamApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

export { EmpcIamApplication };

export async function main(options: ApplicationConfig = {}) {
  const app = new EmpcIamApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`EMPC-IAM Server is running at ${url}`);
  return app;
}
