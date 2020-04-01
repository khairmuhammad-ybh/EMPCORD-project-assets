/**-----------------------------------------------------------------------
 * Created on Tue Mar 24 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Tue Mar 24 2020 5:06:19 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/
import { SecuritySchemeObject, ReferenceObject } from '@loopback/openapi-v3';
export const SECURITY_SPEC = [{ bearerAuth: [] }];
export const SECURITY_SPEC_OPERATION = [{ basicAuth: [] }];
export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};
export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
  basicAuth: {
    type: 'http',
    scheme: 'basic'
  }
};
