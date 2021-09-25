import { singleton } from 'tsyringe';
import { b } from '../modules/number';

const hexFactor = b(16);

@singleton()
class ConversionsService {
  public hexToDecimal(hex: string) {
    hex = hex.toLowerCase();

    if (!/^[0-9a-f]*$/.test(hex)) {
      return 'String hex inválida';
    }

    return hex
      .split('')
      .reduce(
        (acc, curr, i, arr) =>
          acc + this.hexCharToValue(curr) * hexFactor ** b(arr.length - 1 - i),
        b(0)
      )
      .toString();
  }

  private hexCharToValue(n: string) {
    const number = Number(n);

    const result = isNaN(number) ? n.charCodeAt(0) - 87 : number;

    return b(result);
  }
}

export { ConversionsService };
