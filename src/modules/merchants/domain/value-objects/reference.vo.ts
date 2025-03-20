export class Reference {
  private readonly value: string;

  constructor(email: string) {
    if (!email) {
      throw new Error('Email is required to generate reference');
    }

    this.value = email.split('@')[0];
  }

  getValue(): string {
    return this.value;
  }
}
