/**
 * Value Object
 *
 * Classe base abstrata para todos os objetos de valor.
 * Value Objects são imutáveis e definidos apenas por seus valores.
 * Dois Value Objects com os mesmos valores são considerados iguais.
 */
export abstract class ValueObject {
  /**
   * Compara dois Value Objects pela igualdade de seus valores
   * @param other Outro Value Object a ser comparado
   * @returns true se os Value Objects têm os mesmos valores
   */
  equals(other: ValueObject): boolean {
    if (!other) {
      return false;
    }

    if (this.constructor !== other.constructor) {
      return false;
    }

    return JSON.stringify(this) === JSON.stringify(other);
  }
}
