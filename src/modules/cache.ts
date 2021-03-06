type AsyncFactory<T> = () => Promise<T>;

class AsynCache<T> {
  private _factoryAsync: AsyncFactory<T>;
  private _timeout: number;
  private _lastCheck = 0;
  private _value?: T;

  constructor(timeout: number, factoryAsync: AsyncFactory<T>) {
    this._factoryAsync = factoryAsync;
    this._timeout = timeout;
  }

  getAsync = async () => {
    const now = new Date().getTime();

    if (!this._value || now - this._lastCheck > this._timeout) {
      this._value = await this._factoryAsync();
      this._lastCheck = now;
    }

    return this._value;
  };

  invalidate = () => {
    this._value = undefined;
  };
}

export { AsynCache };
