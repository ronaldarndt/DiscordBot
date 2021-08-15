import 'reflect-metadata';
import { optionalParameterMetadataKey } from './decoratorMetadata';

type Class = { new (...args: unknown[]): Class; [key: string]: unknown };

export function optional(
  target: Class,
  propertyKey: string,
  parameterIndex: number
) {
  const targetMethod = propertyKey in target ? target[propertyKey] : null;

  if (typeof targetMethod != 'function') {
    throw new Error(
      'Error! Optional decorator can only be used on method parameters!'
    );
  }

  const existingOptionalParams: number[] =
    Reflect.getOwnMetadata(optionalParameterMetadataKey, targetMethod) || [];

  existingOptionalParams.push(parameterIndex);

  Reflect.defineMetadata(
    optionalParameterMetadataKey,
    existingOptionalParams,
    targetMethod
  );
}
