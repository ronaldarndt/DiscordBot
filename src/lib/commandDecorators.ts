import 'reflect-metadata';
import { Class } from '../modules/types';
import { CommandPrototype } from './commands';

const parametersMetadataKey = Symbol('params');

interface Parameter {
  name: string;
  description: string;
  type: string;
  required: boolean;
}

function param(name: string, description: string, required = true) {
  return function (
    constructor: Class,
    propertyKey: string,
    parameterIndex: number
  ) {
    const target = constructor[propertyKey] as () => Promise<void>;

    const paramTypes = Reflect.getMetadata(
      'design:paramtypes',
      constructor,
      target.name
    );

    const value: Parameter = {
      name,
      description,
      required,
      type: paramTypes[parameterIndex].name
    };

    const parameters =
      Reflect.getMetadata(parametersMetadataKey, constructor, target.name) ||
      [];

    Reflect.defineMetadata(
      parametersMetadataKey,
      [...parameters, value],
      constructor,
      target.name
    );
  };
}

function getHandlerParameters(constructor: CommandPrototype): Array<Parameter> {
  const result = Reflect.getMetadata(
    parametersMetadataKey,
    constructor.prototype,
    'handlerAsync'
  );

  return result || [];
}

export { Parameter, param, getHandlerParameters, parametersMetadataKey };
