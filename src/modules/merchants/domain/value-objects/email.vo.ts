export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!email) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    this.value = email;
  }

  getValue(): string {
    return this.value;
  }
}
