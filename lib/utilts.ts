import { Command } from '../commands';
import {
  getDecoratorInstances,
  optionalParameterMetadataKey,
} from './decoratorMetadata';

type ParseReturn = [boolean, string[]];
type Handler = Command['handler'];

const tryParseCommand = (text: Array<string>, handler: Handler) => {
  const parameters = text.slice(1);
  const length = handler.length - 1;

  const optionalArgsCount = getDecoratorInstances<number>(
    handler,
    optionalParameterMetadataKey
  ).reduce((acc, v) => acc + v, 0);

  const success = between(
    parameters.length,
    length - optionalArgsCount,
    length
  );

  return [success, parameters] as ParseReturn;
};

const between = (n: number, min: number, max: number) => {
  return n >= min && n <= max;
};

export { tryParseCommand };
