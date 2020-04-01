// import {
//   Count,
//   CountSchema,
//   Filter,
//   repository,
//   Where,
// } from '@loopback/repository';
// import {
//   del,
//   get,
//   getModelSchemaRef,
//   getWhereSchemaFor,
//   param,
//   patch,
//   post,
//   requestBody,
// } from '@loopback/rest';
// import {
//   Zone,
//   Officer,
// } from '../models';
// import { ZoneRepository } from '../repositories';

// export class ZoneOfficerController {
//   constructor(
//     @repository(ZoneRepository) protected zoneRepository: ZoneRepository,
//   ) { }

//   @get('/zones/{id}/officers', {
//     responses: {
//       '200': {
//         description: 'Array of Zone has many Officer',
//         content: {
//           'application/json': {
//             schema: { type: 'array', items: getModelSchemaRef(Officer) },
//           },
//         },
//       },
//     },
//   })
//   async find(
//     @param.path.string('id') id: string,
//     @param.query.object('filter') filter?: Filter<Officer>,
//   ): Promise<Officer[]> {
//     return this.zoneRepository.officers(id).find(filter);
//   }

//   @post('/zones/{id}/officers', {
//     responses: {
//       '200': {
//         description: 'Zone model instance',
//         content: { 'application/json': { schema: getModelSchemaRef(Officer) } },
//       },
//     },
//   })
//   async create(
//     @param.path.string('id') id: typeof Zone.prototype._id,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Officer, {
//             title: 'NewOfficerInZone',
//             exclude: ['officerId'],
//             optional: ['zoneId']
//           }),
//         },
//       },
//     }) officer: Omit<Officer, 'officerId'>,
//   ): Promise<Officer> {
//     return this.zoneRepository.officers(id).create(officer);
//   }

//   @patch('/zones/{id}/officers', {
//     responses: {
//       '200': {
//         description: 'Zone.Officer PATCH success count',
//         content: { 'application/json': { schema: CountSchema } },
//       },
//     },
//   })
//   async patch(
//     @param.path.string('id') id: string,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Officer, { partial: true }),
//         },
//       },
//     })
//     officer: Partial<Officer>,
//     @param.query.object('where', getWhereSchemaFor(Officer)) where?: Where<Officer>,
//   ): Promise<Count> {
//     return this.zoneRepository.officers(id).patch(officer, where);
//   }

//   @del('/zones/{id}/officers', {
//     responses: {
//       '200': {
//         description: 'Zone.Officer DELETE success count',
//         content: { 'application/json': { schema: CountSchema } },
//       },
//     },
//   })
//   async delete(
//     @param.path.string('id') id: string,
//     @param.query.object('where', getWhereSchemaFor(Officer)) where?: Where<Officer>,
//   ): Promise<Count> {
//     return this.zoneRepository.officers(id).delete(where);
//   }
// }
