import 'reflect-metadata';
import { optionalParameterMetadataKey } from './decoratorMetadata';

type Class = { new (...args: any[]): any; [key: string]: any };

export function optional(target: Class, propertyKey: string, parameterIndex: number) {
  const targetMethod = propertyKey in target ? target[propertyKey] : null;

  if (typeof targetMethod != 'function') {
    throw { Message: 'Error! Optional decorator can only be used on method parameters!' };
  }

  const existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(optionalParameterMetadataKey, targetMethod) || [];

  existingRequiredParameters.push(parameterIndex);

  Reflect.defineMetadata(optionalParameterMetadataKey, existingRequiredParameters, targetMethod);
}
