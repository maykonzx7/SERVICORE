import { ValueObject } from "@shared/domain/value-object";

/**
 * CNPJ Value Object
 *
 * Representa um CNPJ (Cadastro Nacional da Pessoa Jurídica) válido
 */
export class CNPJ extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  /**
   * Cria um CNPJ a partir de uma string
   * Remove formatação automaticamente
   * @param value CNPJ com ou sem formatação
   * @returns Instância de CNPJ
   * @throws Error se o CNPJ for inválido
   */
  static create(value: string): CNPJ {
    // Remove formatação
    const cleanValue = value.replace(/[^\d]/g, "");

    return new CNPJ(cleanValue);
  }

  /**
   * Valida se o CNPJ é válido
   * @throws Error se o CNPJ for inválido
   */
  private validate(): void {
    if (!this.value || this.value.length === 0) {
      throw new Error("CNPJ cannot be empty");
    }

    // CNPJ deve ter 14 dígitos
    if (this.value.length !== 14) {
      throw new Error("CNPJ must have 14 digits");
    }

    // Verifica se todos os dígitos são iguais (CNPJ inválido)
    if (/^(\d)\1+$/.test(this.value)) {
      throw new Error("Invalid CNPJ: all digits are the same");
    }

    // Validação dos dígitos verificadores
    if (!this.validateCheckDigits()) {
      throw new Error("Invalid CNPJ: check digits are invalid");
    }
  }

  /**
   * Valida os dígitos verificadores do CNPJ
   * @returns true se os dígitos verificadores forem válidos
   */
  private validateCheckDigits(): boolean {
    const digits = this.value.split("").map(Number);
    const checkDigits = digits.slice(12);

    // Calcula primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights1[i];
    }
    const remainder1 = sum % 11;
    const calculatedDigit1 = remainder1 < 2 ? 0 : 11 - remainder1;

    if (calculatedDigit1 !== checkDigits[0]) {
      return false;
    }

    // Calcula segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += digits[i] * weights2[i];
    }
    const remainder2 = sum % 11;
    const calculatedDigit2 = remainder2 < 2 ? 0 : 11 - remainder2;

    return calculatedDigit2 === checkDigits[1];
  }

  /**
   * Retorna o CNPJ sem formatação (apenas números)
   */
  toString(): string {
    return this.value;
  }

  /**
   * Retorna o CNPJ formatado (XX.XXX.XXX/XXXX-XX)
   */
  toFormattedString(): string {
    return this.value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  /**
   * Compara dois CNPJs
   * @param other Outro CNPJ
   * @returns true se os CNPJs forem iguais
   */
  equals(other: CNPJ): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}

