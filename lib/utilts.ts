import { Command } from '../commands';
import { getDecoratorInstances, optionalParameterMetadataKey } from './decoratorMetadata';

export const tryParseCommand = (messageText: Array<string>, handler: Command['handler']): [boolean, string[]] => {
  const parameters = messageText.splice(1, messageText.length - 1);

  const optionalArgsCount = getDecoratorInstances<number>(handler, optionalParameterMetadataKey).reduce(
    (acc, v) => acc + v,
    0
  );

  return [parameters.length === handler.length - optionalArgsCount - 1, parameters];
};
