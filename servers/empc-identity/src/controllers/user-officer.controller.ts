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
//   User,
//   Officer,
// } from '../models';
// import {UserRepository} from '../repositories';

// export class UserOfficerController {
//   constructor(
//     @repository(UserRepository) protected userRepository: UserRepository,
//   ) { }

//   @get('/users/{id}/officer', {
//     responses: {
//       '200': {
//         description: 'User has one Officer',
//         content: {
//           'application/json': {
//             schema: getModelSchemaRef(Officer),
//           },
//         },
//       },
//     },
//   })
//   async get(
//     @param.path.string('id') id: string,
//     @param.query.object('filter') filter?: Filter<Officer>,
//   ): Promise<Officer> {
//     return this.userRepository.officer(id).get(filter);
//   }

//   @post('/users/{id}/officer', {
//     responses: {
//       '200': {
//         description: 'User model instance',
//         content: {'application/json': {schema: getModelSchemaRef(Officer)}},
//       },
//     },
//   })
//   async create(
//     @param.path.string('id') id: typeof User.prototype._id,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Officer, {
//             title: 'NewOfficerInUser',
//             exclude: ['officerId'],
//             optional: ['userId']
//           }),
//         },
//       },
//     }) officer: Omit<Officer, 'officerId'>,
//   ): Promise<Officer> {
//     return this.userRepository.officer(id).create(officer);
//   }

//   @patch('/users/{id}/officer', {
//     responses: {
//       '200': {
//         description: 'User.Officer PATCH success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async patch(
//     @param.path.string('id') id: string,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Officer, {partial: true}),
//         },
//       },
//     })
//     officer: Partial<Officer>,
//     @param.query.object('where', getWhereSchemaFor(Officer)) where?: Where<Officer>,
//   ): Promise<Count> {
//     return this.userRepository.officer(id).patch(officer, where);
//   }

//   @del('/users/{id}/officer', {
//     responses: {
//       '200': {
//         description: 'User.Officer DELETE success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async delete(
//     @param.path.string('id') id: string,
//     @param.query.object('where', getWhereSchemaFor(Officer)) where?: Where<Officer>,
//   ): Promise<Count> {
//     return this.userRepository.officer(id).delete(where);
//   }
// }
