import { CommandHandler } from '../modules/types';
import {
  getDecoratorInstances,
  optionalParameterMetadataKey,
} from './decoratorMetadata';

type ParseReturn = [boolean, string[]];

const tryParseCommand = (text: Array<string>, handler: CommandHandler) => {
  const parameters = text.slice(1);

  const optionalArgsCount = getDecoratorInstances<number>(
    handler,
    optionalParameterMetadataKey
  ).length;

  const success = between(
    parameters.length,
    handler.length,
    handler.length + optionalArgsCount
  );

  return [success, parameters] as ParseReturn;
};

const between = (n: number, min: number, max: number) => {
  return n >= min && n <= max;
};

export { tryParseCommand };
