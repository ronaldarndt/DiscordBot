class AsynCache<T> {
  private _factoryAsync: () => Promise<T>;
  private _timeout: number;
  private _check: number;
  private _value: T;

  constructor(timeout: number, factoryAsync: () => Promise<T>) {
    this._factoryAsync = factoryAsync;
    this._timeout = timeout;
  }

  getAsync = async () => {
    const now = new Date().getTime();

    if (!this._value || now - this._check > this._timeout) {
      this._value = await this._factoryAsync();
      this._check = now;
    }

    return this._value;
  };

  invalidate = () => {
    this._value = undefined;
  };
}

class AsyncLazy<T> {
  private _factoryAsync: () => Promise<T>;
  private _value: T;

  loaded = false;

  constructor(factoryAsync: () => Promise<T>) {
    this._factoryAsync = factoryAsync;
  }

  getAsync = async () => {
    if (!this._value) {
      this._value = await this._factoryAsync();
      this.loaded = true;
    }

    return this._value;
  };
}

export { AsynCache, AsyncLazy };
