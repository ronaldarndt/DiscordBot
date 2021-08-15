import 'reflect-metadata';

export const optionalParameterMetadataKey = Symbol('optional');

export function getDecoratorInstances<T>(target: any, key: symbol) {
  const meta = Reflect.getOwnMetadata(key, target) ?? [];

  return meta as T[];
}
