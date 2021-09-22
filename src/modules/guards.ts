import { Constructor } from './types';

function isClassConstructor<T>(obj: unknown): obj is Constructor<T> {
  return (
    typeof obj === 'function' && obj.prototype && obj.prototype.constructor
  );
}

export { isClassConstructor };
