// import {
//   Count,
//   CountSchema,
//   Filter,
//   repository,
//   Where,
// } from '@loopback/repository';
// import {
//   post,
//   param,
//   get,
//   getFilterSchemaFor,
//   getModelSchemaRef,
//   getWhereSchemaFor,
//   patch,
//   put,
//   del,
//   requestBody,
//   RestBindings,
//   Request
// } from '@loopback/rest';
// import { Zone } from '../models';
// import { ZoneRepository } from '../repositories';
// import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
// import { authorize } from '@loopback/authorization';
// import { TokenService, UserService, authenticate } from '@loopback/authentication';
// import { EMPCAuthorization } from '../services';
// import { inject } from '@loopback/context';

// export class ZoneController {
//   constructor(
//     @repository(ZoneRepository)
//     public zoneRepository: ZoneRepository,
//     @inject(RestBindings.Http.REQUEST) private request: Request,
//   ) { }

//   @post('/zones', {
//     responses: {
//       '200': {
//         description: 'Zone model instance',
//         content: { 'application/json': { schema: getModelSchemaRef(Zone) } },
//       },
//     },
//   })
//   @authenticate('jwt')
//   @authorize({ allowedRoles: ['master', 'admin'], voters: [EMPCAuthorization] })
//   async create(
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Zone, {
//             title: 'NewZone',
//             exclude: ['_id'],
//           }),
//         },
//       },
//     })
//     zone: Omit<Zone, '_id'>,
//   ): Promise<Zone> {
//     return this.zoneRepository.create(zone);
//   }

//   @get('/zones/count', {
//     responses: {
//       '200': {
//         description: 'Zone model count',
//         content: { 'application/json': { schema: CountSchema } },
//       },
//     },
//   })
//   async count(
//     @param.query.object('where', getWhereSchemaFor(Zone)) where?: Where<Zone>,
//   ): Promise<Count> {
//     return this.zoneRepository.count(where);
//   }

//   @get('/zones', {
//     responses: {
//       '200': {
//         description: 'Array of Zone model instances',
//         content: {
//           'application/json': {
//             schema: {
//               type: 'array',
//               items: getModelSchemaRef(Zone, { includeRelations: true }),
//             },
//           },
//         },
//       },
//     },
//   })
//   async find(
//     @param.query.object('filter', getFilterSchemaFor(Zone)) filter?: Filter<Zone>,
//   ): Promise<Zone[]> {
//     // console.log(JSON.parse(this.request.query.filter));
//     // console.log(filter);
//     return this.zoneRepository.find({
//       where: { name: 'E' },
//       offset: 0,
//       limit: 100,
//       skip: 0,
//       order: ['string'],
//       include: [{
//         relation: 'officers', scope: {
//           fields: {
//           }
//         }
//       }]
//     });
//   }

//   @patch('/zones', {
//     responses: {
//       '200': {
//         description: 'Zone PATCH success count',
//         content: { 'application/json': { schema: CountSchema } },
//       },
//     },
//   })
//   async updateAll(
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Zone, { partial: true }),
//         },
//       },
//     })
//     zone: Zone,
//     @param.query.object('where', getWhereSchemaFor(Zone)) where?: Where<Zone>,
//   ): Promise<Count> {
//     return this.zoneRepository.updateAll(zone, where);
//   }

//   @get('/zones/{id}', {
//     responses: {
//       '200': {
//         description: 'Zone model instance',
//         content: {
//           'application/json': {
//             schema: getModelSchemaRef(Zone, { includeRelations: true }),
//           },
//         },
//       },
//     },
//   })
//   async findById(
//     @param.path.string('id') id: string,
//     @param.query.object('filter', getFilterSchemaFor(Zone)) filter?: Filter<Zone>
//   ): Promise<Zone> {
//     return this.zoneRepository.findById(id, filter);
//   }

//   @patch('/zones/{id}', {
//     responses: {
//       '204': {
//         description: 'Zone PATCH success',
//       },
//     },
//   })
//   async updateById(
//     @param.path.string('id') id: string,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Zone, { partial: true }),
//         },
//       },
//     })
//     zone: Zone,
//   ): Promise<void> {
//     await this.zoneRepository.updateById(id, zone);
//   }

//   @put('/zones/{id}', {
//     responses: {
//       '204': {
//         description: 'Zone PUT success',
//       },
//     },
//   })
//   async replaceById(
//     @param.path.string('id') id: string,
//     @requestBody() zone: Zone,
//   ): Promise<void> {
//     await this.zoneRepository.replaceById(id, zone);
//   }

//   @del('/zones/{id}', {
//     responses: {
//       '204': {
//         description: 'Zone DELETE success',
//       },
//     },
//   })
//   async deleteById(@param.path.string('id') id: string): Promise<void> {
//     await this.zoneRepository.deleteById(id);
//   }
// }
