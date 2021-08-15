declare global {
  interface Array<T> {
    skip(this: Array<T>, amount: number): Array<T>;
  }
}

Array.prototype.skip = function (amount: number) {
  return this.filter((_, i) => i >= amount);
};

export {};
